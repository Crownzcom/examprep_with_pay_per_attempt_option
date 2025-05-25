document.addEventListener("DOMContentLoaded", function () {
  const questionsList = document.getElementById("questions-list");
  let totalMarks = 0;
  const one = document.getElementById("one");
  const two = document.getElementById("two");
  const three = document.getElementById("three");
  const four = document.getElementById("four");
  const five = document.getElementById("five");
  let userAnswers = [];

  const correctValues = {
    one: "head teacher",
    two: "APPLICATION",
    three: "vacancy",
    four: "aggregate",
    five: "faithfully",
  };

  const questions = [
    {
      question: "What does the map show?",
      type: "multiplechoice",
      choices: [
        "The map shows  part of Rombo highway.",
        "The map shows  part of Rombo village.",
        "The map shows  part of Jagwer's post.",
      ],
      answer: "The map shows  part of Rombo village.",
    },
    {
      question: "Which road would Jangwer’s children take to reach school?",
      type: "multiplechoice",
      choices: [
        "They would take Market road.",
        "They would take Maliri road.",
        "They would take Rombo highway.",
      ],
      answer: "They would take Rombo highway.",
    },
    {
      question: "Which building is near the borehole?",
      type: "multiplechoice",
      choices: [
        "The police post is near the  borehole.",
        "The school buildigs are near the  borehole.",
        "The shops are near the  borehole.",
      ],
      answer: "The police post is near the  borehole.",
    },
    {
      question: "What is opposite the health center?",
      type: "multiplechoice",
      choices: [
        "The police post is opposite the health center.",
        "The forest is opposite the health center.",
        "The play  ground is opposite the health center.",
      ],
      answer: "The forest is opposite the health center.",
    },
    {
      question:
        "Apart from Rombo high war and Maliri road, which other road is shown on the map?",
      type: "text",
      answer: "Market road",
    },
  ];

  questions.forEach((questionObj, index) => {
    const listItem = document.createElement("li");
    listItem.innerHTML = `<span class="question-number"></span> ${questionObj.question}`;

    if (questionObj.type === "text") {
      const input = document.createElement("input");
      input.type = "text";
      input.classList.add("block-input");
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

  function evaluate() {
    const questionItems = questionsList.children;

    for (let i = 0; i < questionItems.length; i++) {
      const questionItem = questionItems[i];
      const questionObj = questions[i];
      let userAnswer = "";

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

      const tickElement = document.createElement("span");
      tickElement.classList.add("tick");
      tickElement.textContent = "\u2713";

      const crossElement = document.createElement("span");
      crossElement.classList.add("cross");
      crossElement.textContent = "\u2717";

      if (userAnswer.toLowerCase() === questionObj.answer.toLowerCase()) {
        totalMarks++;
        questionItem.appendChild(tickElement);
      } else {
        questionItem.appendChild(crossElement);
        const correctAnswerElement = document.createElement("span");
        correctAnswerElement.classList.add("correct-answer");
        correctAnswerElement.textContent = `Correct answer: ${questionObj.answer}`;
        questionItem.appendChild(correctAnswerElement);
      }
      userAnswers.push({ question: questionObj, userAnswer });
    }
  }

  function evaluateAllAnswers() {
    const storyContent = document.getElementById("questionImage").innerHTML;

    for (let key in correctValues) {
      const inputElement = document.getElementById(key);
      const inputValue = inputElement.value.trim();
      const correctValue = correctValues[key];

      const answerElement = document.getElementById(
        "ans" + key.charAt(0).toUpperCase() + key.slice(1)
      );
      answerElement.textContent = `(Correct answer: ${correctValue})`;

      userAnswers.push({
        question: key,
        userAnswer: inputValue,
        correctAnswer: correctValue,
      });

      if (inputValue === correctValue) {
        totalMarks++;
        inputElement.classList.remove("wrong");
        inputElement.classList.add("correct");
        answerElement.textContent = "";
      } else {
        inputElement.classList.remove("correct");
        inputElement.classList.add("wrong");
      }
    }
    evaluate();
    userAnswers.push({ story: storyContent });

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
