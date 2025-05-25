document.addEventListener("DOMContentLoaded", function () {
  const questionsList = document.getElementById("questions-list");
  let totalMarks = 0;

  const questions = [
    {
      question:
        "On which days of the week does a cargo plane come to J.K airport?",
      type: "multiplechoice",
      choices: [
        "A cargo plane come to J.K International Airport on Monday.",
        "A cargo plane come to J.K International Airport on Sartuday.",
        "A cargo plane comes to J.K International Airport on Friday and Saturday.",
      ],
      answer:
        "A cargo plane comes to J.K International Airport on Friday and Saturday.",
    },
    {
      question:
        "Which plane arrives and leaves this airport late in the night?",
      type: "multiplechoice",
      choices: [
        "The Ethiopian PP plane arrives and leaves late in the night.",
        "The British PP plane arrives and leaves late in the night.",
        "The French PP plane arrives and leaves late in the night.",
      ],
      answer: "The British PP plane arrives and leaves late in the night.",
    },
    {
      question: "Where does the British CP go on Saturday?",
      type: "multiplechoice",
      choices: [
        "The British CP goes to Maputo on Saturday.",
        "The British CP goes to Europe on Saturday.",
        "The British CP goes to South Africa on Saturday.",
      ],
      answer: "The British CP goes to Europe on Saturday.",
    },
    {
      question:
        "Which planes make a stop over on the way after leaving this airport?",
      type: "multiplechoice",
      choices: [
        "The Ethiopian PP and French PP make a stopover on the way after leaving this airport.",
        "The British PP and British CP make a stopover on the way after leaving this airport.",
        "The Kenyan PP and Uganda PP make a stopover on the way after leaving this airport.",
      ],
      answer:
        "The Ethiopian PP and French PP make a stopover on the way after leaving this airport.",
    },
    {
      question:
        "If a person wanted to go to Europe over the week-end, which plane would he board?",
      type: "multiplechoice",
      choices: [
        "They would board the French PP or the British PP on Saturday.",
        "They would board the French PP or the British CP on Saturday.",
        "They would board the French PP on Saturday.",
      ],
      answer: "They would board the French PP on Saturday.",
    },
    {
      question: "How many times do planes arrive at J.K.Airport in a week?",
      type: "multiplechoice",
      choices: [
        "Planes arrive at J.K International Airport a total of eight times in a week.",
        "Planes arrive at J.K International Airport a total of seven times in a week.",
        "Planes arrive at J.K International Airport a total of nine times in a week.",
      ],
      answer:
        "Planes arrive at J.K International Airport a total of eight times in a week.",
    },
    {
      question: "In which country is this international airport?",
      type: "multiplechoice",
      choices: [
        "This international airport is in Uganda.",
        "This international airport is in Britain.",
        "This international airport is in Kenya.",
      ],
      answer: "This international airport is in Kenya.",
    },
    {
      question: "On which day does the Ethiopian PP arrive at this airport?",
      type: "multiplechoice",
      choices: [
        "The Ethiopian PP arrives on Monday at this airport.",
        "The Ethiopian PP arrives on Tuesday at this airport.",
        "The Ethiopian PP arrives on Saturday at this airport.",
      ],
      answer: "The Ethiopian PP arrives on Tuesday at this airport.",
    },
  ];

  const synonymQuestions = [
    {
      mainQuestion: "Explain the meaning of the following words as used above.",
      subQuestions: [
        {
          subQuestion: "Cargo",
          type: "multiplechoice",
          choices: [
            "People on an aeroplane.",
            "Goods carried on an aeroplane.",
          ],
          answer: "Goods carried on an aeroplane.",
        },
        {
          subQuestion: "Destination",
          type: "multiplechoice",
          choices: [
            "Destination means the arrival of an aeroplane.",
            "Destination means the place to which the plane is going.",
          ],
          answer: "Destination means the place to which the plane is going.",
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

  function evaluateUserAnswer(
    userAnswer,
    correctAnswers,
    item,
    isSynonymQuestion
  ) {
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
      if (isSynonymQuestion) {
        correctAnswerElement.textContent = `Correct answer: ${correctAnswers.join(
          ", "
        )}`;
      } else {
        correctAnswerElement.textContent = `Correct answers: ${correctAnswers.join(
          ", "
        )}`;
      }
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

    synonymQuestionObj.subQuestions.forEach((subQuestionObj, subIndex) => {
      const subListItem = createElement("li", "subs");
      subListItem.innerHTML = `${subQuestionObj.subQuestion}`;

      if (subQuestionObj.type === "text") {
        const input = createElement("input");
        input.type = "text";
        input.placeholder = "Type your answer here";
        subListItem.appendChild(input);
      } else if (subQuestionObj.type === "multiplechoice") {
        const choicesContainer = createElement("div");

        subQuestionObj.choices.forEach((choice, choiceIndex) => {
          const label = createElement("label");
          const radio = createElement("input");
          radio.type = "radio";
          radio.name = `synonym-question-${synonymIndex}-choice-${subIndex}`;
          radio.value = choice;
          label.appendChild(radio);
          label.appendChild(document.createTextNode(choice));
          choicesContainer.appendChild(label);

          // Add an event listener to each radio button to deselect others within the same subQuestion
          radio.addEventListener("change", function () {
            const radios = choicesContainer.querySelectorAll(
              'input[type="radio"]'
            );
            radios.forEach((otherRadio) => {
              if (otherRadio !== radio) {
                otherRadio.checked = false;
              }
            });
          });
        });

        subListItem.appendChild(choicesContainer);
      }

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
      } else {
        const synonymIndex = i - questions.length;
        const synonymQuestionObj = synonymQuestions[synonymIndex];
        const subList = questionItem.querySelector("ul");
        const subQuestionItems = subList.children;

        for (let j = 0; j < subQuestionItems.length; j++) {
          const subQuestionItem = subQuestionItems[j];
          const subQuestionObj = synonymQuestionObj.subQuestions[j];

          if (subQuestionObj.type === "text") {
            const input = subQuestionItem.querySelector("input");
            userAnswer = input.value.trim();
            const correctAnswers = Array.isArray(subQuestionObj.answer)
              ? subQuestionObj.answer
              : [subQuestionObj.answer];

            evaluateUserAnswer(
              userAnswer,
              correctAnswers,
              subQuestionItem,
              true
            );
          } else if (subQuestionObj.type === "multiplechoice") {
            const selectedChoice = subQuestionItem.querySelector(
              `input[name="synonym-question-${synonymIndex}-choice-${j}"]:checked`
            );
            if (selectedChoice) {
              userAnswer = selectedChoice.value;
              const correctAnswers = [subQuestionObj.answer];

              evaluateUserAnswer(
                userAnswer,
                correctAnswers,
                subQuestionItem,
                true
              );
            } else {
              const correctAnswers = [subQuestionObj.answer];
              evaluateUserAnswer("", correctAnswers, subQuestionItem, true);
            }
          }
          userAnswers.push({ subQuestion: subQuestionObj, userAnswer });
        }
      }
    }
    const storyContent = document.querySelector(".story").innerHTML;
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
