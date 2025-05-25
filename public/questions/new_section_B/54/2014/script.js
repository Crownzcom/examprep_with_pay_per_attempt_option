document.addEventListener("DOMContentLoaded", function () {
  const questionsList = document.getElementById("questions-list");
  let totalMarks = 0;

  const questions = [
    {
      question: "Picture A",
      type: "multiplechoice",
      choices: [
        "The boy is planting.",
        "The boy is harvesting.",
        "The boy is digging.",
      ],
      answer: "The boy is digging.",
    },
    {
      question: "Picture B",
      type: "multiplechoice",
      choices: [
        "The boy is planting.",
        "The boy is harvesting.",
        "The boy is digging.",
      ],
      answer: "The boy is planting.",
    },
    {
      question: "Picture C",
      type: "multiplechoice",
      choices: [
        "The boy is harvesting maize.",
        "The boy is weeding maize.",
        "The boy is planting maize.",
      ],
      answer: "The boy is weeding maize.",
    },
    {
      question: "Picture D",
      type: "multiplechoice",
      choices: [
        "The boy is harvesting maize.",
        "The boy is weeding maize.",
        "The boy is planting maize.",
      ],
      answer: "The boy is harvesting maize.",
    },
    {
      question: "Picture E",
      type: "multiplechoice",
      choices: [
        "The boy is selling maize in the market.",
        "The boy is harvesting maize in the market.",
        "The boy is buy maize in the market.",
      ],
      answer: "The boy is selling maize in the market.",
    },
    {
      question: "Picture F",
      type: "multiplechoice",
      choices: [
        "The boy is buying a goat.",
        "The boy is selling a goat.",
        "The boy is selling maize in the market.",
      ],
      answer: "The boy is buying a goat.",
    },
    {
      question: "What is the boy holding a picture D?",
      type: "text",
      answer: ["A panga"],
    },
    {
      question: "What type of shoe is the boy wearing?",
      type: "text",
      answer: ["Gum boots"],
    },
    {
      question: " Where do you think the boy is in picture E?",
      type: "multiplechoice",
      choices: ["The boy is in the garden.", "The boy is in the market."],
      answer: "The boy is in the market.",
    },
    {
      question: "Why do you think the boy should be happy in picture F?",
      type: "multiplechoice",
      choices: [
        "He should be happy because he bought a goat.",
        "He should be happy because he harvested his maize.",
        "He should be happy because he sold his maize.",
      ],
      answer: "He should be happy because he bought a goat.",
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
    const storyContent = document.getElementById("questionImage").innerHTML;
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
