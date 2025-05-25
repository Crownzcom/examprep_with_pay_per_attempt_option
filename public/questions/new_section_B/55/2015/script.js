document.addEventListener("DOMContentLoaded", function () {
  const questionsList = document.getElementById("questions-list");
  let totalMarks = 0;

  const questions = [
    {
      question: "Whose family is shown in the picture?",
      type: "multiplechoice",
      choices: [
        "The father's family is shown in the picture.",
        "Mr. Njabire Joshua’s family is shown in the picture.",
        "The mother's family is shown in the picture.",
      ],
      answer: "Mr. Njabire Joshua’s family is shown in the picture.",
    },
    {
      question: "How many children has this family?",
      type: "multiplechoice",
      choices: [
        "This family has three children.",
        "This family has four children.",
        "This family has two children.",
      ],
      answer: "This family has three children.",
    },
    {
      question: "What are the people doing in the picture?",
      type: "multiplechoice",
      choices: [
        "The people in this picture are having dinner.",
        "The people in this picture are having breakfast.",
        "The people in this picture are having lunch.",
      ],
      answer: "The people in this picture are having lunch.",
    },
    {
      question: "Who is carrying food to the table?",
      type: "multiplechoice",
      choices: [
        "The mother is carrying food to the table.",
        "The father is carrying food to the table.",
        "The children is carrying food to the table.",
      ],
      answer: "The mother is carrying food to the table.",
    },
    {
      question: "Where are these people sitting?",
      type: "multiplechoice",
      choices: [
        "They are  sitting in the living room.",
        "They are  sitting at the dining table.",
        "They are  sitting outside.",
      ],
      answer: "They are  sitting at the dining table.",
    },
    {
      question: "What shows that father is sharing responsibility with mother?",
      type: "multiplechoice",
      choices: [
        "The father feeding the baby shows that he is sharing responsibility with mother.",
        "The father sitting with the family shows that he is sharing responsibility with mother.",
        "The father eating with the family shows that he is sharing responsibility with mother.",
      ],
      answer:
        "The father feeding the baby shows that he is sharing responsibility with mother.",
    },
    {
      question: "What do you call a brother to your father?",
      type: "text",
      answer: ["uncle"],
    },
    {
      question: "Which meal are they enjoying now?",
      type: "multiplechoice",
      choices: [
        "They are enjoying breakfast.",
        "They are enjoying dinner.",
        "They are enjoying lunch.",
      ],
      answer: "They are enjoying lunch.",
    },
    {
      question: "Why hasn’t one chair been occupied?",
      type: "multiplechoice",
      choices: [
        "It hasn’t been occupied because one family member is not around.",
        "It hasn’t been occupied because its the baby's seat.",
        "It hasn’t been occupied because the mother is still serving.",
      ],
      answer: "It hasn’t been occupied because the mother is still serving.",
    },
    {
      question: "Select a suitable title to this picture composition.",
      type: "multiplechoice",
      choices: [
        "Mr. Njabire Joshua’s family having lunch.",
        "Mr. Njabire Joshua’s family.",
        "Mr. Njabire Joshua.",
      ],
      answer: "Mr. Njabire Joshua’s family having lunch.",
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
    userAnswers.push({ story: content, totalMarks: totalMarks, category: 55 });
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
