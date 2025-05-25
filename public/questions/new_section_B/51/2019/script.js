document.addEventListener("DOMContentLoaded", function () {
  const questionsList = document.getElementById("questions-list");
  let totalMarks = 0;

  const questions = [
    {
      question: "What happened to the airtime of the writer's father?",
      type: "multiplechoice",
      choices: [
        "It got placed inside the phone.",
        "His airtime got lost.",
        "His airtime got used up before he could end his talk.",
      ],
      answer: "His airtime got used up before he could end his talk.",
    },
    {
      question: "Who was the writer's father talking to?",
      type: "multiplechoice",
      choices: [
        "The writer's father was talking to Mr. Obadiya.",
        "He was talking to his son.",
        "The writer's father was talking to his mother.",
      ],
      answer: "The writer's father was talking to Mr. Obadiya.",
    },
    {
      question: "Why did the writer go to the shop?",
      type: "multiplechoice",
      choices: [
        "The writer went to the shop to buy food.",
        "The writer went to the shop to buy airtime.",
        "The writer went to the shop to buy sweets.",
      ],
      answer: "The writer went to the shop to buy airtime.",
    },
    {
      question: "How did the writer travel to the shop?",
      type: "multiplechoice",
      choices: [
        "The writer travelled to the shop by foot.",
        "The writer travelled to the shop by car.",
        "He traveled to the shop by bicycle.",
      ],
      answer: "He traveled to the shop by bicycle.",
    },
    {
      question: "When the writer brought airtime, what was his father doing?",
      type: "multiplechoice",
      choices: [
        "His father was listening to the news.",
        "His father was talking to Mr. Obadiya.",
        "His father was resting.",
      ],
      answer: "His father was listening to the news.",
    },
    {
      question: "Why was the writer excited?",
      type: "multiplechoice",
      choices: [
        "He was excited because he was going to load airtime for the first time.",
        "He was excited because he was going to the shop.",
        "The writer was excited because his father was talking to Mr. Obadiya.",
      ],
      answer:
        "He was excited because he was going to load airtime for the first time.",
    },
    {
      question: "Where did the writer place the airtime card?",
      type: "multiplechoice",
      choices: [
        "The writer placed the airtime card on the table.",
        "He was placed the airtime in his father's hand.",
        "The writer placed the airtime card between the phone and the battery.",
      ],
      answer:
        "The writer placed the airtime card between the phone and the battery.",
    },
    {
      question: "Select a suitable title for the story.",
      type: "multiplechoice",
      choices: [
        "Loading airtime.",
        "Going to the shop.",
        "Talking to Mr. Obadiya.",
      ],
      answer: "Loading airtime.",
    },
  ];

  const synonymQuestions = [
    {
      mainQuestion:
        "Give another word or group of words with the same meaning as each of the underlined words in the passage",
      subQuestions: [
        {
          subQuestion: "conversing",
          type: "text",
          answer: "talking",
        },
        {
          subQuestion: "responded",
          type: "text",
          answer: "answered",
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
