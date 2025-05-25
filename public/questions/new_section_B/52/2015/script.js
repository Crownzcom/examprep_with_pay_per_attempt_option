document.addEventListener("DOMContentLoaded", function () {
  const questionsList = document.getElementById("questions-list");
  let totalMarks = 0;

  const questions = [
    {
      question: "What do we need in homes?",
      type: "multiplechoice",
      choices: [
        "We need noise and chaos in our homes.",
        "We need peace in our homes.",
        "We need fear in our homes.",
      ],
      answer: "We need peace in our homes.",
    },
    {
      question: "What happens without peace?",
      type: "multiplechoice",
      choices: [
        "Without peace there is  joy and celebration.",
        "Without peace there is chaos.",
        "Without peace there is fear.",
      ],
      answer: "Without peace there is fear.",
    },
    {
      question: "What are people tired of?",
      type: "multiplechoice",
      choices: [
        "People are tired of social problems.",
        "People are tired of fear.",
        "People are tired of the army and the police.",
      ],
      answer: "People are tired of social problems.",
    },
    {
      question: "Mention any one bad thing found in stanza two.",
      type: "text",
      answer: ["Child sacrifices", "robberies", "killings"],
    },
    {
      question: "Why do we need protection according to the poem?",
      type: "multiplechoice",
      choices: [
        "We need protection to have more social problems.",
        "We need protection to create fear",
        "We need protection from all forms of crimes.",
      ],
      answer: "We need protection from all forms of crimes.",
    },
    {
      question: "When will our community shine?",
      type: "multiplechoice",
      choices: [
        "Our community will shine when there is love and care.",
        "Our community will shine when there is threre are all forms of crimes.",
        "Our community will shine when there is fear.",
      ],
      answer: "Our community will shine when there is love and care.",
    },
    {
      question: "Who are thanked in the poem?",
      type: "multiplechoice",
      choices: [
        "Homes are thanked in the poem.",
        "Schools are thanked in the poem.",
        "The army and police are thanked in the poem.",
      ],
      answer: "The army and police are thanked in the poem.",
    },
    {
      question: "Where do we enjoy ourselves?",
      type: "multiplechoice",
      choices: [
        "We enjoy ourselves in schools.",
        "We enjoy ourselves in the world that God created.",
        "We enjoy ourselves in homes.",
      ],
      answer: "We enjoy ourselves in the world that God created.",
    },
    {
      question: "How many stanzas are in this poem?",
      type: "multiplechoice",
      choices: [
        "The poem has four stanzas.",
        "It has three stanzas.",
        "The poem has five stanzas.",
      ],
      answer: "The poem has four stanzas.",
    },
    {
      question: "Who is the writer of the poem?",
      type: "text",
      answer: ["Najjemba Ruth"],
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
    const storyContent = document.querySelector(".poem").innerHTML;
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
