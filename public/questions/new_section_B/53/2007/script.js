document.addEventListener("DOMContentLoaded", function () {
  const one = document.getElementById("one");
  const two = document.getElementById("two");
  const three = document.getElementById("three");
  const four = document.getElementById("four");
  const five = document.getElementById("five");
  const six = document.getElementById("six");
  const seven = document.getElementById("seven");
  const eight = document.getElementById("eight");
  const nine = document.getElementById("nine");
  let totalMarks = 0;
  let userAnswers = [];

  const correctValues = {
    one: "villages",
    two: "Alur",
    three: "cotton",
    four: "cash",
    five: "food",
    six: "animals",
    seven: "numbers",
    eight: "market",
    nine: "marketing",
  };

  function evaluateAllAnswers() {
    const storyContent = document.querySelector(".passage").innerHTML;

    for (let key in correctValues) {
      const inputElement = document.getElementById(key);
      const inputValue = inputElement.value.trim();
      const correctValue = correctValues[key];

      const answerElement = document.getElementById(
        "ans" + key.charAt(0).toUpperCase() + key.slice(1)
      );
      answerElement.textContent = `(Correct answer: ${correctValue})`;

      userAnswers.push({
        question: key,
        userAnswer: inputValue,
        correctAnswer: correctValue,
      });

      if (inputValue === correctValue) {
        totalMarks++;
        inputElement.classList.remove("wrong");
        inputElement.classList.add("correct");
        answerElement.textContent = "";
      } else {
        inputElement.classList.remove("correct");
        inputElement.classList.add("wrong");
      }
    }

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
