document.addEventListener("DOMContentLoaded", function () {
  const questionsList = document.getElementById("questions-list");
  let totalMarks = 0;

  const questions = [
    {
      question: "Who built health centers in our communities?",
      type: "multiplechoice",
      choices: [
        "The local community members built the health centers.",
        "Private businesses built the health centers.",
        "The minister of health built the health centers.",
      ],
      answer: "The minister of health built the health centers.",
    },
    {
      question: "To whom do they provide health services?",
      type: "multiplechoice",
      choices: [
        "They provide health services to only government officials.",
        "They provide health services to the minister of health.",
        "They provide health services to the people in the communities.",
      ],
      answer: "They provide health services to the people in the communities.",
    },
    {
      question: "What do doctors and Nurses provide?",
      type: "multiplechoice",
      choices: [
        "Doctors and Nurses provide medical care and counseling services.",
        "Doctors and Nurses provide entertainment services.",
        "Doctors and Nurses provide food delivery services.",
      ],
      answer:
        "Doctors and Nurses provide medical care and counseling services.",
    },
    {
      question: "What type of foods shouldn’t people eat?",
      type: "multiplechoice",
      choices: [
        "People should not any type of food",
        "People should not eat food with harmful substances.",
        "People should not eat food with no taste.",
      ],
      answer: "People should not eat food with harmful substances.",
    },
    {
      question: "How can we control malaria in our community?",
      type: "multiplechoice",
      choices: [
        "Stagnant water should not be removed by people.",
        "People should avoid disease vectors like rats, mosquitoes and fleas.",
        "Taking measures like slashing, using clean water and removing stagnant water.",
      ],
      answer:
        "Taking measures like slashing, using clean water and removing stagnant water.",
    },
    {
      question: "Where can a pregnant mother get help?",
      type: "multiplechoice",
      choices: [
        "A pregnant mother can get help from doctors and nurses",
        "A pregnant mother can get help at the health centers.",
        "A pregnant mother can get help from the health minister.",
      ],
      answer: "A pregnant mother can get help at the health centers.",
    },
    {
      question: "How can people avoid diseases?",
      type: "multiplechoice",
      choices: [
        "They can avoid diseases by eating food that does not have harmful substances.",
        "People can avoid diseases by takinng measures like slashing the bushes around homelands.",
        "They can avoid diseases by avoiding disease vectors like rats, mosquitoes and fleas.",
      ],
      answer:
        "They can avoid diseases by avoiding disease vectors like rats, mosquitoes and fleas.",
    },
    {
      question: "Select a suitable title to the passage",
      type: "multiplechoice",
      choices: [
        "Health services to the people.",
        "Hygiene in the community.",
        "Doctors and nurses.",
      ],
      answer: "Health services to the people.",
    },
  ];

  const synonymQuestions = [
    {
      mainQuestion:
        "Give another word or a group of words with the same meaning as each of the underlined words in the passage.",
      subQuestions: [
        {
          subQuestion: "Patients",
          type: "text",
          answer: "Sick people",
        },
        {
          subQuestion: "Provide",
          type: "text",
          answer: "give",
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

      userAnswerElement.innerHTML = `Student Answer: ${userAnswer}`;
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

    const storyContent = document.querySelector(".story").innerHTML;
    userAnswers.push({ story: storyContent });

    userAnswers = [];
    const content = document.querySelector(".content").innerHTML;
    userAnswers.push({ story: content, totalMarks: totalMarks, category: 51 });
    const markedHTML = document.documentElement.outerHTML; 

parent.postMessage({ userAnswers, markedHTML }, window.location.origin);
  }

  window.addEventListener("message", (event) => {
    if (
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
