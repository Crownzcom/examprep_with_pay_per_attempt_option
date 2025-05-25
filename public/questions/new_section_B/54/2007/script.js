document.addEventListener("DOMContentLoaded", function () {
  const questionsList = document.getElementById("questions-list");
  let totalMarks = 0;

  const questions = [
    {
      question:
        "Which class had the highest number of malarial cases on Friday?",
      type: "multiplechoice",
      choices: [
        "P.1 is the class which had the highest number of malarial cases on Friday.",
        "P.4 is the class which had the highest number of malarial cases on Friday.",
        "P.2 is the class which had the highest number of malarial cases on Friday.",
      ],
      answer:
        "P.4 is the class which had the highest number of malarial cases on Friday.",
    },
    {
      question: "Which class had the least total number of malarial cases?",
      type: "multiplechoice",
      choices: [
        "P.6 had the least total number of malarial cases.",
        "P.7 had the least total number of malarial cases.",
        "P.5 had the least total number of malarial cases.",
      ],
      answer: "P.6 had the least total number of malarial cases.",
    },
    {
      question:
        "Which classes recorded the same number of malarial cases on Wednesday?",
      type: "multiplechoice",
      choices: [
        "P.2, P.4 and P.6 recorded the same number of malaria cases on Wednesday.",
        "P.3, P.4 and P.6 recorded the same number of malaria cases on Wednesday.",
        "P.3, P.4 and P.7 recorded the same number of malaria cases on Wednesday.",
      ],
      answer:
        "P.3, P.4 and P.6 recorded the same number of malaria cases on Wednesday.",
    },
    {
      question:
        "Which day of the week recorded the highest number of malarial cases?",
      type: "multiplechoice",
      choices: [
        "Thursday is the day of the week that recorded the highest number of malarial cases.",
        "Friday is the day of the week that recorded the highest number of malarial cases.",
        "Monday is the day of the week that recorded the highest number of malarial cases.",
      ],
      answer:
        "Monday is the day of the week that recorded the highest number of malarial cases.",
    },
    {
      question:
        "Which class recorded the lowest number of malarial cases on Wednesday?",
      type: "multiplechoice",
      choices: [
        "P.7 recorded the lowest number of malarial cases on Wednesday.",
        "P.5 recorded the lowest number of malarial cases on Wednesday.",
        "P.3 recorded the lowest number of malarial cases on Wednesday.",
      ],
      answer: "P.7 recorded the lowest number of malarial cases on Wednesday.",
    },
    {
      question: "Why do you think Tata Primary School is boarding?",
      type: "multiplechoice",
      choices: [
        "I think Tata Primary School is boarding because they have a sick bay.",
        "I think Tata Primary School is boarding because pupils get sick.",
      ],
      answer:
        "I think Tata Primary School is boarding because they have a sick bay.",
    },
    {
      question:
        "What do you say about the number of malarial cases from P.1 to P.7?",
      type: "multiplechoice",
      choices: [
        "The number of malarial cases reduced from P.I to P.7.",
        "The number of malarial cases increased from P.I to P.7.",
      ],
      answer: "The number of malarial cases reduced from P.I to P.7.",
    },
    {
      question:
        "Why do you think P.1 has the highest number of malarial cases?",
      type: "multiplechoice",
      choices: [
        "P.1 has the highest number of cases because P.1 pupils do not sleep under mosquito nets.",
        "P.1 has the highest number of cases because it has more young children.",
      ],
      answer:
        "P.1 has the highest number of cases because it has more young children.",
    },
    {
      question:
        "How many more malarial cases were recorded in P.1 than P.5 on Tuesday?",
      type: "multiplechoice",
      choices: [
        "Ten more cases were recorded in P.I than P.5 on Tuesday.",
        "Eight more cases were recorded in P.I than P.5 on Tuesday.",
        "Two more cases were recorded in P.I than P.5 on Tuesday.",
      ],
      answer: "Eight more cases were recorded in P.I than P.5 on Tuesday.",
    },
    {
      question:
        "What was the number of malarial cases recorded in P.2 on Saturday?",
      type: "multiplechoice",
      choices: [
        "Two malarial cases were recorded in P.2 on Saturday",
        "Six malarial cases were recorded in P.2 on Saturday",
        "No malarial cases were recorded in P.2 on Saturday",
      ],
      answer: "No malarial cases were recorded in P.2 on Saturday",
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
    const storyContent = document.querySelector(".story").innerHTML;
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
