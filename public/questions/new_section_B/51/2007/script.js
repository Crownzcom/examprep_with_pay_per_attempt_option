document.addEventListener("DOMContentLoaded", function () {
  const questionsList = document.getElementById("questions-list");
  let totalMarks = 0;

  const questions = [
    {
      question: "On which day of the week was Obibi miserable?",
      type: "multiplechoice",
      choices: [
        "Obibi was miserable on Wednesday.",
        "Obibi was miserable on Monday.",
        "Obibi was miserable on Friday.",
      ],
      answer: "Obibi was miserable on Monday.",
    },
    {
      question: "What made Obibi miserable? ",
      type: "multiplechoice",
      choices: [
        "Obibi was miserable because hunters approached the bush where he was hiding.",
        "Obibi was miserable because one of the hunters aimmed a spear at the bush where he was hiding.",
        "Obibi was miserable because it was the beginning of the usual week-long suffering at school.",
      ],
      answer:
        "Obibi was miserable because it was the beginning of the usual week-long suffering at school.",
    },
    {
      question: "Why did Obibi develop a plan of not going to school? ",
      type: "multiplechoice",
      choices: [
        "He developed a plan of not going to school because he wanted to stay at home.",
        "He developed a plan of not going to school because he wanted to hide in the bush.",
        "He developed a plan of not going to school because he was miserable.",
      ],
      answer:
        "He developed a plan of not going to school because he wanted to stay at home.",
    },
    {
      question: "Give a reason why Obibi did not reach school that day.",
      type: "multiplechoice",
      choices: [
        "Obibi did not reach school that day because he was miserable.",
        "Obibi did not reach school that day because he branched off to a nearby bush and hid himself.",
      ],
      answer:
        "Obibi did not reach school that day because he branched off to a nearby bush and hid himself.",
    },
    {
      question: "How did the dogs discover Obibi's hiding place?",
      type: "multiplechoice",
      choices: [
        "The dogs discovered Obibi's hiding place by the smell of roasted cassava that attracted the dogs.",
        "The dogs discovered Obibi's hiding place because he kept shaking the grass.",
      ],
      answer:
        "The dogs discovered Obibi's hiding place by the smell of roasted cassava that attracted the dogs.",
    },
    {
      question: "Why did one hunter aim his spear at the shaking bush?",
      type: "multiplechoice",
      choices: [
        "One hunter aimed his spear at the shaking bush because he saw an animal hiding in the bush.",
        "One hunter aimed his spear at the shaking bush because he thought there was an animal shaking grass.",
      ],
      answer:
        "One hunter aimed his spear at the shaking bush because he thought there was an animal shaking grass.",
    },
    {
      question: "How did Obibi escape death? ",
      type: "multiplechoice",
      choices: [
        "Obibi escaped death when a dog jumped into his hiding place and Obibi made a loud surprising noise.",
        "Obibi escaped death when he started shaking the grass.",
      ],
      answer:
        "Obibi escaped death when a dog jumped into his hiding place and Obibi made a loud surprising noise.",
    },
    {
      question: "Select a suitable title for this passage.",
      type: "multiplechoice",
      choices: [
        "Obibi's Misery And Narrow Escape.",
        "The Hunters.",
        "The School.",
      ],
      answer: "Obibi's Misery And Narrow Escape.",
    },
  ];

  const synonymQuestions = [
    {
      mainQuestion:
        "Give another word or a group of words with the same meaning as each of the underlined words in the passage.",
      subQuestions: [
        {
          subQuestion: "miserable",
          type: "text",
          answer: ["sad", "unhappy"],
        },
        {
          subQuestion: "dodge",
          type: "text",
          answer: ["avoid something", "avoid", "elude"],
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

      const userAnswerElement = createElement("span", "user-answer");
      userAnswerElement.innerHTML = `User Answer: ${userAnswer}`;
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
