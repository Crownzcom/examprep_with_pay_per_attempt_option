document.addEventListener("DOMContentLoaded", function () {
  const questionsList = document.getElementById("questions-list");
  let totalMarks = 0;

  const questions = [
    {
      question: "Which season is talked about in the poem?",
      type: "multiplechoice",
      choices: [
        "The poem talks about people’s houses.",
        "The poem talks about causes floods and landslides.",
        "The poem talks about the rainy season.",
      ],
      answer: "The poem talks about the rainy season.",
    },
    {
      question: "What didn’t the heavy rains spare?",
      type: "multiplechoice",
      choices: [
        "The heavy rains didn't spare people’s crops..",
        "The heavy rains didn't spare people's lives.",
        "The heavy rains didn't spare people's livestock.",
      ],
      answer: "The heavy rains didn't spare people's lives.",
    },
    {
      question: "How did the heavy rains hit the ground?",
      type: "multiplechoice",
      choices: [
        "The heavy rains destroyed almost everything.",
        "The heavy rains hit the ground severely.",
        "The heavy rains caused floods and landslides.",
      ],
      answer: "The heavy rains hit the ground severely.",
    },
    {
      question: "What did the heavy rains do to people’s crops?",
      type: "multiplechoice",
      choices: [
        "The heavy rains destroyed almost everything.",
        "The heavy rains caused floods and landslides.",
        "The heavy rains hurt people's crops.",
      ],
      answer: "The heavy rains hurt people's crops.",
    },
    {
      question: "What happened to the livestock and trees?",
      type: "multiplechoice",
      choices: [
        "The heavy rains demolished livestock and trees.",
        "The heavy rains caused floods and landslides.",
        "The heavy rains hurt livestock and trees.",
      ],
      answer: "The heavy rains demolished livestock and trees.",
    },
    {
      question: "Apart from floods, what did the heavy rains cause?",
      type: "multiplechoice",
      choices: [
        "Apart from floods, destroyed almost everything.",
        "Apart from floods, hit the ground severely.",
        "Apart from floods, the heavy rains caused landslides.",
      ],
      answer: "Apart from floods, the heavy rains caused landslides.",
    },
    {
      question: "How was the writer of the poem affected by the heavy rains?",
      type: "multiplechoice",
      choices: [
        "The heavy rains destroyed the writer's crops.",
        "The heavy rains left the writer of the poem homeless.",
        "The heavy rains destroyed the writer's livestock.",
      ],
      answer: "The heavy rains left the writer of the poem homeless.",
    },
    {
      question: "Who is the writer of the poem?",
      type: "text",
      answer: "Natale Geraldine",
    },
  ];

  const synonymQuestions = [
    {
      mainQuestion:
        "Give another word or group of words with the same meaning as each of the underlined words in the space.",
      subQuestions: [
        {
          subQuestion: "demolished",
          type: "text",
          answer: ["destroyed"],
        },
        {
          subQuestion: "homeless",
          type: "text",
          answer: ["without a home"],
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
    userAnswers.push({ story: content, totalMarks: totalMarks, category: 54 });
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
