document.addEventListener("DOMContentLoaded", function () {
  const questionsList = document.getElementById("questions-list");
  let totalMarks = 0;

  const questions = [
    {
      question: "Picture A",
      type: "multiplechoice",
      choices: [
        "The children are carrying containers.",
        "The children are fetching water.",
        "The children are are going to fetch water.",
      ],
      answer: "The children are carrying containers.",
    },
    {
      question: "Picture B",
      type: "multiplechoice",
      choices: [
        "The children are carrying containers.",
        "The children are fetching water.",
        "The children are are going to fetch water.",
      ],
      answer: "The children are are going to fetch water.",
    },
    {
      question: "Picture C",
      type: "multiplechoice",
      choices: [
        "The children are carrying containers.",
        "The children are drawing water from a river.",
        "The children are are going to fetch water.",
      ],
      answer: "The children are drawing water from a river.",
    },
    {
      question: "Picture D",
      type: "multiplechoice",
      choices: [
        "The children are picking mangoes from a tree.",
        "The children are drawing water from a river.",
        "The children have stopped to get some mangoes.",
      ],
      answer: "The children have stopped to get some mangoes.",
    },
    {
      question: "Picture E",
      type: "multiplechoice",
      choices: [
        "The children are picking mangoes from a tree.",
        "The children are drawing water from a river.",
        "The children have stopped to get some mangoes.",
      ],
      answer: "The children are picking mangoes from a tree.",
    },
    {
      question: "Picture F",
      type: "multiplechoice",
      choices: [
        "The children are crying.",
        "The children are chasing away the cows.",
        "The children are drawing water from a river.",
      ],
      answer: "The children are crying.",
    },
    {
      question: "Why have the children put down their containers?",
      type: "multiplechoice",
      choices: [
        "The children put down their containers to drink some water.",
        "The children put down their containers to pick mangoes.",
        "The children put down their containers to chase away the cows.",
      ],
      answer: "The children put down their containers to pick mangoes.",
    },
    {
      question: "What are the cows doing in picture E?",
      type: "multiplechoice",
      choices: ["The cows are running away.", "The cows are drinking water."],
      answer: "The cows are drinking water.",
    },
    {
      question: "Where do you think the children went next in picture F?",
      type: "multiplechoice",
      choices: [
        "I think the children went back home.",
        "I think the children went back to the fetch water.",
      ],
      answer: "I think the children went back to the fetch water.",
    },
    {
      question: "Suggest a suitable title for the story",
      type: "multiplechoice",
      choices: [
        "The careless children.",
        "Cows drinking water.",
        "Children picking mangoes.",
      ],
      answer: "The careless children.",
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
