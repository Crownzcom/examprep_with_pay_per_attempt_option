document.addEventListener("DOMContentLoaded", function () {
  const questionsList = document.getElementById("questions-list");
  let totalMarks = 0;

  const questions = [
    {
      question: "How many houses were in Nkondo primary school?",
      type: "multiplechoice",
      choices: [
        "There were two houses in Nkondo primary school.",
        "There were three houses in Nkondo primary school.",
        "There were four houses in Nkondo primary school.",
      ],
      answer: "There were four houses in Nkondo primary school.",
    },
    {
      question: "Why was Catherine liked by the teachers?",
      type: "multiplechoice",
      choices: [
        "Catherine was liked by the teachers because she was hardworking and well-behaved.",
        "Catherine was liked by the teachers because she was practicing with her house members daily.",
        "Catherine was liked by the teachers because she lost fame and became quiet.",
      ],
      answer:
        "Catherine was liked by the teachers because she was hardworking and well-behaved.",
    },
    {
      question:
        "Why did the members in Victoria house feel unhappy with Catherine?",
      type: "multiplechoice",
      choices: [
        "Members in Victoria house felt unhappy with Catherine because she she was hardworking and well-behaved.",
        "Members in Victoria house felt unhappy with Catherine because she lost fame and became quiet.",
        "Members in Victoria house felt unhappy with Catherine because she became proud.",
      ],
      answer:
        "Members in Victoria house felt unhappy with Catherine because she became proud.",
    },
    {
      question:
        "Mention the two items which were distributed to member for refreshment during practice",
      type: "text",
      answer: "Glucose and sugarcane.",
    },
    {
      question:
        "Why do you think Catherine used her pocket money to buy glucose?",
      type: "multiplechoice",
      choices: [
        "Catherine used her pocket money to buy glucose to make amends with her housemates.",
        "Catherine used her pocket money to buy glucose because she was proud.",
        "Catherine used her pocket money to buy glucose she was hardworking and well-behaved.",
      ],
      answer:
        "Catherine used her pocket money to buy glucose to make amends with her housemates.",
    },
    {
      question: "How did Victoria house perform in the general practice?",
      type: "multiplechoice",
      choices: [
        "Victoria house performed poorly in the general practice, finishing last in each race.",
        "Victoria house performed very well in general practice.",
      ],
      answer:
        "Victoria house performed poorly in the general practice, finishing last in each race.",
    },
    {
      question:
        "What did Catherine do after apologizing to her members the second time?",
      type: "multiplechoice",
      choices: [
        "Catherine became hardworking and well-behaved.",
        "Catherine called upon them to be proud.",
        "Catherine called upon them to regain their house spirit and bought glucose using some of her pocket money.",
      ],
      answer:
        "Catherine called upon them to regain their house spirit and bought glucose using some of her pocket money.",
    },
    {
      question: "Which house won the completion?",
      type: "multiplechoice",
      choices: [
        "Albert house won the competition.",
        "Victoria house won the competition.",
        "Kyoga house won the competition.",
      ],
      answer: "Victoria house won the competition.",
    },
  ];

  const synonymQuestions = [
    {
      mainQuestion:
        "Give another word or a group of words with the same meaning as each of the underlined words in the passage.",
      subQuestions: [
        {
          subQuestion: "assembled",
          type: "text",
          answer: ["gathered"],
        },
        {
          subQuestion: "champions",
          type: "text",
          answer: ["winners"],
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
