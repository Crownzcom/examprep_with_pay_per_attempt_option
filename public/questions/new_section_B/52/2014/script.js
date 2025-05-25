document.addEventListener("DOMContentLoaded", function () {
  const questionsList = document.getElementById("questions-list");
  let totalMarks = 0;

  const questions = [
    {
      question: "Which teacher used the above register?",
      type: "multiplechoice",
      choices: [
        "Teacher  Agaba Joseph used the above register.",
        "Teacher Namiiro Theopista used the above register.",
        "Apendi Stacy Theopista used the above register.",
      ],
      answer: "Teacher Namiiro Theopista used the above register.",
    },
    {
      question: "In which school was the register used?",
      type: "text",
      answer: "Buzzy primary school",
    },
    {
      question: "Who is the youngest boy in the class?",
      type: "multiplechoice",
      choices: [
        "The youngest boy is Ichat Mark.",
        "The youngest boy is Bazira Byron.",
        "The youngest boy is Waiswa Bruno.",
      ],
      answer: "The youngest boy is Waiswa Bruno.",
    },
    {
      question: "Which pupil had the poorest attendance in class?",
      type: "multiplechoice",
      choices: [
        "Bazira Byron has the poorest attendance in class.",
        "Walugonza Brian has the poorest attendance in class.",
        "Namukuya Brenda has the poorest attendance in class.",
      ],
      answer: "Bazira Byron has the poorest attendance in class.",
    },
    {
      question: "Who was absent in the morning but present in the afternoon?",
      type: "multiplechoice",
      choices: [
        "Agaba Joseph was absent in the morning but present in the afternoon.",
        "Apendi Stacy was absent in the morning but present in the afternoon.",
        "Bazira Byron was absent in the morning but present in the afternoon.",
      ],
      answer:
        "Apendi Stacy was absent in the morning but present in the afternoon.",
    },
    {
      question: "On which day did the pupils go for holidays?",
      type: "text",
      answer: "Friday",
    },
    {
      question: "How many pupils were present on Monday of the first week?",
      type: "multiplechoice",
      choices: [
        "Twelve pupils were present on Monday of the first week.",
        "Fourteen pupils were present on Monday of the first week.",
        "Eleven pupils were present on Monday of the first week.",
      ],
      answer: "Twelve pupils were present on Monday of the first week.",
    },
    {
      question: "Who is the last pupil shown in the register?",
      type: "multiplechoice",
      choices: [
        "Bazira Byron is the last pupil shown in the register.",
        "Mutasa Aggrey is the last pupil shown in the register.",
        "Walugonza Brian is the last pupil shown in the register.",
      ],
      answer: "Walugonza Brian is the last pupil shown in the register.",
    },
    {
      question: "How many pupils were never absent?",
      type: "multiplechoice",
      choices: [
        "Five pupils were never absent.",
        "Three pupils were never absent.",
        "Six pupils were never absent.",
      ],
      answer: "Three pupils were never absent.",
    },
    {
      question: "On which day of the two weeks were all the pupils present?",
      type: "multiplechoice",
      choices: [
        "They were all present on Tuesday.",
        "They were all present on Friday.",
        "They were all present on Wednesday.",
      ],
      answer: "They were all present on Tuesday.",
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
      }
    }
    const storyContent = document.getElementById("questionImage").innerHTML;
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
