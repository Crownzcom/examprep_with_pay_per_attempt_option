document.addEventListener("DOMContentLoaded", function () {
  const questionsList = document.getElementById("questions-list");
  let totalMarks = 0;

  const questions = [
    {
      question: "Who wrote this notice?",
      type: "multiplechoice",
      choices: [
        "The notice was written by the citizens of Uganda.",
        "The notice was written by members of parliament.",
        "The notice was written by the Chairman of the Electoral Commission.",
      ],
      answer:
        "The notice was written by the Chairman of the Electoral Commission.",
    },
    {
      question: "What is the notice about?",
      type: "multiplechoice",
      choices: [
        "The notice is about the president of Uganda.",
        "The notice is about upcoming elections in Uganda.",
        "The notice is about members of parliament in Uganda.",
      ],
      answer: "The notice is about upcoming elections in Uganda.",
    },
    {
      question: "Why do you think a 15 year old will not vote?",
      type: "multiplechoice",
      choices: [
        "A fifteeen year old will not vote because voting is only eligible for people above eighteen yaers of age.",
        "A fifteeen year old will not vote because voting is only eligible for people below eighteen yaers of age.",
      ],
      answer:
        "A fifteeen year old will not vote because voting is only eligible for people above eighteen yaers of age.",
    },
    {
      question: "Why do you think Mrs. Njoroge from Kenya will not vote?",
      type: "multiplechoice",
      choices: [
        "Mrs. Njoroge from kenya will not vote because she is below eighteen yaers of age.",
        "Mrs. Njoroge from kenya will vote because she is not Ugandan.",
        "Mrs. Njoroge from kenya will not vote because she is not Ugandan.",
      ],
      answer:
        "Mrs. Njoroge from kenya will not vote because she is not Ugandan.",
    },
    {
      question: "When does voting end?",
      type: "multiplechoice",
      choices: [
        "Voting ends on the 29th November, 2001.",
        "Voting ends on the 28th November, 2001.",
        "Voting ends on the 27th November, 2001.",
      ],
      answer: "Voting ends on the 29th November, 2001.",
    },
    {
      question: "Who is an adult?",
      type: "multiplechoice",
      choices: [
        "An adult is a person who is 18 years and below.",
        "An adult is a person who is 18 years and above.",
      ],
      answer: "An adult is a person who is 18 years and above.",
    },
    {
      question: "In which country are the elections taking place?",
      type: "text",
      answer: ["Uganda"],
    },
    {
      question: "What is the last date for collecting voters’ cards?",
      type: "multiplechoice",
      choices: [
        "The last date for collecting voters’ cards is 29th November, 2001.",
        "The last date for collecting voters’ cards is 28th November, 2001.",
        "The last date for collecting voters’ cards is 27th November, 2001.",
      ],
      answer:
        "The last date for collecting voters’ cards is 27th November, 2001.",
    },
    {
      question:
        "Which organization in responsible for conducting these elections?",
      type: "multiplechoice",
      choices: [
        "The organization responsible for conducting these elections is the Electoral Commission.",
        "The organization responsible for conducting these elections is the Parliament of Uganda.",
      ],
      answer:
        "The organization responsible for conducting these elections is the Electoral Commission.",
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
      (correctAnswer) => userAnswer === correctAnswer
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
    const storyContent = document.querySelector(".invitation").innerHTML;
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
