let userAnswers = [];

const draggableSentences = [
  "Good afternoon Baguma.",
  "What are you carrying?",
  "Are you a poacher?",
  "So, how did you catch it?",
  "Where are you going to keep it?",
  "What are you going to feed it?",
  "You should report it to Uganda Wildlife Authority",
  "Because you need permission to keep it.",
  "Yes it is responsible for all wild animals.",
  "Alright then, go ahead and report it. Thank you, Baguma.",
];

const correctResponses = {
  "Baguma: Good afternoon Segula.": "Good afternoon Baguma.",
  "Baguma: It is a young monkey.": "What are you carrying?",
  "Baguma: No, I am not a poacher.": "Are you a poacher?",
  "Baguma: I caught it when I scared them with my dogs and the mother abandoned it. They were eating my maize.":
    "So, how did you catch it?",
  "Baguma: I shall keep it at home and build a small cage for it.":
    "Where are you going to keep it?",
  "Baguma: I shall feed it with some yellow bananas and maize.":
    "What are you going to feed it?",
  "Baguma: Why should I report to Uganda Wildlife Authority?":
    "You should report it to Uganda Wildlife Authority",
  "Baguma: I need permission! Is Uganda Wildlife Authority in charge of wild animals?":
    "Because you need permission to keep it.",
  "Baguma: Okay. Then, let me go and report to Uganda Wildlife Authority. Thank you, young boy.":
    "Alright then, go ahead and report it. Thank you, Baguma.",
};

function appendDraggables() {
  const dragContainer = document.getElementById("dragContainer");
  const shuffledSentences = [...draggableSentences];
  shuffleArray(shuffledSentences);

  shuffledSentences.forEach((sentence, index) => {
    const draggableDiv = document.createElement("div");
    draggableDiv.classList.add("draggable");
    draggableDiv.draggable = true;
    draggableDiv.setAttribute("ondragstart", "drag(event)");
    draggableDiv.textContent = sentence;
    draggableDiv.id = "sentence" + (index + 1);
    dragContainer.appendChild(draggableDiv);
  });
}

appendDraggables();

function allowDrop(event) {
  event.preventDefault();
}

function drag(event) {
  event.dataTransfer.setData("text", event.target.id);
}

function drop(event) {
  event.preventDefault();
  var data = event.dataTransfer.getData("text");
  var draggableElement = document.getElementById(data);
  var dropContainer = event.target;

  while (dropContainer && !dropContainer.classList.contains("drop-container")) {
    dropContainer = dropContainer.parentNode;
  }

  if (dropContainer && !dropContainer.classList.contains("filled")) {
    var segulaResponse = dropContainer.querySelector("p:first-child");
    segulaResponse.textContent = "Segula: " + draggableElement.textContent;
    draggableElement.remove();
    dropContainer.classList.add("filled");
  }
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function evaluateAllAnswers() {
  var dropContainers = document.querySelectorAll(".drop-container");
  var totalMarks = 0;

  dropContainers.forEach(function (dropContainer) {
    var segulaResponse = dropContainer
      .querySelector("p:first-child")
      .textContent.trim();
    var correctSegulaResponse = segulaResponse.replace("Segula: ", "");
    var bagumaResponse = dropContainer
      .querySelector("p.draggable")
      .textContent.trim();
    var correctResponse = correctResponses[bagumaResponse];

    var userAnswer = {
      userResponse: correctSegulaResponse,
      correctAnswer: correctResponse,
    };
    userAnswers.push(userAnswer);

    if (correctSegulaResponse === correctResponse) {
      totalMarks++;
      dropContainer.innerHTML += '<span class="tick">&#10003;</span>';
      dropContainer.style.border = "2px dashed green";
    } else {
      dropContainer.innerHTML +=
        '<span class="cross">&#10007;</span><br>Correct response: ' +
        correctResponse;
      dropContainer.style.border = "2px dashed red";
    }
  });

  const storyContent = document.querySelector(".container").innerHTML;
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
    event.origin === "http://localhost:5500"
  ) {
    if (event.data === "callEvaluateAllAnswers") {
      evaluateAllAnswers();
    }
  } else {
    return;
  }
});
