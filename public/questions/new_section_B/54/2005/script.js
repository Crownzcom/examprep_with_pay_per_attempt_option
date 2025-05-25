let userAnswers = [];

const draggableSentences = [
  "Good morning, Madam.",
  "Is the headmaster in the office today?",
  "Will he be in the office tomorrow?",
  "Have you collected the pass slips from Uganda National Examinations Board?",
  "Can I pick mine?",
  "Has Marrion taken hers yet?",
  "Will you allow me to sign for hers as well?",
  "Does Mr. Mugerwa still teach P.7?",
  "Is Mrs. Kamau present?",
  "Alright Madam, thank you very much.",
];

const correctResponses = {
  "Secretary: Good morning, Betty.": "Good morning, Madam.",
  "Secretary: No, he is not in the office today.":
    "Is the headmaster in the office today?",
  "Secretary: No, even tomorrow he won’t be in the office.":
    "Will he be in the office tomorrow?",
  "Secretary: Yes, we have collected all the pass slips from Uganda national examination board.":
    "Have you collected the pass slips from Uganda National Examinations Board?",
  "Secretary: Yes, you can collect yours.": "Can I pick mine?",
  "Secretary: No, Marion hasn’t taken hers yet.": "Has Marrion taken hers yet?",
  "Secretary: Yes, I will allow you to sign for hers as well.":
    "Will you allow me to sign for hers as well?",
  "Secretary: Yes, Mr. Mugerwa still teaches P.7.":
    "Does Mr. Mugerwa still teach P.7?",
  "Secretary: No, Mrs.Kamau is not present. She went back to Kenya to join her family.":
    "Is Mrs. Kamau present?",
  "Secretary: Thank you Betty. Good bye.":
    "Alright Madam, thank you very much.",
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
    var bettyResponse = dropContainer.querySelector("p:first-child");
    bettyResponse.textContent = "Betty: " + draggableElement.textContent;
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
    var bettyResponse = dropContainer
      .querySelector("p:first-child")
      .textContent.trim();
    var correctBettyResponse = bettyResponse.replace("Betty: ", "");
    var secretaryResponse = dropContainer
      .querySelector("p.draggable")
      .textContent.trim();
    var correctResponse = correctResponses[secretaryResponse];

    var userAnswer = {
      userResponse: correctBettyResponse,
      correctAnswer: correctResponse,
    };
    userAnswers.push(userAnswer);

    if (correctBettyResponse === correctResponse) {
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
