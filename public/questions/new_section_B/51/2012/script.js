document.addEventListener("DOMContentLoaded", function () {
  const questionsList = document.getElementById("questions-list");
  let totalMarks = 0;

  const questions = [
    {
      question: "Who teaches sciences in primary seven?",
      type: "multiplechoice",
      choices: [
        "Mrs. Byakiko teaches sciences in primary seven.",
        "Mr. Amu teaches sciences in primary seven.",
      ],
      answer: "Mr. Amu teaches sciences in primary seven.",
    },
    {
      question: "Where is Mr. Byakiko farm?",
      type: "multiplechoice",
      choices: [
        "Mr. Byakiko's farm is located at Kolonyi.",
        "Mr. Byakiko's farm is located at Kile Tea Estate.",
        "Mr. Byakiko's farm is located at Molo Boarding Primary School.",
      ],
      answer: "Mr. Byakiko's farm is located at Kolonyi.",
    },
    {
      question:
        "Give at least one way the primary seven pupils prepared for their journey",
      type: "multiplechoice",
      choices: [
        "They prepared for their journey by having breakfast.",
        "They prepared for their journey by bathing and getting dressed.",
        "They prepared for their journey by washing and ironing their uniforms.",
      ],
      answer:
        "They prepared for their journey by washing and ironing their uniforms.",
    },
    {
      question: "What happened immediately the bus reached the parking yard?",
      type: "multiplechoice",
      choices: [
        "The pupils boarded the bus.",
        "The pupils started rearing cattle and birds.",
        "The pupils started asking questions.",
      ],
      answer: "The pupils boarded the bus",
    },
    {
      question: "Who welcomed the pupils at the farm?",
      type: "multiplechoice",
      choices: [
        "Mrs. Byakika welcomed the pupils at the farm.",
        "Mr. Amu welcomed the pupils at the farm.",
      ],
      answer: "Mrs. Byakika welcomed the pupils at the farm.",
    },
    {
      question: "Mention the two units the farm had?",
      type: "multiplechoice",
      choices: [
        "The farm had livestock and crop units.",
        "The farm had coffee and crop greens.",
        "The farm had poultry and cows units.",
      ],
      answer: "The farm had livestock and crop units.",
    },
    {
      question: "In which unit did the pupil see the dairy cows?",
      type: "text",
      answer: "Livestock unit",
    },
    {
      question: "What did the pupil promise to do when they grow up?",
      type: "multiplechoice",
      choices: [
        "The pupils promised to board the school bus.",
        "The pupils promised to manage Mrs. Byakiko farm.",
        "The pupils promised to start their own farms when they grow up.",
      ],
      answer: "The pupils promised to start their own farms when they grow up.",
    },
  ];

  const synonymQuestions = [
    {
      mainQuestion:
        "Give another word or a group of words with the same meaning as each of the underlined words in the passage.",
      subQuestions: [
        {
          subQuestion: "Livestock ",
          type: "text",
          answer: ["Domestic animals", "Farm animals", "Cattle"],
        },
        {
          subQuestion: "Surprised  ",
          type: "text",
          answer: ["Astonished", "Amazed", "Shocked", "Stunned"],
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
