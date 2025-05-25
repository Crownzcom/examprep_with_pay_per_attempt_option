document.addEventListener("DOMContentLoaded", function () {
  const questionsList_A = document.getElementById("questions-list-A");
  const questionsList_B = document.getElementById("questions-list-B");
  let totalMarks = 0;
  let userAnswers = [];

  const questions_A = [
    {
      question: "Where can we find this information?",
      type: "multiplechoice",
      choices: [
        "We can find this information at Nkondo Primary School.",
        "We can find this information on the school notice board.",
        "We can find this information at Merikit Town Hall.",
      ],
      answer: "We can find this information on the school notice board.",
    },
    {
      question: "What is the information about?",
      type: "multiplechoice",
      choices: [
        "The information is about a debate.",
        "The information is about children.",
        "The information is about the parliament.",
      ],
      answer: "The information is about a debate.",
    },
    {
      question: "Which school will support the motion?",
      type: "multiplechoice",
      choices: [
        "Nkondo Primary School will support the motion.",
        "Peta Primary School will support the motion.",
      ],
      answer: "Peta Primary School will support the motion.",
    },
    {
      question: "How long will the debate take?",
      type: "multiplechoice",
      choices: [
        "The debate will take one and half hours.",
        "The debate will take two hours.",
        "The debate will take two and half hours.",
      ],
      answer: "The debate will take two and half hours.",
    },
    {
      question:
        "Why do you think many people may try to speak during the debate?",
      type: "multiplechoice",
      choices: [
        "Many people may try to speak during the debate because they will be proposers.",
        "Many people may try to speak during the debate because there will be a free soda.",
        "Many people may try to speak during the debate because they will be opposers.",
      ],
      answer:
        "Many people may try to speak during the debate because there will be a free soda.",
    },
  ];

  const questions_B = [
    {
      question: "Which company is advertising?",
      type: "multiplechoice",
      choices: [
        "Net media phone dealers is advertising.",
        "Etop Newspaper is advertising.",
        "Maama mobile phones is advertising.",
      ],
      answer: "Net media phone dealers is advertising.",
    },
    {
      question: "What does this company sell?",
      type: "multiplechoice",
      choices: [
        "This company sells sim cards.",
        "This company sells mobile phones.",
        "This company sells newspapers.",
      ],
      answer: "This company sells mobile phones.",
    },
    {
      question:
        "According to the advertisement, how can one get a free sim card?",
      type: "multiplechoice",
      choices: [
        "One can get a free sim card by advertising.",
        "One can get a free sim card by buying one cellular phone.",
      ],
      answer: "One can get a free sim card by buying one cellular phone.",
    },
    {
      question: "How long will this offer last?",
      type: "multiplechoice",
      choices: [
        "This offer will last for two months.",
        "This offer will last for one month.",
        "This offer will last for three months.",
      ],
      answer: "This offer will last for two months.",
    },
    {
      question: "Who wrote the advertisement?",
      type: "multiplechoice",
      choices: [
        "The management of Etop newspaper wrote the advertisement.",
        "The management of Net media phone dealers wrote the advertisement.",
        "The management of maama mobile phones wrote the advertisement.",
      ],
      answer:
        "The management of Net media phone dealers wrote the advertisement.",
    },
  ];

  function generateQuestionListItem(questionObj, index, group) {
    const listItem = document.createElement("li");
    listItem.innerHTML = `<span class="question-number"></span> ${questionObj.question}`;

    if (questionObj.type === "text") {
      const input = document.createElement("input");
      input.type = "text";
      input.placeholder = "Type your answer here";
      listItem.appendChild(input);
    } else if (questionObj.type === "multiplechoice") {
      const choicesContainer = document.createElement("div");

      questionObj.choices.forEach((choice, choiceIndex) => {
        const label = document.createElement("label");
        const radio = document.createElement("input");
        radio.type = "radio";
        radio.name = `question-${group}-${index}`;
        radio.value = choice;
        label.appendChild(radio);
        label.appendChild(document.createTextNode(choice));
        choicesContainer.appendChild(label);
      });

      listItem.appendChild(choicesContainer);
    }

    return listItem;
  }

  function evaluateAnswers(questions, questionList, group) {
    const questionItems = questionList.children;

    for (let i = 0; i < questionItems.length; i++) {
      const questionItem = questionItems[i];
      const questionObj = questions[i];
      let userAnswer = "";

      if (questionObj.type === "text") {
        const input = questionItem.querySelector("input");
        userAnswer = input.value.trim();
      } else if (questionObj.type === "multiplechoice") {
        const selectedChoice = questionItem.querySelector(
          `input[name="question-${group}-${i}"]:checked`
        );
        if (selectedChoice) {
          userAnswer = selectedChoice.value;
        }
      }

      const correctAnswers = Array.isArray(questionObj.answer)
        ? questionObj.answer
        : [questionObj.answer];
      const isAnswerCorrect = correctAnswers.some(
        (correctAnswer) =>
          userAnswer.toLowerCase() === correctAnswer.toLowerCase()
      );

      const tickElement = document.createElement("span");
      tickElement.classList.add("tick");
      tickElement.textContent = "\u2713";

      const crossElement = document.createElement("span");
      crossElement.classList.add("cross");
      crossElement.textContent = "\u2717";

      if (isAnswerCorrect) {
        totalMarks++;
        questionItem.appendChild(tickElement);
      } else {
        questionItem.appendChild(crossElement);
        const correctAnswerElement = document.createElement("span");
        correctAnswerElement.classList.add("correct-answer");
        if (questionObj.type === "text") {
          correctAnswerElement.textContent = `Correct answers: ${correctAnswers.join(
            ", "
          )}`;
        } else {
          correctAnswerElement.textContent = `Correct answer: ${correctAnswers}`;
        }
        questionItem.appendChild(correctAnswerElement);
      }
      userAnswers.push({ question: questionObj, userAnswer });
    }
  }

  questions_A.forEach((questionObj, index) => {
    const listItem = generateQuestionListItem(questionObj, index, "A");
    questionsList_A.appendChild(listItem);
  });

  questions_B.forEach((questionObj, index) => {
    const listItem = generateQuestionListItem(questionObj, index, "B");
    questionsList_B.appendChild(listItem);
  });

  function evaluateAllAnswers() {
    evaluateAnswers(questions_A, questionsList_A, "A");
    evaluateAnswers(questions_B, questionsList_B, "B");
    const storyContent_1 = document.querySelector(".conversation").innerHTML;
    userAnswers.push({ story: storyContent_1 });
    const storyContent_2 = document.querySelector(".card").innerHTML;
    userAnswers.push({ story: storyContent_2 });

    userAnswers = [];
    const content = document.querySelector(".content").innerHTML;
    userAnswers.push({ story: content, totalMarks: totalMarks, category: 55 });
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
