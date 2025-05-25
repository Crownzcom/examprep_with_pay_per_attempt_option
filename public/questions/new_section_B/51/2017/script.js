document.addEventListener("DOMContentLoaded", function () {
  const questionsList = document.getElementById("questions-list");
  let totalMarks = 0;

  const questions = [
    {
      question: "What was held in Malindo Primary School?",
      type: "multiplechoice",
      choices: [
        "Sports were  held at Malinndo Primary School",
        "An election was held in Malindo Primary School.",
        "National exxaminations were  held at Malinndo Primary School.",
      ],
      answer: "An election was held in Malindo Primary School.",
    },
    {
      question: "Who was the chairperson of the electoral commission?",
      type: "multiplechoice",
      choices: [
        "Mr. Matovu was the chairperson of the electoral commission.",
        "Bouncer Bino was the chairperson of the electoral commission.",
        "Ms. Dorothy Awor was the chairperson of the electoral commission.",
      ],
      answer:
        "Ms. Dorothy Awor was the chairperson of the electoral commission.",
    },
    {
      question: "Where was the list of the posts pinned?",
      type: "multiplechoice",
      choices: [
        "The posts was pinned on the school bus.",
        "The list of the posts was pinned on the notice board.",
        "The posts was pinned on the school calender.",
      ],
      answer: "The list of the posts was pinned on the notice board.",
    },
    {
      question: " Why was Bouncer Bino well-known in the school?",
      type: "multiplechoice",
      choices: [
        "He was well-known in the school because his dad gave him some money.",
        "Bouncer Bino was well-known in the school because of he was going to be elected.",
        "Bouncer Bino was well-known in the school because of his pride.",
      ],
      answer: "Bouncer Bino was well-known in the school because of his pride.",
    },
    {
      question: "When did the pupils have general campaigns?",
      type: "multiplechoice",
      choices: [
        "They had general campaigns on Monday.",
        "They had general campaigns on Thursday.",
        "The pupils had general campaigns on Friday.",
      ],
      answer: "The pupils had general campaigns on Friday.",
    },
    {
      question: "Why do you think BB’s dad gave him money?",
      type: "multiplechoice",
      choices: [
        "BB's dad gave him money to please his supporters.",
        "BB's dad gave him money to win the election.",
        "BB's dad gave him money to print posters.",
      ],
      answer: "BB's dad gave him money to please his supporters.",
    },
    {
      question:
        "Why was the head teacher monitoring the process of the elections?",
      type: "multiplechoice",
      choices: [
        "To ensure there was no rigging and to ensure the elections were free and fair.",
        "To count the votes.",
        "To ensure that Bouncer Bino won.",
      ],
      answer:
        "To ensure there was no rigging and to ensure the elections were free and fair.",
    },
    {
      question:
        "What made the head teacher to appreciate Bouncer Bino’s action?",
      type: "multiplechoice",
      choices: [
        "The head teacher appreciated Bouncer Bino's action because he gave sweets, pan-cakes and buns to every pupil",
        "The head teacher appreciated Bouncer Bino's action because he accepted the election results.",
        "The head teacher appreciated Bouncer Bino's action because he changed his style of walking.",
      ],
      answer:
        "The head teacher appreciated Bouncer Bino's action because he accepted the election results.",
    },
  ];

  const synonymQuestions = [
    {
      mainQuestion:
        "Give another word or a group of words with the same meaning as each of the underlined words in the passage.",
      subQuestions: [
        {
          subQuestion: "posts",
          type: "text",
          answer: "positions",
        },
        {
          subQuestion: "rigging",
          type: "text",
          answer: "cheating",
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
    const storyContent = document.querySelector(".story").innerHTML;
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
