document.addEventListener("DOMContentLoaded", function () {
  const questionsList = document.getElementById("questions-list");
  let totalMarks = 0;

  const questions = [
    {
      question: " In which school was Nakato?",
      type: "multiplechoice",
      choices: [
        "Nakato was in my primary School.",
        "Nakato was in Kampala Parents School.",
        "Nakato was in Piri Boarding Primary School.",
      ],
      answer: "Nakato was in Piri Boarding Primary School.",
    },
    {
      question: "Why was she sent to the market?",
      type: "multiplechoice",
      choices: [
        "She was sent to the market to buy a pumpkin.",
        "She was sent to greet her grandfather.",
        "She was sent to pick a watch.",
      ],
      answer: "She was sent to the market to buy a pumpkin.",
    },
    {
      question: "What was the old man’s bag made of?",
      type: "text",
      answer: "Dry palm leaves",
    },
    {
      question:
        "How did Nakato feel when Bruno directed the old man to their home?",
      type: "multiplechoice",
      choices: [
        "Nakato felt happy when Bruno directed the old man to their home.",
        "Nakato felt hurt and upset when Bruno directed the old man to their home.",
        "Nakato felt embarrassed when Bruno directed the old man to their home.",
      ],
      answer:
        "Nakato felt hurt and upset when Bruno directed the old man to their home.",
    },
    {
      question:
        "What did the mother ask them to do immediately they got back home?",
      type: "multiplechoice",
      choices: [
        "The mother asked help carry the old man's bag.",
        "The mother asked them to greet the old man immediately they got back home.",
        "The mother asked them to go to the market.",
      ],
      answer:
        "The mother asked them to greet the old man immediately they got back home.",
    },
    {
      question: "What did Nakato do instead of greeting the old man?",
      type: "multiplechoice",
      choices: [
        "Nakato pretended to take the pumpkin to the kitchen instead of greeting the old man.",
        "Nakato went to the market instead of greeting the old man.",
        "Nakato carried the bag instead of greeting the old man.",
      ],
      answer:
        "Nakato pretended to take the pumpkin to the kitchen instead of greeting the old man.",
    },
    {
      question: "Why do you think Bruno was given a watch?",
      type: "multiplechoice",
      choices: [
        "Bruno was given the watch because he was polite to his grandfather.",
        "Bruno was given the watch because he did not greet the old man.",
        "Bruno was given the watch because he went to the market.",
      ],
      answer:
        "Bruno was given the watch because he was polite to his grandfather.",
    },
    {
      question: "Select a suitable title to the passage",
      type: "multiplechoice",
      choices: [
        "Nakato goes to the market.",
        "Nakato and her brother.",
        "Respect and kindness to strangers.",
      ],
      answer: "Respect and kindness to strangers.",
    },
  ];

  const synonymQuestions = [
    {
      mainQuestion:
        "Give another word or a group of words with the same meaning as each of the underlined words in the passage.",
      subQuestions: [
        {
          subQuestion: "direct",
          type: "text",
          answer: ["lead", "guide"],
        },
        {
          subQuestion: "strangers",
          type: "text",
          answer: ["unfamiliar people", "unknown individuals"],
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
