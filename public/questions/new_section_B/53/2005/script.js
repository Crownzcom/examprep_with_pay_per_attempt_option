document.addEventListener("DOMContentLoaded", function () {
  const questionsList = document.getElementById("questions-list");
  let totalMarks = 0;

  const questions = [
    {
      question: "What is Aleper’s home district?",
      type: "text",
      answer: "Ngorotek district",
    },
    {
      question: "Give one reason why Aleper does not know how old he is.",
      type: "multiplechoice",
      choices: [
        "Aleper does not know how old he forgot.",
        "Aleper does not know how old he is because nobody has ever told him.",
      ],
      answer:
        "Aleper does not know how old he is because nobody has ever told him.",
    },
    {
      question:
        "Why does Aleper remember the day Museveni first visited Ngorotek district?",
      type: "multiplechoice",
      choices: [
        "Aleper remembers the day Museveni first visited Ngorotek district because his mother told him that is the day he was born.",
        "Aleper remembers the day Museveni first visited Ngorotek district because he saw him.",
      ],
      answer:
        "Aleper remembers the day Museveni first visited Ngorotek district because his mother told him that is the day he was born.",
    },
    {
      question:
        "Who announced that Aleper was the best PLE candidate in his district?",
      type: "multiplechoice",
      choices: [
        "The reporter announced that Aleper was the best PLE candidate in his district.",
        "UNEB announced that Aleper was the best PLE candidate in his district.",
        "Aleper's mother announced that Aleper was the best PLE candidate in his district.",
      ],
      answer:
        "UNEB announced that Aleper was the best PLE candidate in his district.",
    },
    {
      question: "Why do you think Aleper’s mother slaughtered a he-goat?",
      type: "multiplechoice",
      choices: [
        "Aleper’s mother slaughtered a he-goat because he was the best PLE candidate.",
        "Aleper’s mother slaughtered a he-goat because he was a disciplined son.",
      ],
      answer:
        "Aleper’s mother slaughtered a he-goat because he was the best PLE candidate.",
    },
    {
      question:
        "Why didn’t Aleper’s former classmates come to celebrate with him?",
      type: "multiplechoice",
      choices: [
        "Aleper's former classmates didn't come to celebrate with him because most of them had not performed well and were unhappy.",
        "Aleper's former classmates didn't come to celebrate with him because they had travelled.",
      ],
      answer:
        "Aleper's former classmates didn't come to celebrate with him because most of them had not performed well and were unhappy.",
    },
    {
      question:
        "Give one reason why you think Aleper might be given a place in Busoga college Mwiri.",
      type: "multiplechoice",
      choices: [
        "He might be given a place in Busoga college Mwiri because it was his first choice.",
        "He might be given a place in Busoga college Mwiri because he is from Ngorotek district.",
      ],
      answer:
        "He might be given a place in Busoga college Mwiri because it was his first choice.",
    },
    {
      question: "Why did Aleper want to become a politician?",
      type: "multiplechoice",
      choices: [
        "Aleper wanted to become a politician because he admires Apira John who is a very powerful politician.",
        "Aleper wanted to become a politician because he wants to be rich.",
      ],
      answer:
        "Aleper wanted to become a politician because he admires Apira John who is a very powerful politician.",
    },
    {
      question:
        "How do you think Aleper managed to be the best PLE candidate in his district?",
      type: "multiplechoice",
      choices: [
        "Aleper managed to be the best PLE candidate in his district by working so hard.",
        "Aleper managed to be the best PLE candidate in his district by answering all the question.",
      ],
      answer:
        "Aleper managed to be the best PLE candidate in his district by working so hard.",
    },
    {
      question: "Select a suitable title for this story.",
      type: "multiplechoice",
      choices: [
        "Aleper Tops Ngorotek District In PLE.",
        "Aleper's Mother.",
        "The Reporter.",
      ],
      answer: "Aleper Tops Ngorotek District In PLE.",
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
    const storyContent = document.querySelector(".conversation").innerHTML;
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
