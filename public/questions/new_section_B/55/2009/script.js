let isDraggingEnabled = true;
const dragContainer = document.getElementById("dragContainer");
let userAnswers = [];

const draggableSentences = [
  "I did not perform well in my PLE exams.",
  "I have a serious reason.",
  "I did not attend school for a whole term.",
  "I was not allowed in school without the school uniform.",
  "He was not around because he had gone to Britain.",
  "He went there for studies.",
  "My uncle bought for me the uniform.",
  "Yes, I am going to repeat P.7.",
  "Thank you, Jacob.",
  "Good bye too.",
];

const correctResponses = {
  "Jacob: You look sad, what is the matter?":
    "I did not perform well in my PLE exams.",
  "Jacob: What was the cause of your poor performance in the PLE?":
    "I have a serious reason.",
  "Jacob: What is that reason?": "I did not attend school for a whole term.",
  "Jacob: Why did you stay out school for a whole term?":
    "I was not allowed in school without the school uniform.",
  "Jacob: Why didn’t your father buy the school uniform for you?":
    "He was not around because he had gone to Britain.",
  "Jacob: Why did he go to Britain?": "He went there for studies.",
  "Jacob: How did you get the money to buy the uniform when your father went to Britain for studies?":
    "My uncle bought for me the uniform.",
  "Jacob: What a kind uncle! You’re going to repeat P.7, aren’t you?":
    "Yes, I am going to repeat P.7.",
  "Jacob: I wish you success.": "Thank you, Jacob.",
  "Jacob: Good bye.": "Good bye too.",
};

function appendDraggables() {
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
    var peterResponse = dropContainer.querySelector("p:nth-child(2)");
    peterResponse.textContent = "Peter: " + draggableElement.textContent;
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
    var peterResponse = dropContainer
      .querySelector("p:nth-child(2)")
      .textContent.trim();
    var correctPeterResponse = peterResponse.replace("Peter: ", "");
    var jacobResponse = dropContainer
      .querySelector("p.draggable")
      .textContent.trim();
    var correctResponse = correctResponses[jacobResponse];

    var userAnswer = {
      userResponse: correctPeterResponse,
      correctAnswer: correctResponse,
    };
    userAnswers.push(userAnswer);

    if (correctPeterResponse === correctResponse) {
      totalMarks++;
      dropContainer.innerHTML += '<span class="tick">&#10003;</span>';
    } else {
      dropContainer.innerHTML +=
        '<span class="cross">&#10007;</span><br>Correct response: ' +
        correctResponse;
    }
  });
  const storyContent = document.querySelector(".container").innerHTML;
  userAnswers.push({ story: storyContent });

  userAnswers = [];
  const content = document.querySelector(".content").innerHTML;
  userAnswers.push({ story: content, totalMarks: totalMarks, category: 55 });
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
