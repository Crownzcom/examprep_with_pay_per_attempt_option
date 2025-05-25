document.addEventListener("DOMContentLoaded", function () {
  const questionsList_A = document.getElementById("questions-list-A");
  const questionsList_B = document.getElementById("questions-list-B");
  let totalMarks = 0;
  let userAnswers = [];

  const questions_A = [
    {
      question: "Who is graduating?",
      type: "multiplechoice",
      choices: [
        "Mr. Alecho Phillip is graduating.",
        "Dr. Onapa Patrick is graduating.",
        "Dr. Opio Danis is graduating.",
      ],
      answer: "Dr. Opio Danis is graduating.",
    },
    {
      question: "Who is inviting people?",
      type: "multiplechoice",
      choices: [
        "Mr. and Mrs. Opolot are inviting the people.",
        "Dr. Onapa Patrick is inviting the people.",
        "Dr. Opio Danis is inviting the people.",
      ],
      answer: "Mr. and Mrs. Opolot are inviting the people.",
    },
    {
      question: "Where is the party going to be held?",
      type: "multiplechoice",
      choices: [
        "The party is going to be held at the home of Mr. and Mrs. Opolot at Kapule in Ngora District.",
        "The party is going to be held at the home of Mr. and Mrs. Opolot.",
      ],
      answer:
        "The party is going to be held at the home of Mr. and Mrs. Opolot at Kapule in Ngora District.",
    },
    {
      question: "Who should be contacted about the party?",
      type: "multiplechoice",
      choices: [
        "Dr. Onapa Patrick and Mr Alecho Phillip should be contacted about the party.",
        "Mr. and Mrs. Opolot should be contacted about the party.",
        "Dr. Opio Danis should be contacted about the party.",
      ],
      answer:
        "Dr. Onapa Patrick and Mr Alecho Phillip should be contacted at the party.",
    },
    {
      question: "When will the party take place?",
      type: "multiplechoice",
      choices: [
        "The party will take place on in January,2012.",
        "The party will take place on the 25th January,2012.",
        "The party will take place at noon.",
      ],
      answer: "The party will take place on the 25th January,2012.",
    },
  ];

  const questions_B = [
    {
      question:
        "Which day of the week does Ssendawula revise Mathematics twice?",
      type: "multiplechoice",
      choices: [
        "Ssendawula revises Mathematics twice on Friday.",
        "Ssendawula revises Mathematics twice on Thursday.",
        "Ssendawula revises Mathematics twice on Monday.",
      ],
      answer: "Ssendawula revises Mathematics twice on Friday.",
    },
    {
      question: "How many subjects does he revise in a week?",
      type: "multiplechoice",
      choices: [
        "He revises three subjects in a week.",
        "He revises two subjects in a week.",
        "He revises four subjects in a week.",
      ],
      answer: "He revises four subjects in a week.",
    },
    {
      question: "Which day of the week has he allocated for tests?",
      type: "text",

      answer: "Sartuday",
    },
    {
      question: "When does he revise for the longest period?",
      type: "multiplechoice",
      choices: [
        "He revises for the longest period between 8.00 a.m and 10.00 a.m.",
        "He revises for the longest period between 10.00 a.m and 1.00 p.m.",
        "He revises for the longest period between 3.00 p.m and 5.00 p.m.",
      ],
      answer:
        "He revises for the longest period between 10.00 a.m and 1.00 p.m.",
    },
    {
      question: "What does he do after 5:00p.m?",
      type: "multiplechoice",
      choices: [
        "After 5.00p.m he goes for games.",
        "After 5.00p.m he goes home.",
      ],
      answer: "After 5.00p.m he goes for games.",
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
    const storyContent_2 = document.querySelector(".table").innerHTML;
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
