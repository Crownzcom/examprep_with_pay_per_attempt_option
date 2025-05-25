document.addEventListener("DOMContentLoaded", function () {
  const questionsList_A = document.getElementById("questions-list-A");
  const questionsList_B = document.getElementById("questions-list-B");
  let totalMarks = 0;
  let userAnswers = [];

  const questions_A = [
    {
      question: "What does the writer like?",
      type: "multiplechoice",
      choices: [
        "The writer likes his favorite game.",
        "The writer likes fans great happiness.",
        "The writer likes football.",
      ],
      answer: "The writer likes football.",
    },
    {
      question:
        "Apart from the young people, who else loves watching football?",
      type: "multiplechoice",
      choices: [
        "The writer also loves football.",
        "The old also loves football.",
        "The fans also loves football.",
      ],
      answer: "The old also loves football.",
    },
    {
      question: "What happens when the ball is in the net?",
      type: "multiplechoice",
      choices: [
        "When the ball is in the net fans rejoice.",
        "When the ball is in the net, the referee blows the whistle.",
        "When the ball is in the net the game stops.",
      ],
      answer: "When the ball is in the net fans rejoice.",
    },
    {
      question: "Who wrote the poem?",
      type: "multiplechoice",
      choices: [
        "The young and the old wrote the poem.",
        "Philip wrote the poem.",
        "Football lovers wrote the poem.",
      ],
      answer: "Philip wrote the poem.",
    },
    {
      question: "Suggest a suitable title for the poem.",
      type: "multiplechoice",
      choices: [
        "The sport loved by many.",
        "Football fans.",
        "Philip's favorite game.",
      ],
      answer: "Football fans.",
    },
  ];

  const questions_B = [
    {
      question: "Who knows about Orange fleshed sweet potatoes?",
      type: "multiplechoice",
      choices: [
        "Namu knows about orange fleshed sweet potatoes.",
        "Beda knows about orange fleshed sweet potatoes.",
      ],
      answer: "Namu knows about orange fleshed sweet potatoes.",
    },
    {
      question: "What is special about orange fleshed sweet potatoes?",
      type: "multiplechoice",
      choices: [
        "They are special because they are delicious and rich in carbohydrates.",
        "Orange fleshed sweet potatoes are special because they are very delicious and rich in vitamins.",
        "Orange fleshed sweet potatoes are special because they are in school gardens.",
      ],
      answer:
        "Orange fleshed sweet potatoes are special because they are very delicious and rich in vitamins.",
    },
    {
      question: "From where can one get the cuttings for planting?",
      type: "multiplechoice",
      choices: [
        "The cuttings can be found in some schools that grow orange fleshed sweet potatoes.",
        "The cuttinngs can be found in markets.",
        "The cuttinngs can be found in gardens in the district.",
      ],
      answer:
        "The cuttings can be found in some schools that grow orange fleshed sweet potatoes.",
    },
    {
      question:
        "How many ways can you prepare the orange fleshed sweet potatoes?",
      type: "multiplechoice",
      choices: [
        "You can prepare orange fleshed sweet potatoes in five ways.",
        "You can prepare orange fleshed sweet potatoes in one way.",
        "You can prepare orange fleshed sweet potatoes in four ways.",
      ],
      answer: "You can prepare orange fleshed sweet potatoes in five ways.",
    },
    {
      question:
        "Where does Beda want to plant the orange flesh sweet potatoes?",
      type: "multiplechoice",
      choices: [
        "Beda wants to plant them at home.",
        "Beda wants to plant them at school.",
        "Beda wants to plant them at home and at school.",
      ],
      answer: "Beda wants to plant them at home and at school.",
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
    const storyContent_1 = document.querySelector(".poem").innerHTML;
    userAnswers.push({ story: storyContent_1 });
    const storyContent_2 = document.querySelector(".conversation").innerHTML;
    userAnswers.push({ story: storyContent_2 });

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
