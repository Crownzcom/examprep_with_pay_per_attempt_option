document.addEventListener("DOMContentLoaded", function () {
  const questionsList = document.getElementById("questions-list");
  let totalMarks = 0;

  const questions = [
    {
      question: "When did the DEO of Kibu district write the letter?",
      type: "multiplechoice",
      choices: [
        "The DEO of Kibu district wrote the letter one week ago.",
        "The DEO of Kibu district wrote the letter one week after the end of the school first term.",
        "The DEO of Kibu district wrote the letter one week before the end of the school first term.",
      ],
      answer:
        "The DEO of Kibu district wrote the letter one week before the end of the school first term.",
    },
    {
      question: "To whom was the letter written?",
      type: "multiplechoice",
      choices: [
        "The letter was written to all the children in the district.",
        "The letter was written to all the parents in the district.",
        "The letter was written to all the head teachers of primary schools in the district.",
      ],
      answer:
        "The letter was written to all the head teachers of primary schools in the district.",
    },
    {
      question: "What was the most important thing the minister had said.",
      type: "multiplechoice",
      choices: [
        "The minister said that no primary school in the whole country is allowed to do any teaching during the school holidays.",
        "The minister said that the child cannot learn much at that time.",
        "The minister said his inspectors will be visiting schools, classrooms and private places.",
      ],
      answer:
        "The minister said that no primary school in the whole country is allowed to do any teaching during the school holidays.",
    },
    {
      question:
        "Why is it useless for parents to look for private teachers during holidays?",
      type: "multiplechoice",
      choices: [
        "It is useless because teachers are not allowed to teach during holidays.",
        "It is useless because children should do a lot of play while they are at home for holidays.",
        "It is useless because the children cannot learn much at that time as their brains are still very tired.",
      ],
      answer:
        "It is useless because the children cannot learn much at that time as their brains are still very tired.",
    },
    {
      question: "Why will the inspectors visit schools during holidays?",
      type: "multiplechoice",
      choices: [
        "Inspectors will visit schools during holidays so that they can see if teaching going on well.",
        "Inspectors will visit schools during holidays so that they can see if there is any teaching going on during holidays.",
      ],
      answer:
        "Inspectors will visit schools during holidays so that they can see if there is any teaching going on during holidays.",
    },
    {
      question: "Select a suitable title for this passage.",
      type: "multiplechoice",
      choices: [
        "The District Education Officer's Warning To Head teachers.",
        "The District Education Officer.",
        "School Head teachers.",
      ],
      answer: "The District Education Officer's Warning To Head teachers.",
    },
  ];

  const synonymQuestions = [
    {
      mainQuestion: "Write down two things children should do during holidays.",
      subQuestions: [
        {
          subQuestion: "",
          type: "text",
          answer:
            "Children should play a lot during holidays when they are at home.",
        },
        {
          subQuestion: "",
          type: "text",
          answer: "Children should help their parents with some work.",
        },
      ],
    },
    {
      mainQuestion:
        "Give another word or a group of words with the same meaning as each of the underlined words in the passage.",
      subQuestions: [
        {
          subQuestion: "complain",
          type: "text",
          answer: ["speak out against", "protest", "criticize"],
        },
        {
          subQuestion: "properly",
          type: "text",
          answer: ["well", "correctly", "suitably", "accurately"],
        },
      ],
    },
  ];

  function createElement(elementType, className) {
    const element = document.createElement(elementType);
    if (className) {
      element.classList.add(className);
    }
    return element;
  }

  function createTickElement() {
    const tickElement = createElement("span", "tick");
    tickElement.textContent = "\u2713";
    return tickElement;
  }

  function createCrossElement() {
    const crossElement = createElement("span", "cross");
    crossElement.textContent = "\u2717";
    return crossElement;
  }

  function evaluateUserAnswer(userAnswer, correctAnswers, item) {
    const isAnswerCorrect = correctAnswers.some(
      (correctAnswer) =>
        userAnswer.toLowerCase() === correctAnswer.toLowerCase()
    );

    if (isAnswerCorrect) {
      totalMarks++;
      item.appendChild(createTickElement());
    } else {
      item.appendChild(createCrossElement());

      const userAnswerElement = createElement("p", "user-answer");

      userAnswerElement.innerHTML = `User Answer: ${userAnswer}`;
      item.appendChild(userAnswerElement);

      const correctAnswerElement = createElement("span", "correct-answer");
      correctAnswerElement.textContent = `Correct answers: ${correctAnswers.join(
        ", "
      )}`;
      item.appendChild(correctAnswerElement);
    }
  }

  questions.forEach((questionObj, index) => {
    const listItem = document.createElement("li");
    listItem.innerHTML = `<span class="question-number"></span> ${questionObj.question}`;

    if (questionObj.type === "text") {
      const input = document.createElement("input");
      input.type = "text";
      input.placeholder = "Type your answer here";
      listItem.appendChild(input);
    } else if (questionObj.type === "multiplechoice") {
      const choicesContainer = document.createElement("div");

      questionObj.choices.forEach((choice) => {
        const label = document.createElement("label");
        const radio = document.createElement("input");
        radio.type = "radio";
        radio.name = `question-${index}`;
        radio.value = choice;
        label.appendChild(radio);
        label.appendChild(document.createTextNode(choice));
        choicesContainer.appendChild(label);
      });

      listItem.appendChild(choicesContainer);
    }

    questionsList.appendChild(listItem);
  });

  synonymQuestions.forEach((synonymQuestionObj, synonymIndex) => {
    const mainListItem = createElement("li", "main");
    mainListItem.innerHTML = `${synonymQuestionObj.mainQuestion}`;

    const subList = createElement("ul");

    synonymQuestionObj.subQuestions.forEach((subQuestionObj) => {
      const subListItem = createElement("li", "subs");
      subListItem.innerHTML = `${subQuestionObj.subQuestion}`;

      const input = createElement("input");
      input.type = "text";
      input.placeholder = "Type your answer here";
      subListItem.appendChild(input);

      subList.appendChild(subListItem);
    });

    mainListItem.appendChild(subList);
    questionsList.appendChild(mainListItem);
  });

  function evaluateAllAnswers() {
    const questionItems = questionsList.children;
    let userAnswers = [];

    //Passage and it's instruction attached to the user answers submission
    // const instruction = document.querySelector(".instruction").innerHTML;
    // userAnswers.push({ instruction: instruction });
    const storyContent = document.querySelector(".story").innerHTML;
    userAnswers.push({ story: storyContent });

    for (let i = 0; i < questionItems.length; i++) {
      const questionItem = questionItems[i];
      let userAnswer = "";

      if (i < questions.length) {
        const questionObj = questions[i];

        if (questionObj.type === "text") {
          const input = questionItem.querySelector("input");
          userAnswer = input.value.trim();
        } else if (questionObj.type === "multiplechoice") {
          const selectedChoice = questionItem.querySelector(
            `input[name="question-${i}"]:checked`
          );
          if (selectedChoice) {
            userAnswer = selectedChoice.value;
          }
        }

        if (Array.isArray(questionObj.answer)) {
          const correctAnswers = questionObj.answer.map((ans) =>
            ans.toLowerCase()
          );
          if (correctAnswers.includes(userAnswer.toLowerCase())) {
            totalMarks++;
            tickElement = createTickElement();
            questionItem.appendChild(tickElement);
          } else {
            crossElement = createCrossElement();
            questionItem.appendChild(crossElement);
            const correctAnswerElement = document.createElement("span");
            correctAnswerElement.classList.add("correct-answer");
            correctAnswerElement.textContent = `Correct answers: ${correctAnswers.join(
              ", "
            )}`;
            questionItem.appendChild(correctAnswerElement);
          }
        } else {
          if (userAnswer.toLowerCase() === questionObj.answer.toLowerCase()) {
            totalMarks++;
            tickElement = createTickElement();
            questionItem.appendChild(tickElement);
          } else {
            crossElement = createCrossElement();
            questionItem.appendChild(crossElement);
            const correctAnswerElement = document.createElement("span");
            correctAnswerElement.classList.add("correct-answer");
            correctAnswerElement.textContent = `Correct answer: ${questionObj.answer}`;
            questionItem.appendChild(correctAnswerElement);
          }
        }
        userAnswers.push({ question: questionObj, userAnswer });
      } else {
        const synonymIndex = i - questions.length;
        const synonymQuestionObj = synonymQuestions[synonymIndex];
        const subList = questionItem.querySelector("ul");
        const subQuestionItems = subList.children;

        for (let j = 0; j < subQuestionItems.length; j++) {
          const subQuestionItem = subQuestionItems[j];
          const subQuestionObj = synonymQuestionObj.subQuestions[j];
          const input = subQuestionItem.querySelector("input");
          userAnswer = input.value.trim();
          const correctAnswers = Array.isArray(subQuestionObj.answer)
            ? subQuestionObj.answer
            : [subQuestionObj.answer];
          evaluateUserAnswer(userAnswer, correctAnswers, subQuestionItem);
          userAnswers.push({ subQuestion: subQuestionObj, userAnswer });
        }
      }
    }
    userAnswers = [];
    const content = document.querySelector(".content").innerHTML;
    userAnswers.push({ story: content, totalMarks: totalMarks, category: 51 });
    const markedHTML = document.documentElement.outerHTML; 

parent.postMessage({ userAnswers, markedHTML }, window.location.origin);
  }

  window.addEventListener("message", (event) => {
    if (
      event.origin === window.location.origin ||
     event.origin === window.location.origin ||
      event.origin === "http://localhost:5173" ||
      event.origin === "http://localhost:5500" ||
      event.origin === "http://app.exampreptutor.com"
    ) {
      if (event.data === "callEvaluateAllAnswers") {
        evaluateAllAnswers();
      }
    } else {
      return;
    }
  });
});
