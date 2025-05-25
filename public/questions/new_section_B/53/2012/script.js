document.addEventListener("DOMContentLoaded", function () {
  const questionsList = document.getElementById("questions-list");
  let totalMarks = 0;

  const questions = [
    {
      question: "Where is this school found?",
      type: "multiplechoice",
      choices: [
        "This school is found in Sheema.",
        "This school is found in Uganda.",
        "This school is found in Kampala.",
      ],
      answer: "This school is found in Sheema.",
    },
    {
      question: "Whose report form was it?",
      type: "multiplechoice",
      choices: [
        "The report was for the headteacher.",
        "The report was for Kayemba Maria.",
        "The report was for Kakuru Michael.",
      ],
      answer: "The report was for Kakuru Michael.",
    },
    {
      question: "In which year was the report form made?",
      type: "multiplechoice",
      choices: [
        "The report form was made this year.",
        "The report form was made in 2010.",
        "The report form was made in 2012.",
      ],
      answer: "The report form was made in 2012.",
    },
    {
      question: "Which subject was done best?",
      type: "multiplechoice",
      choices: [
        "English was the subject done best.",
        "Mathematics was the subject done best.",
        "SST with RE was the subject done best.",
      ],
      answer: "English was the subject done best.",
    },
    {
      question: "Who teaches mathematics?",
      type: "multiplechoice",
      choices: [
        "Mr. O.D.Moni teaches mathematics.",
        "Mrs. Kayemba Maria teaches mathematics.",
        "Mr. N. Java teaches mathematics.",
      ],
      answer: "Mr. O.D.Moni teaches mathematics.",
    },
    {
      question: "What did the pupil get in SST with R.E?",
      type: "multiplechoice",
      choices: [
        "The pupil got eighty eight in SST with R.E.",
        "The pupil got ninety in SST with R.E.",
        "The pupil got eighty five in SST with R.E.",
      ],
      answer: "The pupil got eighty eight in SST with R.E.",
    },
    {
      question: "How many pupils are in this class?",
      type: "multiplechoice",
      choices: [
        "There are eighty five pupils in this class.",
        "There are ninety pupils in this class.",
        "There are eighty pupils in this class.",
      ],
      answer: "There are eighty pupils in this class.",
    },
    {
      question: "Who was the class teacher?",
      type: "multiplechoice",
      choices: [
        "B Sebuliba was the class teacher.",
        "M. Kayemba was the class teacher.",
        "Mrs. Kayemba Maria was the class teacher.",
      ],
      answer: "Mrs. Kayemba Maria was the class teacher.",
    },
    {
      question: "What were the head teacher’s remarks?",
      type: "multiplechoice",
      choices: [
        "The head head teacher’s remarks were Very good, keep it up.",
        "The head head teacher’s remarks were Good result, keep it up.",
        "The head head teacher’s remarks were Quite good.",
      ],
      answer: "The head head teacher’s remarks were Good result, keep it up.",
    },
    {
      question: "When did the head teacher sign this report?",
      type: "multiplechoice",
      choices: [
        "The head teacher signed this report on 10th August, 2012.",
        "The head teacher signed this report on 13th September, 2012.",
        "The head teacher signed this report on 8th October, 2012.",
      ],
      answer: "The head teacher signed this report on 10th August, 2012.",
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

  function evaluateUserAnswer(userAnswer, correctAnswers, item) {
    const isAnswerCorrect = correctAnswers.some(
      (correctAnswer) =>
        userAnswer.toLowerCase() === correctAnswer.toLowerCase()
    );

    if (isAnswerCorrect) {
      totalMarks++;
      item.appendChild(createTickElement());
    } else {
      item.appendChild(createCrossElement());
      const correctAnswerElement = createElement("span", "correct-answer");
      correctAnswerElement.textContent = `Correct answers: ${correctAnswers.join(
        ", "
      )}`;
      item.appendChild(correctAnswerElement);
    }
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

        if (userAnswer.toLowerCase() === questionObj.answer.toLowerCase()) {
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
        userAnswers.push({ question: questionObj, userAnswer });
      }
    }
    const storyContent = document.getElementById("questionImage").innerHTML;
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
