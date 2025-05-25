document.addEventListener("DOMContentLoaded", function () {
  const questionsList = document.getElementById("questions-list");
  let totalMarks = 0;

  const questions = [
    {
      question: "In which village is Waya Primary School?",
      type: "text",
      answer: "Seseme village.",
    },
    {
      question: "Why did the seven children go to the mango tree?",
      type: "multiplechoice",
      choices: [
        "The seven children went to the mango tree because they were heading home.",
        "The seven children went to the mango tree because they were hungry and weak.",
        "The seven children went to the mango tree because they were excited.",
      ],
      answer:
        "The seven children went to the mango tree because they were hungry and weak.",
    },
    {
      question: "What did Kawudha see?",
      type: "multiplechoice",
      choices: [
        "Kawudha saw a bee-hive on a big branch of the mango tree.",
        "Kawudha saw a mango tree with some ripe fruits.",
      ],
      answer: "Kawudha saw a bee-hive on a big branch of the mango tree.",
    },
    {
      question: "Where were the children collecting mangoes from?",
      type: "multiplechoice",
      choices: [
        "The children were collecting mangoes from the tree.",
        "The children were collecting mangoes from the ground",
      ],
      answer: "The children were collecting mangoes from the ground.",
    },
    {
      question: "Why did the bees rush out of the beehive?",
      type: "multiplechoice",
      choices: [
        "The bees rushed out of the beehive because some of the mangoes fell on it.",
        "The bees rushed out of the beehive because the children threw stones at the beehive.",
        "The bees rushed out of the beehive because the children disturbed them.",
      ],
      answer:
        "The bees rushed out of the beehive because some of the mangoes fell on it.",
    },
    {
      question: "What did the bees do to each of them?",
      type: "multiplechoice",
      choices: [
        "The bees stung each of them.",
        "The bees stayed in their beehives.",
      ],
      answer: "The bees stung each of them.",
    },
    {
      question:
        "How was the children condition as they continued their journey home?",
      type: "multiplechoice",
      choices: [
        "The children were satisfied as they continued their journey home.",
        "The children were hungry and weak as they continued their journey home.",
        "Some parts of their bodies were swollen as they continued their journey home.",
      ],
      answer:
        "Some parts of their bodies were swollen as they continued their journey home.",
    },
    {
      question: "What do you think the head teacher told the parents to do?",
      type: "multiplechoice",
      choices: [
        "I think the head teacher told the parents to tell their children not to disturb bees.",
        "I think the head teacher told the parents to tell their children not to throw stones at beehives.",
        "I think the head teacher told the parents to pay lunch money.",
      ],
      answer: "I think the head teacher told the parents to pay lunch money.",
    },
  ];

  const synonymQuestions = [
    {
      mainQuestion:
        "Give another word or a group of words with the same meaning as each of the underlined words in the passage.",
      subQuestions: [
        {
          subQuestion: "ripe ",
          type: "text",
          answer: ["mature"],
        },
        {
          subQuestion: "swarm",
          type: "text",
          answer: ["a large group"],
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
