document.addEventListener("DOMContentLoaded", function () {
  const questionsList = document.getElementById("questions-list");
  let totalMarks = 0;

  const questions = [
    {
      question: "What is the advertisement about?",
      type: "multiplechoice",
      choices: [
        "The advertisement is about liberation war in Uganda.",
        "The advertisement is about the general public.",
        "The advertisement is about a video show.",
      ],
      answer: "The advertisement is about a video show.",
    },
    {
      question: "What is the show about?",
      type: "multiplechoice",
      choices: [
        "The show is about the liberation war in Uganda.",
        "The show is about the general public.",
        "The show is about a video show.",
      ],
      answer: "The show is about the liberation war in Uganda.",
    },
    {
      question: "Where will the show take place?",
      type: "multiplechoice",
      choices: [
        "The show will take place from 8:00 pm to 12:00 midnight.",
        "The show will take place at Hoima town hall.",
      ],
      answer: "The show will take place at Hoima town hall.",
    },
    {
      question: "How much money are the disabled supposed to pay?",
      type: "multiplechoice",
      choices: [
        "The disabled will not pay any money.",
        "The disabled will pay one thousand shillings.",
        "The disabled will pay three thousand shillings.",
      ],
      answer: "The disabled will not pay any money.",
    },
    {
      question: "Who is being invited for the show?",
      type: "multiplechoice",
      choices: [
        "Adults are being invited for the show.",
        "The general public is being invited for the show.",
        "Children are being invited for the show.",
      ],
      answer: "The general public is being invited for the show.",
    },
    {
      question: "When was this poster written?",
      type: "multiplechoice",
      choices: [
        "This poster was written on 18/11/2002.",
        "This poster was written on 24/11/2002.",
      ],
      answer: "This poster was written on 18/11 /2002.",
    },
    {
      question: "When did the liberation war take place in Uganda?",
      type: "multiplechoice",
      choices: [
        "The liberation war took place in Uganda in 2002.",
        "The liberation war took place in Uganda in 1979.",
      ],
      answer: "The liberation war took place in Uganda in 1979.",
    },
    {
      question: "Who is inviting people for the show?",
      type: "multiplechoice",
      choices: [
        "The management is inviting people for the show.",
        "Pepsi cola compny is inviting people for the show.",
      ],
      answer: "The management is inviting people for the show.",
    },
    {
      question: "When will the video show take place?",
      type: "multiplechoice",
      choices: [
        "The video show will take place on 24/11/2002.",
        "The video show will take place on 18/11/2002.",
      ],
      answer: "The video show will take place on 24/11/2002.",
    },
    {
      question:
        "Why do think that video shows are dangerous to young children?",
      type: "multiplechoice",
      choices: [
        "Video shows are dangerous to young children because they may show sinful acts.",
        "Video shows are dangerous to young children because they are educative.",
      ],
      answer:
        "Video shows are dangerous to young children because they may show sinful acts.",
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

        if (Array.isArray(questionObj.answer)) {
          const correctAnswers = questionObj.answer.map((ans) =>
            ans.toLowerCase()
          );
          if (correctAnswers.includes(userAnswer.toLowerCase())) {
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
        }
        userAnswers.push({ question: questionObj, userAnswer });
      }
    }
    const storyContent = document.querySelector(".conversation").innerHTML;
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
