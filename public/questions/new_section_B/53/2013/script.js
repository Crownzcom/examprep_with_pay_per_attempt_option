document.addEventListener("DOMContentLoaded", function () {
  const questionsList = document.getElementById("questions-list");
  let totalMarks = 0;

  const questions = [
    {
      question: "Where are the birds?",
      type: "multiplechoice",
      choices: ["The birds are in the river.", "The birds are in the forest."],
      answer: "The birds are in the forest.",
    },
    {
      question: "Give the name of the River mentioned in the poem",
      type: "text",
      answer: "River Nile",
    },
    {
      question: "What are the boys and the girls doing at school?",
      type: "multiplechoice",
      choices: [
        "The boy and girls are singing at school.",
        "The boy and girls are learning at school.",
      ],
      answer: "The boy and girls are learning at school.",
    },
    {
      question: "Why do you think the leaves are shaking?",
      type: "multiplechoice",
      choices: [
        "I think the leaves are shaking because the wind is blowing them.",
        "The leaves are shaking because the birds are seated on them.",
        "I think the leaves are shaking because the sun is out.",
      ],
      answer:
        "I think the leaves are shaking because the wind is blowing them.",
    },
    {
      question: "What does the writer want to end?",
      type: "multiplechoice",
      choices: [
        "The writer wants the singing  to end.",
        "The writer wants the shaking to end.",
        "The writer wants the lesson to end.",
      ],
      answer: "The writer wants the lesson to end.",
    },
    {
      question: "In which class is the writer?",
      type: "multiplechoice",
      choices: [
        "The writer is in P5.",
        "The writer is in P6.",
        "The writer is in P7.",
      ],
      answer: "The writer is in P7.",
    },
    {
      question: "Is the writer a strong child?",
      type: "multiplechoice",
      choices: [
        "Yes, the writer is a strong child.",
        "No, the writer is not a strong child.",
      ],
      answer: "Yes, the writer is a strong child.",
    },
    {
      question: "What will the writer do when the sun is out?",
      type: "multiplechoice",
      choices: [
        "The write will sing when the sun is out.",
        "The write will greet all of them when the sun is out.",
        "The write will be strong when the sun is out.",
      ],
      answer: "The write will greet all of them when the sun is out.",
    },
  ];

  const synonymQuestions = [
    {
      mainQuestion:
        "Give another word or group of words with the same meaning as each of the underlined words in the space.",
      subQuestions: [
        {
          subQuestion: "waves",
          type: "text",
          answer: ["ripples"],
        },
        {
          subQuestion: "over ",
          type: "text",
          answer: ["done", "finished"],
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
    const storyContent = document.querySelector(".poem").innerHTML;
    userAnswers.push({ story: storyContent });

    userAnswers = [];
    const content = document.querySelector(".content").innerHTML;
    userAnswers.push({ story: content, totalMarks: totalMarks, category: 53 });
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
