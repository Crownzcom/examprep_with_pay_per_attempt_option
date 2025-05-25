document.addEventListener("DOMContentLoaded", function () {
  const questionsList = document.getElementById("questions-list");
  let totalMarks = 0;

  const questions = [
    {
      question: "What activities are done by the people of this sub-county?",
      type: "multiplechoice",
      choices: [
        "Shopping is the main activity done by people in this sub-county.",
        "Cattle and goat rearing and the main activities done by the people in this sub-county.",
        "Farming and business are the activities done by people in this sub-county.",
      ],
      answer:
        "Farming and business are the activities done by people in this sub-county.",
    },
    {
      question:
        "Apart from cattle, which other animals are reared in this sub-county?",
      type: "multiplechoice",
      choices: [
        "Ducks and sheep are the other animals reared by people in this sub-county.",
        "Chicken and goats are the other animals reared by people in this sub-county.",
        "The people in this sub-county also rear pigs and sheep.",
      ],
      answer:
        "Chicken and goats are the other animals reared by people in this sub-county.",
    },
    {
      question: "Which people in this sub-county do business?",
      type: "multiplechoice",
      choices: [
        "Men and women do business in this sub-county.",
        "Children do business in this sub-county.",
        "Children and women do business in this sub-county.",
      ],
      answer: "Men and women do business in this sub-county.",
    },
    {
      question: "How is sugar weighed according to the story?",
      type: "multiplechoice",
      choices: [
        "Sugar is weighed in litres.",
        "Sugar is weighed in kilograms.",
        "Sugar is weighed in boxes.",
      ],
      answer: "Sugar is weighed in kilograms.",
    },
    {
      question: "In which way are paraffin and cooking oil sold?",
      type: "multiplechoice",
      choices: [
        "Paraffin is measured in liters.",
        "Paraffin is packed in bottles, tins or packets.",
        "Paraffin is measured in liters or small quantities.",
      ],
      answer: "Paraffin is measured in liters or small quantities.",
    },
    {
      question: "How did Mr. Amooti do to serve his many customers?",
      type: "multiplechoice",
      choices: [
        "He employed workers who served customers with a smile.",
        "He gave his customers sweets.",
        "He served his customers by making his items cheaper.",
      ],
      answer: "He employed workers who served customers with a smile.",
    },
    {
      question: "Why do you think most children buy from Mr. Amooti’s shop?",
      type: "multiplechoice",
      choices: [
        "Most children buy from Mr.Amooti's shop because he employed workers who serve with a smile.",
        "Most children buy from Mr.Amooti's shop because he sometimes gives them sweets as a reward.",
        "Most children buy from Mr.Amooti's shop because his items are cheaper.",
      ],
      answer:
        "Most children buy from Mr.Amooti's shop because he sometimes gives them sweets as a reward.",
    },
    {
      question: "Select a suitable tittle for the passage",
      type: "multiplechoice",
      choices: [
        "Mr. Amooti's shop in a sub-County.",
        "Activities done in the sub-county.",
        "Shops in the sub-county.",
      ],
      answer: "Mr. Amooti's shop in a sub-County.",
    },
  ];

  const synonymQuestions = [
    {
      mainQuestion:
        "Give another word or group of words with the same meaning as each of the underlined words in the space.",
      subQuestions: [
        {
          subQuestion: "customers",
          type: "text",
          answer: ["Consumers", "Shoppers", "Buyers", "Clients"],
        },
        {
          subQuestion: "earns",
          type: "text",
          answer: ["Gains", "Income", "Revenue"],
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
