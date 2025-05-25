document.addEventListener("DOMContentLoaded", function () {
  const questionsList_A = document.getElementById("questions-list-A");
  const questionsList_B = document.getElementById("questions-list-B");
  let totalMarks = 0;
  let userAnswers = [];

  const questions_A = [
    {
      question: "Where can one read this information?",
      type: "multiplechoice",
      choices: [
        "One can read this information at the notice board of Nasta primary school.",
        "One can read this information at Nasta primary school.",
        "One can read this information at the the main hall.",
      ],
      answer:
        "One can read this information at the notice board of Nasta primary school.",
    },
    {
      question: "Who are being invited?",
      type: "multiplechoice",
      choices: [
        "All  parents of Nasta primary school are being invited.",
        "Primary seven candidates are being invited.",
        "Parents of primary seven candidates are being invited.",
      ],
      answer: "Parents of primary seven candidates are being invited.",
    },
    {
      question: "How long will the meeting take?",
      type: "multiplechoice",
      choices: [
        "The meeting will take three hours.",
        "The meeting will take two hours.",
        "The meeting will take one hour.",
      ],
      answer: "The meeting will take two hours.",
    },
    {
      question:
        "What should parents who have not cleared school requirements do?",
      type: "multiplechoice",
      choices: [
        "They should clear the school requirements before going for the meeting.",
        "They should go for the meeting in the main hall.",
        "They should make payments in the bank.",
      ],
      answer:
        "They should clear the school requirements before going for the meeting.",
    },
    {
      question: "Who wrote the notice?",
      type: "multiplechoice",
      choices: [
        "The candidates of primary seven wrote the notice.",
        "The parents of Nasta primary school wrote the notice.",
        "The management of Nasta primary school wrote the notice.",
      ],
      answer: "The management of Nasta primary school wrote the notice.",
    },
  ];

  const questions_B = [
    {
      question: "When did Mr. Munyenga visit the sick?",
      type: "multiplechoice",
      choices: [
        "Mr. Munyenga visited the sick on Sunday.",
        "Mr. Munyenga visited the sick on Saturday.",
        "Mr. Munyenga visited the sick on Friday.",
      ],
      answer: "Mr. Munyenga visited the sick on Sunday.",
    },
    {
      question: "When did Mr. Munyenga pay his workers?",
      type: "multiplechoice",
      choices: [
        "Mr. Munyenga paid his workers on Monday.",
        "Mr. Munyenga paid his workers on Tuesday.",
        "Mr. Munyenga paid his workers on Wednesday.",
      ],
      answer: "Mr. Munyenga paid his workers on Wednesday.",
    },
    {
      question: "What did My. Munyenga do on Thursday?",
      type: "multiplechoice",
      choices: [
        "He paid water and electricity bills on Thursday.",
        "He withdrew money from the bank on Thursday.",
        "He harvested onions on Thursday.",
      ],
      answer: "He paid water and electricity bills on Thursday.",
    },
    {
      question: "Where was Mr. Munyenga on Saturday?",
      type: "multiplechoice",
      choices: [
        "Mr. Munyenga was in the hospital on Saturday.",
        "Mr. Munyenga was in the garden on Saturday.",
        "Mr. Munyenga was in the bank on Saturday.",
      ],
      answer: "Mr. Munyenga was in the garden on Saturday.",
    },
    {
      question: "How many activities did Mr. Munyenga do that week?",
      type: "multiplechoice",
      choices: [
        "Mr. Munyenga did nine activities that week.",
        "Mr. Munyenga did seven activities that week.",
        "Mr. Munyenga did eight activities that week.",
      ],
      answer: "Mr. Munyenga did nine activities that week.",
    },
  ];

  function generateQuestionListItem(questionObj, index, group) {
    const listItem = document.createElement("li");
    listItem.innerHTML = `<span class="question-number"></span> ${questionObj.question}`;

    if (questionObj.type === "text") {
      const input = document.createElement("input");
      input.type = "text";
      input.placeholder = "Type your answer here";
      listItem.appendChild(input);
    } else if (questionObj.type === "multiplechoice") {
      const choicesContainer = document.createElement("div");

      questionObj.choices.forEach((choice, choiceIndex) => {
        const label = document.createElement("label");
        const radio = document.createElement("input");
        radio.type = "radio";
        radio.name = `question-${group}-${index}`;
        radio.value = choice;
        label.appendChild(radio);
        label.appendChild(document.createTextNode(choice));
        choicesContainer.appendChild(label);
      });

      listItem.appendChild(choicesContainer);
    }

    return listItem;
  }

  function evaluateAnswers(questions, questionList, group) {
    const questionItems = questionList.children;

    for (let i = 0; i < questionItems.length; i++) {
      const questionItem = questionItems[i];
      const questionObj = questions[i];
      let userAnswer = "";

      if (questionObj.type === "text") {
        const input = questionItem.querySelector("input");
        userAnswer = input.value.trim();
      } else if (questionObj.type === "multiplechoice") {
        const selectedChoice = questionItem.querySelector(
          `input[name="question-${group}-${i}"]:checked`
        );
        if (selectedChoice) {
          userAnswer = selectedChoice.value;
        }
      }

      const correctAnswers = Array.isArray(questionObj.answer)
        ? questionObj.answer
        : [questionObj.answer];
      const isAnswerCorrect = correctAnswers.some(
        (correctAnswer) =>
          userAnswer.toLowerCase() === correctAnswer.toLowerCase()
      );

      const tickElement = document.createElement("span");
      tickElement.classList.add("tick");
      tickElement.textContent = "\u2713";

      const crossElement = document.createElement("span");
      crossElement.classList.add("cross");
      crossElement.textContent = "\u2717";

      if (isAnswerCorrect) {
        totalMarks++;
        questionItem.appendChild(tickElement);
      } else {
        questionItem.appendChild(crossElement);
        const correctAnswerElement = document.createElement("span");
        correctAnswerElement.classList.add("correct-answer");
        if (questionObj.type === "text") {
          correctAnswerElement.textContent = `Correct answers: ${correctAnswers.join(
            ", "
          )}`;
        } else {
          correctAnswerElement.textContent = `Correct answer: ${correctAnswers}`;
        }
        questionItem.appendChild(correctAnswerElement);
      }
      userAnswers.push({ question: questionObj, userAnswer });
    }
  }

  questions_A.forEach((questionObj, index) => {
    const listItem = generateQuestionListItem(questionObj, index, "A");
    questionsList_A.appendChild(listItem);
  });

  questions_B.forEach((questionObj, index) => {
    const listItem = generateQuestionListItem(questionObj, index, "B");
    questionsList_B.appendChild(listItem);
  });

  function evaluateAllAnswers() {
    evaluateAnswers(questions_A, questionsList_A, "A");
    evaluateAnswers(questions_B, questionsList_B, "B");
    const storyContent_1 = document.querySelector(".conversation").innerHTML;
    userAnswers.push({ story: storyContent_1 });
    const storyContent_2 = document.querySelector(".table").innerHTML;
    userAnswers.push({ story: storyContent_2 });

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
