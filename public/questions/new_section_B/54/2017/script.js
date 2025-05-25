document.addEventListener("DOMContentLoaded", function () {
  const questionsList = document.getElementById("questions-list");
  let totalMarks = 0;

  const questions = [
    {
      question: "Picture A",
      type: "multiplechoice",
      choices: [
        "The boy is playing with the dog.",
        "The boy is pulling the dog.",
        "The boy is crying.",
      ],
      answer: "The boy is playing with the dog.",
    },
    {
      question: "Picture B",
      type: "multiplechoice",
      choices: [
        "The boy is crying.",
        "The boy is playing with the dog.",
        "The boy is pulling the dog's tail.",
      ],
      answer: "The boy is pulling the dog's tail.",
    },
    {
      question: "Picture C",
      type: "multiplechoice",
      choices: [
        "The boy is crying after being bitten by the dog.",
        "The boy is pulling the dog",
        "The boy is playing with the dog.",
      ],
      answer: "The boy is crying after being bitten by the dog.",
    },
    {
      question: "Picture D",
      type: "multiplechoice",
      choices: [
        "The boy is asking for help  from the father.",
        "The boy is riding the bicycle.",
        "They are taking the boy to the clinic.",
      ],
      answer: "The boy is asking for help  from the father.",
    },
    {
      question: "Picture E",
      type: "multiplechoice",
      choices: [
        "The boy is crying.",
        "The boy's father is tying his leg.",
        "The boy is going to the clinic.",
      ],
      answer: "The boy's father is tying his leg.",
    },
    {
      question: "Picture F",
      type: "multiplechoice",
      choices: [
        "The boy is crying for help.",
        "The boy is asking for help  from the father.",
        "The boy is ridden on the bicycle to the clinic.",
      ],
      answer: "The boy is ridden on the bicycle to the clinic.",
    },
    {
      question: "What mistake has the boy made in Picture B.",
      type: "multiplechoice",
      choices: [
        "Crying for help.",
        "Pulling the dog's tail.",
        "Playing with the dog.",
      ],
      answer: "Pulling the dog's tail.",
    },
    {
      question: "Where is the man taking the boy in Picture F?",
      type: "multiplechoice",
      choices: [
        "The man is taking the boy to the clinic.",
        "The man is taking the boy to the school.",
        "He is taking the boy to play with the dog.",
      ],
      answer: "The man is taking the boy to the clinic.",
    },
    {
      question:
        "What feeling do you think the boy had towards the dog afterwards?",
      type: "text",
      answer: ["Fear", "Hate", "Anger"],
    },
    {
      question: "Suggest a suitable title for the story.",
      type: "multiplechoice",
      choices: [
        "Dogs are always playful.",
        "Playing with a dog.",
        "Dogs are always friendly.",
      ],
      answer: "Playing with a dog.",
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
