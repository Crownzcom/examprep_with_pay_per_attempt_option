document.addEventListener("DOMContentLoaded", function () {
  const questionsList = document.getElementById("questions-list");
  let totalMarks = 0;

  const questions = [
    {
      question: "Where was the Sports Day held?",
      type: "multiplechoice",
      choices: [
        "The sports Day was held at Doho District.",
        "The sports Day was held at Buzibira Primary School.",
        "The sports Day was held at sports day.",
      ],
      answer: "The sports Day was held on at Buzibira Primary School.",
    },
    {
      question: "When was the Sports Day held?",
      type: "multiplechoice",
      choices: [
        "The Sports Day was held on 15th October.",
        "The Sports Day was held in October 2013.",
        "The Sports Day was held on 15th October 2013.",
      ],
      answer: "The Sports Day was held on 15th October, 2013.",
    },
    {
      question: "When did the participants assemble?",
      type: "multiplechoice",
      choices: [
        "The participants assembled at between 8.30am and 9.00 am.",
        "The participants assembled at between 8.00am and 8.30 am.",
        "The participants assembled at between 9.00am and 9.30 am.",
      ],
      answer: "The participants assembled at between 8.30am and 9.00 am.",
    },
    {
      question: "What happened after singing the National and School anthems?",
      type: "multiplechoice",
      choices: [
        "The competition began after singing the National and School anthems.",
        "A prayer was said after singing the National and School anthems.",
        "The chief guest arrived after singing the National and School anthems.",
      ],
      answer:
        "A prayer was said after singing the National and School anthems.",
    },
    {
      question: "At what time did the competition begin?",
      type: "multiplechoice",
      choices: [
        "The competition began at 8.00am.",
        "The competition began at 9.00am.",
        "The competition began at 10.00am.",
      ],
      answer: "The competition began at 10.00am.",
    },
    {
      question: "How long did the lunch break take?",
      type: "multiplechoice",
      choices: [
        "Lunch break took 30 minutes.",
        "Lunch break took one hour.",
        "Lunch break took one and half hours.",
      ],
      answer: "Lunch break took 30 minutes.",
    },
    {
      question:
        "Apart from pupils and teachers, who else took part in the relays?",
      type: "multiplechoice",
      choices: [
        "The chief guest also took part in the relays.",
        "Parents also took part in the relays.",
      ],
      answer: "Parents also took part in the relays.",
    },
    {
      question: "Who was the  Chief Guest?",
      type: "text",
      answer: "The DEO",
    },
    {
      question: "Who wrote the programme?",
      type: "multiplechoice",
      choices: [
        "The DEO wrote the programme.",
        "The District Sports Officer wrote the programme.",
        "The participants wrote the programme.",
      ],
      answer: "Keto's School fees Payment at Pesa Bank.",
    },
    {
      question: "Why is sports important to  our bodies?",
      type: "multiplechoice",
      choices: [
        "Sports is important to our bodies because it cures diseases.",
        "Sports is important to our bodies because it helps body fitness.",
        "Sports is important to our bodies because it bring people together.",
      ],
      answer:
        "Sports is important to our bodies because it helps body fitness.",
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
    const storyContent = document.querySelector(".table").innerHTML;
    userAnswers.push({ story: storyContent });

    userAnswers = [];
    const content = document.querySelector(".content").innerHTML;
    userAnswers.push({ story: content, totalMarks: totalMarks, category: 54 });
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
