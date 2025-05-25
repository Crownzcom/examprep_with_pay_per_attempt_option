document.addEventListener("DOMContentLoaded", function () {
  const questionsList = document.getElementById("questions-list");
  let totalMarks = 0;

  const questions = [
    {
      question: "Picture A",
      type: "multiplechoice",
      choices: [
        "Some boys and girls have gathered in the field.",
        "A teacher is showing to the children how to begin the race.",
        "The children are standing next to their lanes.",
      ],
      answer: "Some boys and girls have gathered in the field.",
    },
    {
      question: "Picture B",
      type: "multiplechoice",
      choices: [
        "Some boys and girls have gathered in the field.",
        "A teacher is showing to the children how to begin the race.",
        "The children are standing next to their lanes.",
      ],
      answer: "The children are standing next to their lanes.",
    },
    {
      question: "Picture C",
      type: "multiplechoice",
      choices: [
        "Some boys and girls have gathered in the field.",
        "A teacher is showing to the children how to begin the race.",
        "The children are standing next to their lanes.",
      ],
      answer: "A teacher is showing to the children how to begin the race.",
    },
    {
      question: "Picture D",
      type: "multiplechoice",
      choices: [
        "One of the boys is leading in the race.",
        "The children are running.",
        "The children have began the race.",
      ],
      answer: "The children have began the race.",
    },
    {
      question: "Picture E",
      type: "multiplechoice",
      choices: [
        "One of the boys is leading in the race.",
        "The children are running.",
        "The children have began the race.",
      ],
      answer: "The children are running.",
    },
    {
      question: "Picture F",
      type: "multiplechoice",
      choices: [
        "One of the boys is leading in the race.",
        "The children are running.",
        "The children have began the race.",
      ],
      answer: "One of the boys is leading in the race.",
    },
    {
      question: "What is the teacher doing in picture C?",
      type: "multiplechoice",
      choices: [
        "The teacher is starting the race.",
        "The teacher is running in the race.",
        "The teacher is explaining to the children how to begin the race.",
      ],
      answer:
        "The teacher is explaining to the children how to begin the race.",
    },
    {
      question:
        "Why are the hands of the pupils not in the pockets in picture D?",
      type: "multiplechoice",
      choices: [
        "The hands of the pupils are not in the pockets in picture D because they have started running.",
        "The hands of the pupils are not in the pockets in picture D because they are about to start the race.",
        "The hands of the pupils are not in the pockets in picture D because they have gathered in the field.",
      ],
      answer:
        "The hands of the pupils are not in the pockets in picture D because they have started running.",
    },
    {
      question: "Who is in the second place in picture F?",
      type: "multiplechoice",
      choices: [
        "A boy is in the second place in picture F.",
        "A girl is in the second place in picture F.",
      ],
      answer: "A girl is in the second place in picture F.",
    },
    {
      question: "Suggest a suitable title for this story?",
      type: "multiplechoice",
      choices: ["The Race.", "Boys Running.", "Girls Running."],
      answer: "The Race.",
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
