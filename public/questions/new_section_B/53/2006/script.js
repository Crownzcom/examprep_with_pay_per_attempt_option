document.addEventListener("DOMContentLoaded", function () {
  const questionsList = document.getElementById("questions-list");
  let totalMarks = 0;

  const questions = [
    {
      question: " What is the writer of the poem looking for?",
      type: "multiplechoice",
      choices: [
        "The writer of the poem is looking for his nice pen.",
        "The writer of the poem is looking good jobs.",
        "The writer of the poem is looking land to buy.",
      ],
      answer: "The writer of the poem is looking for his nice pen.",
    },
    {
      question: "State the first thing the write wants to do.",
      type: "multiplechoice",
      choices: [
        "The first thing the writer wants is his children to pass.",
        "The first thing the writer wants is his children to grow up.",
        "The first thing the writer wants to do is to write letters to his children and send them money.",
      ],
      answer:
        "The first thing the writer wants to do is to write letters to his children and send them money.",
    },
    {
      question: "Where exactly is the writer?",
      type: "multiplechoice",
      choices: [
        "The writer is at home.",
        "The writer is in prison.",
        "The writer is at school.",
      ],
      answer: "The writer is in prison.",
    },
    {
      question: "What is it that he doesn’t want his children to know?",
      type: "multiplechoice",
      choices: [
        "He doesn't want his children to know that he is a prisoner.",
        "He doesn't want his children to know that he is is at school.",
        "He doesn't want his children to know that he is at home.",
      ],
      answer: "He doesn't want his children to know that he is a prisoner.",
    },
    {
      question:
        "Why is it important for his children to pass their examinations?",
      type: "multiplechoice",
      choices: [
        "It is important for his children to pass their examinations so that they can grow up.",
        "It is important for his children to pass their examinations so that they get good jobs and buy land, houses and cars.",
        "It is important for his children to pass their examinations so that they get to the next class.",
      ],
      answer:
        "It is important for his children to pass their examinations so that they get good jobs and buy land, houses and cars.",
    },
    {
      question: "Why do you think his hands and feet are tied?",
      type: "multiplechoice",
      choices: [
        "I think his hands and feet are tied so that he doesn't run away from prison.",
        "I think his hands and feet are tied because he is sick.",
      ],
      answer:
        "I think his hands and feet are tied so that he doesn't run away from prison.",
    },
    {
      question: "What type of chair is the write sitting on?",
      type: "multiplechoice",
      choices: [
        "The writer is sitting on a metallic chair..",
        "The writer is sitting on a wooden chair.",
        "The writer is sitting on a stone floor.",
      ],
      answer: "The writer is sitting on a stone floor.",
    },
    {
      question: "Select a good title for this poem.",
      type: "multiplechoice",
      choices: ["Parental Love In Prison.", "Prison.", "Children."],
      answer: "Parental Love In Prison.",
    },
  ];

  const synonymQuestions = [
    {
      mainQuestion:
        "Give another word or group of words with the same meaning as each of the underlined words in the space.",
      subQuestions: [
        {
          subQuestion: "suffering",
          type: "text",
          answer: ["pain", "agony", "misery", "grief"],
        },
        {
          subQuestion: "feel sad ",
          type: "text",
          answer: ["become unhappy", "miserable"],
        },
      ],
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

  synonymQuestions.forEach((synonymQuestionObj, synonymIndex) => {
    const mainListItem = createElement("li", "main");
    mainListItem.innerHTML = `${synonymQuestionObj.mainQuestion}`;

    const subList = createElement("ul");

    synonymQuestionObj.subQuestions.forEach((subQuestionObj) => {
      const subListItem = createElement("li", "subs");
      subListItem.innerHTML = `${subQuestionObj.subQuestion}`;

      const input = createElement("input");
      input.type = "text";
      input.placeholder = "Type your answer here";
      subListItem.appendChild(input);

      subList.appendChild(subListItem);
    });

    mainListItem.appendChild(subList);
    questionsList.appendChild(mainListItem);
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
      } else {
        const synonymIndex = i - questions.length;
        const synonymQuestionObj = synonymQuestions[synonymIndex];
        const subList = questionItem.querySelector("ul");
        const subQuestionItems = subList.children;

        for (let j = 0; j < subQuestionItems.length; j++) {
          const subQuestionItem = subQuestionItems[j];
          const subQuestionObj = synonymQuestionObj.subQuestions[j];
          const input = subQuestionItem.querySelector("input");
          userAnswer = input.value.trim();
          const correctAnswers = Array.isArray(subQuestionObj.answer)
            ? subQuestionObj.answer
            : [subQuestionObj.answer];
          evaluateUserAnswer(userAnswer, correctAnswers, subQuestionItem);
          userAnswers.push({ subQuestion: subQuestionObj, userAnswer });
        }
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
