document.addEventListener("DOMContentLoaded", function () {
  const questionsList_A = document.getElementById("questions-list-A");
  const questionsList_B = document.getElementById("questions-list-B");
  let totalMarks = 0;
  let userAnswers = [];

  const questions_A = [
    {
      question: "Who is the bride according to the card?",
      type: "multiplechoice",
      choices: [
        "Egesa Fredrick is the bride according to the card.",
        "Nafula Rose is the bride according to the card.",
        "Apio Rebecca is the bride according to the card.",
      ],
      answer: "Apio Rebecca is the bride according to the card.",
    },
    {
      question: "From which district does the bridegroom come?",
      type: "text",
      answer: "Tororo District",
    },
    {
      question: "On which date will they wed?",
      type: "multiplechoice",
      choices: [
        "They will wed on Saturday 6th November, 2010.",
        "They will wed in November, 2010.",
      ],
      answer: "They will wed on Saturday 6th November, 2010.",
    },
    {
      question: "In which church will the wedding take place?",
      type: "text",
      answer: "Christ the King Church",
    },
    {
      question: "Where will the reception take place?",
      type: "multiplechoice",
      choices: [
        "The reception will take place in Busia District.",
        "The reception will take place at Border Hotel in Busia town.",
        "The reception will take place in Tororo District.",
      ],
      answer: "The reception will take place at Border Hotel in Busia town.",
    },
  ];

  const questions_B = [
    {
      question: "What is notice about?",
      type: "multiplechoice",
      choices: [
        "The notice is about child abduction.",
        "The notice is about childrens.",
        "The notice is about parents.",
      ],
      answer: "The notice is about child abduction.",
    },
    {
      question: "Where was the notice written?",
      type: "multiplechoice",
      choices: [
        "The notice was written on the notice board.",
        "The notice was written on Jogo village's notice board.",
      ],
      answer: "The notice was written on Jogo village's notice board.",
    },
    {
      question: "What should the children do to avoid being abducted?",
      type: "multiplechoice",
      choices: [
        "Children should move in groups to avoid being abducted.",
        "Children should take care of themselves to avoid being abducted.",
      ],
      answer: "Children should move in groups to avoid being abducted.",
    },
    {
      question: "What are parents advised to do?",
      type: "multiplechoice",
      choices: [
        "Parents should move in groups to avoid being abducted.",
        "Parents are advised to take care of their children.",
      ],
      answer: "Parents are advised to take care of their children.",
    },
    {
      question: "Who wrote the notice?",
      type: "text",
      answer: "Kato Ahmed",
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
    const storyContent_1 = document.querySelector(".invitation").innerHTML;
    userAnswers.push({ story_1: storyContent_1 });
    const storyContent_2 = document.querySelector(".conversation").innerHTML;
    userAnswers.push({ story_2: storyContent_2 });

    userAnswers = [];
    const content = document.querySelector(".content").innerHTML;
    userAnswers.push({ story: content, totalMarks: totalMarks, category: 52 });
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
