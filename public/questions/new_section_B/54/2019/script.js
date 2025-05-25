document.addEventListener("DOMContentLoaded", function () {
  const questionsList = document.getElementById("questions-list");
  let totalMarks = 0;

  const questions = [
    {
      question: "Picture A",
      type: "multiplechoice",
      choices: [
        "A man is kneading clay.",
        "A man is laying bricks.",
        "A man is building a house.",
      ],
      answer: "A man is kneading clay.",
    },
    {
      question: "Picture B",
      type: "multiplechoice",
      choices: [
        "A man is kneading clay.",
        "A man is building a house.",
        "The men are preparing to bake the bricks.",
      ],
      answer: "The men are preparing to bake the bricks.",
    },
    {
      question: "Picture C",
      type: "multiplechoice",
      choices: [
        "A man is kneading clay.",
        "The men are building a house.",
        "The men are preparing to bake the bricks.",
      ],
      answer: "The men are building a house.",
    },
    {
      question: "Picture D",
      type: "multiplechoice",
      choices: [
        "The men are roofing a house.",
        "The men are building a house.",
        "The men are preparing to bake the bricks.",
      ],
      answer: "The men are roofing a house.",
    },
    {
      question: "Picture E",
      type: "multiplechoice",
      choices: [
        "The men are building a house.",
        "The man is paying the men who helped him build the house.",
        "The man is being a paid.",
      ],
      answer: "The man is paying the men who helped him build the house.",
    },
    {
      question: "Picture F",
      type: "multiplechoice",
      choices: [
        "A priest is congragulating the man.",
        "The boy is asking for help  from the father.",
        "The boy is ridden on the bicycle to the clinic.",
      ],
      answer: "A priest is congragulating the man.",
    },
    {
      question: "From which material did the man make bricks?",
      type: "multiplechoice",
      choices: [
        "The man made the bricks from clay.",
        "The man made the bricks from sand.",
      ],
      answer: "The man made the bricks from clay.",
    },
    {
      question: "Who do you think is the owner of the new house in picture E?",
      type: "multiplechoice",
      choices: [
        "I think the house is owned by the reverend.",
        "I think the house is owned by the man who is with the reverend.",
      ],
      answer: "I think the house is owned by the man who is with the reverend.",
    },
    {
      question: "Why are the people kneeling down in picture F?",
      type: "multiplechoice",
      choices: [
        "People are kneeling in picture F because they are thanking the priest.",
        "People are kneeling in picture F because they are praying.",
      ],
      answer: "People are kneeling in picture F because they are praying.",
    },
    {
      question:
        "Why do you think the Reverend should be happy with the owner of the house?",
      type: "multiplechoice",
      choices: [
        "I think the reverend was happy wit the man because he was able to build himself a house.",
        "I think the reverend was happy because the man built him a house.",
      ],
      answer:
        "I think the reverend was happy wit the man because he was able to build himself a house.",
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
