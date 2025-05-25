document.addEventListener("DOMContentLoaded", function () {
  const questionsList = document.getElementById("questions-list");
  let totalMarks = 0;

  const questions = [
    {
      question: "What can't the writer get?",
      type: "multiplechoice",
      choices: [
        "The writer can't get whether the teacher is a parent.",
        "The writer can't get what name to call the teacher.",
        "The writer can't get whether the teacher is a caretaker.",
      ],
      answer: "The writer can't get what name to call the teacher.",
    },
    {
      question: "Who commands the children at school?",
      type: "multiplechoice",
      choices: [
        "The policeman commands the children at school.",
        "The parent commands the children at school.",
        "The teacher commands the children at school.",
      ],
      answer: "The teacher commands the children at school.",
    },
    {
      question: "Which people should not step on the grass?",
      type: "multiplechoice",
      choices: [
        "The children should not step on the grass.",
        "The parents should not step on the grass.",
        "The teachers should not step on the grass.",
      ],
      answer: "The children should not step on the grass.",
    },
    {
      question: "When does the  writer forget home?",
      type: "multiplechoice",
      choices: [
        "She forgets home during break time.",
        "The writer forgets home during class time.",
        "The writer forgets home when told not to trespass.",
      ],
      answer: "The writer forgets home during class time.",
    },
    {
      question: "Why should the writer think of a teacher being a policeman?",
      type: "multiplechoice",
      choices: [
        "She thinks of him as a policeman because he makes her forget home.",
        "The teacher tells the children to share, that's why the writer thinks of him as a policeman.",
        "The teacher commands the children, that's why the writer thinks of him as a policeman.",
      ],
      answer:
        "The teacher commands the children, that's why the writer thinks of him as a policeman.",
    },
    {
      question: "What can make one's future bright?",
      type: "multiplechoice",
      choices: [
        "Sharing with friends can make their future bright.",
        "Class time can make their future bright.",
        "Teaching one skills can make their future bright.",
      ],
      answer: "Teaching one skills can make their future bright.",
    },
    {
      question: "Mention any thing children can.",
      type: "text",
      answer: ["Water", "Juice", "Packed snacks"],
    },
    {
      question: "Who do you think packs the snacks?",
      type: "multiplechoice",
      choices: [
        "Parents pack the snacks.",
        "The teachers pack the snacks.",
        "Akunamatata Brenda packs the snacks.",
      ],
      answer: "Parents pack the snacks.",
    },
    {
      question: "How many stanzas are in the poem?",
      type: "multiplechoice",
      choices: [
        "The poem has five stanzas.",
        "The poem has three stanzas.",
        "The poem has four stanzas.",
      ],
      answer: "The poem has four stanzas.",
    },
    {
      question: "Who wrote the poem?",
      type: "multiplechoice",
      choices: [
        "The teacher wrote the poem.",
        "Akunamatata Brenda wrote the poem.",
        "The children wrote the poem.",
      ],
      answer: "Akunamatata Brenda wrote the poem.",
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
