let userAnswers = [];

const draggableSentences = [
  "Please teacher, can I come in?",
  "I had gone to the shop.",
  "To buy a pen.",
  "It got lost from the playground.",
  "I don't have a school bag.",
  "He is out of the country.",
  "She is not at home.",
  "She is admitted in hospital.",
  "She is suffering from malaria.",
  "Thank you teacher.",
];

const correctResponses = {
  "Teacher: No, you cannot come in. Why are you late again?":
    "Please teacher, can I come in?",
  "Teacher: To the shop! To buy what?": "I had gone to the shop.",
  "Teacher: Do you buy a pen everyday? What happened to the one you bought yesterday?":
    "To buy a pen.",
  "Teacher: Got lost! Why did you take it to the playground?":
    "It got lost from the playground.",
  "Teacher: Why don’t you tell your father to buy a school bag for you?":
    "I don't have a school bag.",
  "Teacher: If he is out of the country, why don’t you tell your mother to buy one for you?":
    "He is out of the country.",
  "Teacher: Where has she gone?": "She is not at home.",
  "Teacher: Admitted in hospital, suffering from what?":
    "She is admitted in hospital.",
  "Teacher: I am sorry to hear that. I wish her quick recovery. Now, get into the class quickly.":
    "She is suffering from malaria.",
  "Teacher: Don’t come late again!": "Thank you teacher.",
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
    var janeResponse = dropContainer.querySelector("p:first-child");
    janeResponse.textContent = "Jane: " + draggableElement.textContent;
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
    var janeResponse = dropContainer
      .querySelector("p:first-child")
      .textContent.trim();
    var correctJaneResponse = janeResponse.replace("Jane: ", "");
    var teacherResponse = dropContainer
      .querySelector("p.draggable")
      .textContent.trim();
    var correctResponse = correctResponses[teacherResponse];

    var userAnswer = {
      userResponse: correctJaneResponse,
      correctAnswer: correctResponse,
    };
    userAnswers.push(userAnswer);

    if (correctJaneResponse === correctResponse) {
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
