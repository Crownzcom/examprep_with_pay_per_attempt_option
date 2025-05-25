document.addEventListener("DOMContentLoaded", function () {
  const questionsList = document.getElementById("questions-list");
  let totalMarks = 0;

  const questions = [
    {
      question: "What does the table show?",
      type: "multiplechoice",
      choices: [
        "The table shows pupils class work at Supa Primary School in 2017.",
        "The table shows the pupils at Supa Primary School in 2017.",
        "The table shows information about candidates PLE results at Supa Primary School in 2017.",
      ],
      answer:
        "The table shows information about candidates PLE results at Supa Primary School in 2017.",
    },
    {
      question: "How many candidates sat all the papers?",
      type: "multiplechoice",
      choices: [
        "Two candidates sat for all the papers.",
        "Eight candidates sat for all the papers.",
        "Five candidates sat for all the papers.",
      ],
      answer: "Eight candidates sat for all the papers.",
    },
    {
      question: "Who was the best candidate in this class?",
      type: "multiplechoice",
      choices: [
        "Apio Mary was the best candidate in this class.",
        "Sagula Moses was the best candidate in this class.",
        "Kajubi Daniel was the best candidate in this class.",
      ],
      answer: "Sagula Moses was the best candidate in this class.",
    },
    {
      question: "Which candidate could have gone to another school?",
      type: "multiplechoice",
      choices: [
        "Ayu Damali could have gone to another school.",
        "Welishe Hadad could have gone to another school.",
        "Talemwa Tabisa could have gone to another school.",
      ],
      answer: "Ayu Damali could have gone to another school.",
    },
    {
      question: "Who was the youngest candidate in this class?",
      type: "multiplechoice",
      choices: [
        "Ayu Damali was the youngest candidate in the class.",
        "Nankya Lucy was the youngest candidate in the class.",
        "Sebabi Twaha was the youngest candidate in the class.",
      ],
      answer: "Nankya Lucy was the youngest candidate in the class.",
    },
    {
      question: "Which subject was done best?",
      type: "multiplechoice",
      choices: [
        "Mathematics was the subject done best by the candidates.",
        "English was the subject done best by the candidates.",
        "Science was the subject done best by the candidates.",
      ],
      answer: "Mathematics was the subject done best by the candidates.",
    },
    {
      question: "What do you think happened to Welishe Hadad not to be graded?",
      type: "multiplechoice",
      choices: [
        "Welishe Hadad was not graded because he changed school.",
        "Welishe Hadad was not graded because he missed some subjects.",
        "Welishe Hadad was not graded because he failed the subjects.",
      ],
      answer: "Welishe Hadad was not graded because he missed some subjects.",
    },
    {
      question: "Which candidates got the same aggregate?",
      type: "multiplechoice",
      choices: [
        "Sagula Moses and Sebabi Twaha got the same aggregate.",
        "Apio Mary and Pesa Martha got the same aggregate.",
        "Apio Mary and Kajubi Daniel got the same aggregate.",
      ],
      answer: "Apio Mary and Kajubi Daniel got the same aggregate.",
    },
    {
      question: "How many candidates were females?",
      type: "multiplechoice",
      choices: [
        "There were a total of five female candidates.",
        "There were a total of six female candidates.",
        "There were a total of ten female candidates.",
      ],
      answer: "There were a total of five female candidates.",
    },
    {
      question: "Who got grade nine (9) in Mathematics?",
      type: "multiplechoice",
      choices: [
        "Pesa Martha got grade nine in Mathematics.",
        "Sebabi Twaha got grade nine in Mathematics.",
        "Talemwa Tabisa got grade nine in Mathematics.",
      ],
      answer: "Talemwa Tabisa got grade nine in Mathematics.",
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
    const storyContent = document.querySelector(".table").innerHTML;
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
