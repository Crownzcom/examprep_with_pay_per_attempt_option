document.addEventListener("DOMContentLoaded", function () {
  const questionsList = document.getElementById("questions-list");
  let totalMarks = 0;

  const questions = [
    {
      question: "What woke Zawadi up?",
      type: "multiplechoice",
      choices: [
        "Zawadi was woken up by an alarm clock.",
        "Zawadi was woken up by snoring noises.",
        "Zawadi was woken up by the loud crowing of a cock in the neighborhood.",
      ],
      answer:
        "Zawadi was woken up by the loud crowing of a cock in the neighborhood.",
    },
    {
      question: "How did Zawadi move to her parents’ bedroom?",
      type: "multiplechoice",
      choices: [
        "Zawadi tip-toed to her parents’ bedroom.",
        "Zawadi walked to her parents’ bedroom.",
        "Zawadi ran to her parents’ bedroom.",
      ],
      answer: "Zawadi tip-toed to her parents’ bedroom.",
    },
    {
      question: "What made Zawadi confirm that her parents were asleep?",
      type: "multiplechoice",
      choices: [
        "Zawadi confirmed that her parents were asleep when she heard some snoring at the doorway of their bedroom.",
        "Zawadi confirmed that her parents were asleep when she realised they had not woken up.",
        "Zawadi confirmed that her parents were asleep when she woke her self.",
      ],
      answer:
        "Zawadi confirmed that her parents were asleep when she heard some snoring at the doorway of their bedroom.",
    },
    {
      question: "How did Zawadi open the door?",
      type: "multiplechoice",
      choices: [
        "Zawadi opened the door slowly.",
        "Zawadi opened the door loudly.",
        "Zawadi opened the door quietly.",
      ],
      answer: "Zawadi opened the door quietly.",
    },
    {
      question: "When did Zawadi realize the man’s kindness?",
      type: "multiplechoice",
      choices: [
        "Zawadi realized the man's kindness when she met him on her way.",
        "Zawadi realized the man's kindness when he rode very fast.",
        "Zawadi realized the man's kindness when he asked to give her a lift on his bicycle.",
      ],
      answer:
        "Zawadi realized the man's kindness when he asked to give her a lift on his bicycle.",
    },
    {
      question:
        "What did the man do when Zawadi told him that he passed the school?",
      type: "multiplechoice",
      choices: [
        "He abandoned the bicycle.",
        "He pretended not to have heard.",
        "He stopped and let Zawadi off.",
      ],
      answer: "He pretended not to have heard.",
    },
    {
      question: "What happened to the man at the end?",
      type: "multiplechoice",
      choices: [
        "The man was taken to court and sentenced to ten years imprisonment for attempted kidnap.",
        "The man was was caught and brought back to the trading center.",
        "The man was was handed over to police.",
      ],
      answer:
        "The man was taken to court and sentenced to ten years imprisonment for attempted kidnap.",
    },
    {
      question: "Select a suitable title to the passage",
      type: "multiplechoice",
      choices: [
        "Zawadi's attempted kidnapping.",
        "Zawadi's Morning Adventure.",
        "Zawadi's early morning.",
      ],
      answer: "Zawadi's attempted kidnapping.",
    },
  ];

  const synonymQuestions = [
    {
      mainQuestion:
        "Give another word or a group of words with the same meaning as each of the underlined words in the passage.",
      subQuestions: [
        {
          subQuestion: "confirmed ",
          type: "text",
          answer: "verified",
        },
        {
          subQuestion: "scare ",
          type: "text",
          answer: "frighten",
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
