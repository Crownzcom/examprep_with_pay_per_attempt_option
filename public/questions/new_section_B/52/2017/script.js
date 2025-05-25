document.addEventListener("DOMContentLoaded", function () {
  const questionsList = document.getElementById("questions-list");
  let totalMarks = 0;

  const questions = [
    {
      question: "What is the advertisement about?",
      type: "multiplechoice",
      choices: [
        "It is about the different species of animals.",
        "The advertisement is about the exhibition.",
        "The advertisement is about face painting for children.",
      ],
      answer: "The advertisement is about the exhibition.",
    },
    {
      question: "Who has organized this event?",
      type: "multiplechoice",
      choices: [
        "Twenty participants have organised this event.",
        "The children organised this event.",
        "Furber has organized this event.",
      ],
      answer: "Furber has organized this event.",
    },
    {
      question: "Where will the event take place?",
      type: "multiplechoice",
      choices: [
        "The event will take place at Boma recreation ground.",
        "It will take place at 2nd - 8th December 2017.",
        "The event will take place at 8:00 am - 6:00 pm.",
      ],
      answer: "The event will take place at Boma recreation ground.",
    },
    {
      question: "How long will the event take?",
      type: "multiplechoice",
      choices: [
        "The event will take five days.",
        "The event will take seven days.",
        "The event will take six days.",
      ],
      answer: "The event will take seven days.",
    },
    {
      question: "On what date will the event start?",
      type: "multiplechoice",
      choices: [
        "The event will start at 8:00 am",
        "The event will start on 2nd December 2017.",
        "The event will start on 8th December 2017.",
      ],
      answer: "The event will start on 2nd December 2017.",
    },
    {
      question: "What do you think will excite children at the venue?",
      type: "multiplechoice",
      choices: [
        "Face painting will excite the children.",
        "Free charge for the first twenty participants will excite the children.",
        "Furber will excite the children.",
      ],
      answer: "Face painting will excite the children.",
    },
    {
      question:
        "How much would your parents pay if they were to go for the event?",
      type: "multiplechoice",
      choices: [
        "They would pay two thousand shillings.",
        "They would pay seven thousand shillings.",
        "They would pay five thousand shillings.",
      ],
      answer: "They would pay five thousand shillings.",
    },
    {
      question: "Why do you think most people will arrive early?",
      type: "multiplechoice",
      choices: [
        "Most people will arrive early because of face painting for children.",
        "Most people will arrive early because the first twenty participants will enter free of charge.",
        "Most people will arrive early because there will be different species of animals, snakes and birds.",
      ],
      answer:
        "Most people will arrive early because the first twenty participants will enter free of charge.",
    },
    {
      question: "Who wrote this advertisement?",
      type: "multiplechoice",
      choices: [
        "The management wrote this advertisement.",
        "Furber wrote this advertisement.",
        "Twenty participants wrote this advertisement.",
      ],
      answer: "The management wrote this advertisement.",
    },
    {
      question: "When was the advertisement written?",
      type: "multiplechoice",
      choices: [
        "The advertisement was written on 2nd December 2017",
        "The advertisement was written on 8th December 2017",
        "The advertisement was written on 2/11/2017.",
      ],
      answer: "The advertisement was written on 2/11/2017.",
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
          const correctAnswers = questionObj.answer.map((ans) => ans);
          if (correctAnswers.includes(userAnswer)) {
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
          if (userAnswer === questionObj.answer) {
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
      }
    }
    const storyContent = document.querySelector(".card").innerHTML;
    userAnswers.push({ story: storyContent });

    userAnswers = [];
    const content = document.querySelector(".content").innerHTML;
    userAnswers.push({ story: content, totalMarks: totalMarks, category: 52 });
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
