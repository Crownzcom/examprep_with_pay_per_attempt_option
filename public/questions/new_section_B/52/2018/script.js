document.addEventListener("DOMContentLoaded", function () {
  const questionsList = document.getElementById("questions-list");
  let totalMarks = 0;

  const questions = [
    {
      question: "What is the poem about?",
      type: "multiplechoice",
      choices: [
        "The poem is about public and civil servants.",
        "The poem is about holidays.",
        "The poem is about Labour Day, Women’s Day and Independence Day.",
      ],
      answer: "The poem is about holidays.",
    },
    {
      question: "How many stanzas does the poem have?",
      type: "multiplechoice",
      choices: [
        "The poem has three stanzas.",
        "The poem has two stanzas.",
        "The poem has four stanzas.",
      ],
      answer: "The poem has four stanzas.",
    },
    {
      question: "Why does everybody need a rest?",
      type: "multiplechoice",
      choices: [
        "Every body needs rest to feel fresh again.",
        "Every body needs rest to celebrate success.",
        "Every body needs rest to keep away from books.",
      ],
      answer: "Every body needs rest to feel fresh again.",
    },
    {
      question:
        "When do you think teachers and pupils celebrate examination success?",
      type: "multiplechoice",
      choices: [
        "Teachers and pupils celebrate examination success because they stay home and relax.",
        "Teachers and pupils celebrate examination success because they thank and praise God.",
        "They celebrate examination success because this is the time they step away from their academic work.",
      ],
      answer:
        "They celebrate examination success because this is the time they step away from their academic work.",
    },
    {
      question: "How do the public and civil servants benefit from holidays?",
      type: "multiplechoice",
      choices: [
        "Public and civil servants benefit from holidays by having the opportunity to stay at home and relax.",
        "Public and civil servants benefit from holidays by thanking and praising God.",
        "They benefit from holidays by celebrating success.",
      ],
      answer:
        "Public and civil servants benefit from holidays by having the opportunity to stay at home and relax.",
    },
    {
      question: "Why are holidays useful to believers?",
      type: "multiplechoice",
      choices: [
        "Holidays are useful to believers because they get to stay home and relax.",
        "Holidays are useful to believers because they get to rest and feel fresh again.",
        "Holidays are useful to believers because they get to thank and praise God.",
      ],
      answer:
        "Holidays are useful to believers because they get to thank and praise God.",
    },
    {
      question:
        "Mention any one day in the poem on which believers praise God.",
      type: "text",
      answer: ["Friday", "Saturday", "Sunday"],
    },
    {
      question:
        "Give any one example of a holiday for the public and civil servants.",
      type: "text",
      answer: ["Independence Day", "Women’s Day", "Labour Day"],
    },
    {
      question: "Who wrote the poem?",
      type: "multiplechoice",
      choices: [
        "Teachers and pupils wrote the poem.",
        "Civil servants wrote the poem.",
        "Mungufeni Phoebe wrote the poem.",
      ],
      answer: "Mungufeni Phoebe wrote the poem.",
    },
    {
      question: "Select a suitable title for the poem.",
      type: "multiplechoice",
      choices: ["Sweet holidays", "The teacher's holiday", "Public holidays"],
      answer: "Sweet holidays",
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
          const correctAnswers = questionObj.answer.map((ans) => ans);
          if (correctAnswers.includes(userAnswer)) {
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
          if (userAnswer === questionObj.answer) {
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
      }
    }
    const storyContent = document.querySelector(".poem").innerHTML;
    userAnswers.push({ story: storyContent });

    userAnswers = [];
    const content = document.querySelector(".content").innerHTML;
    userAnswers.push({ story: content, totalMarks: totalMarks, category: 52 });
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
