document.addEventListener("DOMContentLoaded", function () {
  const questionsList = document.getElementById("questions-list");
  let totalMarks = 0;

  const questions = [
    {
      question: "Which school carried out the above activity?",
      type: "text",
      answer: ["Pambaya Model School"],
    },
    {
      question: "What did Atwine Sabiti do on Monday?",
      type: "multiplechoice",
      choices: [
        "Atwine Sabiti checked P.2 pupils on Monday.",
        "Atwine Sabiti checked P.1 pupils on Monday.",
        "Atwine Sabiti checked P.3 pupils on Monday.",
      ],
      answer: "Atwine Sabiti checked P.1 pupils on Monday.",
    },
    {
      question: "How many boys had dirty bodies in P.1 on Wednesday",
      type: "multiplechoice",
      choices: [
        "Eight boys had dirty bodies in P.1 on Wednesday.",
        "Four boys had dirty bodies in P.1 on Wednesday.",
        "Twelve boys had dirty bodies in P.1 on Wednesday.",
      ],
      answer: "Eight boys had dirty bodies in P.1 on Wednesday.",
    },
    {
      question: "What happened to boys and girls in P.3 class on Tuesday?",
      type: "multiplechoice",
      choices: [
        "All the boys and girls had unbrushed teeth in P.3 class on Tuesday.",
        "All the boys and girls had brushed teeth in P.3 class on Tuesday.",
        "All the boys and girls had dirty uniforms in P.3 class on Tuesday.",
      ],
      answer:
        "All the boys and girls had brushed teeth in P.3 class on Tuesday.",
    },
    {
      question: "What was the total number of girls who had dirty uniforms?",
      type: "multiplechoice",
      choices: [
        "Eight girls had dirty uniforms.",
        "Four girls had dirty uniforms.",
        "Fourteen girls had dirty uniforms.",
      ],
      answer: "Fourteen girls had dirty uniforms.",
    },
    {
      question: "Which prefect checked on the personal hygiene three times?",
      type: "multiplechoice",
      choices: [
        "Nabirye Maureen checked on the personal hygiene three times.",
        "Akasime Michelle checked on the personal hygiene three times.",
        "Wano Rehema checked on the personal hygiene three times.",
      ],
      answer: "Nabirye Maureen checked on the personal hygiene three times.",
    },
    {
      question: "How many teachers supervised the exercise?",
      type: "multiplechoice",
      choices: [
        "Three teachers supervised the exercise.",
        "Four teachers supervised the exercise.",
      ],
      answer: "Three teachers supervised the exercise.",
    },
    {
      question: "On which day of the week was the checking not done?",
      type: "multiplechoice",
      choices: [
        "The checking was not done on Saturday.",
        "The checking was not done on Thursday.",
        "The checking was not done on Sunday.",
      ],
      answer: "The checking was not done on Thursday.",
    },
    {
      question: "Who was in charge of sanitation in the school?",
      type: "multiplechoice",
      choices: [
        "Mrs Haumba Rehema was in charge of sanitation in the school.",
        "Mr Masaba Isaac was in charge of sanitation in the school.",
        "The prefects were in charge of sanitation in the school.",
      ],
      answer: "Mrs Haumba Rehema was in charge of sanitation in the school.",
    },
    {
      question: "Why do you think all schools should carry out health parades?",
      type: "multiplechoice",
      choices: [
        "All schools should carry out health parades because it promotes personal hygiene.",
        "All schools should carry out health parades to shame those who are unhygienic.",
      ],
      answer:
        "All schools should carry out health parades because it promotes personal hygiene.",
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
