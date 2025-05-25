document.addEventListener("DOMContentLoaded", function () {
  const questionsList = document.getElementById("questions-list");
  let totalMarks = 0;

  const questions = [
    {
      question:
        "When will little girls and boys be able to govern this country?",
      type: "multiplechoice",
      choices: [
        "The little girls and boys will be able to govern this country when they are great women and men.",
        "The little girls and boys will be able to govern this country when they walk hand with their children.",
        "The little girls and boys will be able to govern this country when they are responsible mothers and fathers.",
      ],
      answer:
        "The little girls and boys will be able to govern this country when they are great women and men.",
    },
    {
      question: "What should those governing the country have?",
      type: "multiplechoice",
      choices: [
        "Those governing the country should have a dream.",
        "Those governing the country should have a spirit of love.",
        "Those governing the country should have responsible fathers and caring mothers.",
      ],
      answer: "Those governing the country should have a spirit of love.",
    },
    {
      question: "What must the little boy not do to his little sister?",
      type: "multiplechoice",
      choices: [
        "The little boy should not hate his little sister.",
        "The little boy should not despise his little sister.",
      ],
      answer: "The little boy should not despise his little sister.",
    },
    {
      question: "What must the little sister not do to her little brother?",
      type: "multiplechoice",
      choices: [
        "The little sister should not hate his little brother.",
        "The little sister should not despise his little brother.",
      ],
      answer: "The little sister should not hate his little brother.",
    },
    {
      question: "What is the responsibility of fathers over their children?",
      type: "multiplechoice",
      choices: [
        "The responsibility fathers have over their children is to care for them.",
        "The responsibility of fathers over their children is to educate them.",
      ],
      answer:
        "The responsibility of fathers over their children is to educate them.",
    },
    {
      question: "What responsibility do mothers have over their children?",
      type: "multiplechoice",
      choices: [
        "The responsibility mothers have over their children is to care for them.",
        "The responsibility of mothers over their children is to educate them.",
      ],
      answer:
        "The responsibility mothers have over their children is to care for them.",
    },
    {
      question: "Select a suitable title for this poem.",
      type: "multiplechoice",
      choices: ["A Dream For The Youth.", "My Country.", "Governing."],
      answer: "A Dream For The Youth.",
    },
  ];

  const synonymQuestions = [
    {
      mainQuestion:
        "Give another word or group of words with the same meaning as each of the underlined words in the space.",
      subQuestions: [
        {
          subQuestion: "Governing",
          type: "text",
          answer: ["leading", "guiding", "ruling", "presiding"],
        },
        {
          subQuestion: "Wealth",
          type: "text",
          answer: ["riches", "plenty", "fortune"],
        },
        {
          subQuestion: "Hatred",
          type: "text",
          answer: ["dislike", "strong dislike", "disgust"],
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

      const userAnswerElement = createElement("p", "user-answer");

      userAnswerElement.innerHTML = `User Answer: ${userAnswer}`;
      item.appendChild(userAnswerElement);
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

    const storyContent = document.querySelector(".poem").innerHTML;
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
