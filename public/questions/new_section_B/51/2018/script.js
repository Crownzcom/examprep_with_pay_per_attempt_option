document.addEventListener("DOMContentLoaded", function () {
  const questionsList = document.getElementById("questions-list");
  let totalMarks = 0;

  const questions = [
    {
      question: "To which school does the writer of the letter go?",
      type: "text",
      answer: "Tuko Primary School.",
    },
    {
      question: "Where does the writer’s mother live?",
      type: "text",
      answer: "Nairobi.",
    },
    {
      question: "When did Katoko Elizabeth write this letter?",
      type: "multiplechoice",
      choices: [
        "Katoko Elizabeth wrote this letter on the 2nd of November, 2018.",
        "Katoko Elizabeth wrote this letter on the 9th of February, 2018.",
      ],
      answer:
        "Katoko Elizabeth wrote this letter on the 2nd of November, 2018.",
    },
    {
      question: "Why were the candidates very happy?",
      type: "multiplechoice",
      choices: [
        "The candidates were very happy because Katoko had written to her mother.",
        "The candidates were very happy because their school had successfully registered them PLE 2018.",
        "The candidates were very happy because they had been briefed by their head teacher",
        "The candidates were very happy because they had been encouraged to have confidence in themselves",
      ],
      answer:
        "The candidates were very happy because their school had successfully registered for the Primary Leaving Examination (PLE) 2018.",
    },
    {
      question: "Who talked about the PLE time table during the briefing",
      type: "multiplechoice",
      choices: [
        "Katoko Elizabeth's Mum",
        "Mrs. Okello, their class teacher",
        "Katoko Elizabeth's little brother Jatel Anthony",
        "The head teacher, Mr. Kato Joseph",
      ],
      answer: "The head teacher, Mr. Kato Joseph",
    },
    {
      question:
        "Who was given chance to brief the candidates after the head teacher?",
      type: "multiplechoice",
      choices: [
        "After the head teacher, all P.7 teachers were given a chance to brief the candidates.",
        "After the head teacher, Katoko Elizabeth was given a chance to brief the candidates.",
        "After the head teacher, Katoko Elizabeth's mum was given a chance to brief the candidates.",
        "After the head teacher, Mrs. Okello was given a chance to brief the candidates.",
      ],
      answer:
        "After the head teacher, all P.7 teachers were given a chance to brief the candidates.",
    },
    {
      question:
        "Why do you think it’s important to fill in correct information on the first page?",
      type: "multiplechoice",
      choices: [
        "To pass with flying colors.",
        "To ensure that the student's read the general instructions carefully.",
        "To ensure that the student's personal details and identification are accurate.",
      ],
      answer:
        "To ensure that the student's personal details and identification are accurate.",
    },
    {
      question: "Why were the candidates told to be confident?",
      type: "multiplechoice",
      choices: [
        "They were told to be confident beacuse had successfully registered them for the PLE 2018",
        "They were told to be confident beacuse all the questions set are within the curriculum.",
        "They were told to be confident beacuse the headteacher had briefed them.",
      ],
      answer:
        "They were told to be confident beacuse all the questions set are within the curriculum.",
    },
    {
      question: "What were the candidates warned against?",
      type: "multiplechoice",
      choices: [
        "The candidates were warned against taking note of the PLE time table.",
        "The candidates were warned against any kind of examination malpractice.",
        "The candidates were warned against writing responses in the spaces provided.",
      ],
      answer:
        "The candidates were warned against any kind of examination malpractice.",
    },
    {
      question: "What is the letter about?",
      type: "multiplechoice",
      choices: [
        "The letter is about registration and preparation of PLE 2018 at Tuko Primary School.",
        "The letter is about all P.7 teachers briefing the candidates.",
        "The letter is about reading each question twice.",
      ],
      answer:
        "The letter is about registration and preparation of PLE 2018 at Tuko Primary School.",
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

      const userAnswerElement = createElement("p", "user-answer");

      userAnswerElement.innerHTML = `Student Answer: ${userAnswer}`;
      item.appendChild(userAnswerElement);

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
    const storyContent = document.querySelector(".letter").innerHTML;
    userAnswers.push({ story: storyContent });

    userAnswers = [];
    const content = document.querySelector(".content").innerHTML;
    userAnswers.push({ story: content, totalMarks: totalMarks, category: 51 });
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
