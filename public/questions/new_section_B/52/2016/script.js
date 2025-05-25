document.addEventListener("DOMContentLoaded", function () {
  const questionsList = document.getElementById("questions-list");
  let totalMarks = 0;

  const questions = [
    {
      question: "In which school was the above table found?",
      type: "multiplechoice",
      choices: [
        "The above table was found in my school.",
        "The above table was found in Nyayuk Primary School.",
        "The above table was found in Kampala Parents School.",
      ],
      answer: "The above table was found in Nyayuk Primary School.",
    },
    {
      question: "When was the table above prepared?",
      type: "multiplechoice",
      choices: [
        "The table was prepared in first term.",
        "The table was prepared in two thousand twenty four.",
        "The table was prepared in third term.",
      ],
      answer: "The table was prepared in third term.",
    },
    {
      question: "Which pupils borrowed story books and they had not returned?",
      type: "multiplechoice",
      choices: [
        "Giire Ben and Siem Siem Sarah.",
        "Achieng Matilda and Siem Sarah.",
        "Achieng Matilda and Kikobo Mary.",
      ],
      answer: "Achieng Matilda and Siem Sarah.",
    },
    {
      question: "How many books did Kikobo Mary borrow?",
      type: "multiplechoice",
      choices: [
        "Kikobo Mary borrowed three books.",
        "Kikobo Mary borrowed two books.",
        "Kikobo Mary borrowed four books.",
      ],
      answer: "Kikobo Mary borrowed three books.",
    },
    {
      question: "Who borrowed two books and had not returned them?",
      type: "multiplechoice",
      choices: [
        "Mukasa John and Giire Ben borrowed two books and have not returned them.",
        "Bwayo Eddy and Giire Ben borrowed two books and have not returned them.",
        "Bwayo Eddy and Osewe Tom borrowed two books and have not returned them.",
      ],
      answer:
        "Bwayo Eddy and Giire Ben borrowed two books and have not returned them.",
    },
    {
      question: "Who is likely to borrow a new book?",
      type: "multiplechoice",
      choices: [
        "Mbusa Adam is likely to borrow a new book.",
        "Giire Ben is likely to borrow a new book.",
        "Osewe Tom is likely to borrow a new book.",
      ],
      answer: "Mbusa Adam is likely to borrow a new book.",
    },
    {
      question: "Who borrowed the most books?",
      type: "multiplechoice",
      choices: [
        "Kere Charles borrowed the most books.",
        "Mbusa Adam borrowed the most books.",
        "Giire Ben borrowed the most books.",
      ],
      answer: "Giire Ben borrowed the most books.",
    },
    {
      question: "How many pupils borrowed books from the library?",
      type: "multiplechoice",
      choices: [
        "Seven pupils borrowed books from the library.",
        "Ten pupils borrowed books from the library.",
        "Five pupils borrowed books from the library.",
      ],
      answer: "Ten pupils borrowed books from the library.",
    },
    {
      question: "Which class had the least number of pupils using library?",
      type: "multiplechoice",
      choices: [
        "Primary three had the least number of pupils using library.",
        "Primary four had the least number of pupils using library.",
        "Primary seven had the least number of pupils using library.",
      ],
      answer: "Primary three had the least number of pupils using library.",
    },
    {
      question: "Who is the librarian?",
      type: "multiplechoice",
      choices: [
        "Giire Ben is the librarian.",
        "Achieng Matilda is the librarian.",
        "Nakalema Jane is the librarian.",
      ],
      answer: "Nakalema Jane is the librarian.",
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
