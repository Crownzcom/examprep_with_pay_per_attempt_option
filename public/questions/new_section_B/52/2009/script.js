const dragContainer = document.getElementById("drag-container");
const dropContainer = document.getElementById("drop-container");
const resultContainer = document.getElementById("result-container");

let marks = 0;
let totalMarks = 0;
let correctSentences = 0;
let userOrder = [];
let userAnswers = [];

const sentences = [
  "This was not so in the past years.",
  "The new constitution of Uganda now says that all Ugandans who are registered voters can vote for any presidential candidate they like.",
  "The year 1996 will be remembered as one of the most important years in the history of Uganda.",
  "This now means that any Ugandan who becomes president has very big support from many Ugandans.",
  "This is so because it was the year when Ugandans directly elected their president for the first time.",
  "Uganda has, therefore, become one of the countries in the world where the people themselves decide who should be their president.",
  "Why is it so?",
  "Most people believe that this good for Uganda.",
  "This is not so any more.",
  "In those years, anyone who was a leader of the party which won elections to parliament became the president of Uganda.",
];
userAnswers.push({ sentences: sentences });

const correctOrder = [
  "The year 1996 will be remembered as one of the most important years in the history of Uganda.",
  "This is so because it was the year when Ugandans directly elected their president for the first time.",
  "In those years, anyone who was a leader of the party which won elections to parliament became the president of Uganda.",
  "This is not so any more.",
  "The new constitution of Uganda now says that all Ugandans who are registered voters can vote for any presidential candidate they like.",
  "This now means that any Ugandan who becomes president has very big support from many Ugandans.",
  "Uganda has, therefore, become one of the countries in the world where the people themselves decide who should be their president.",
  "Why is it so?",
  "Most people believe that this good for Uganda.",
  "This was not so in the past years.",
];
userAnswers.push({ correctOrder: correctOrder });

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function addDropPlaceholder() {
  const dropPlaceholder = document.createElement("div");
  dropPlaceholder.classList.add("drop-placeholder");
  dropPlaceholder.textContent = "Drop the sentences here............";
  dropContainer.appendChild(dropPlaceholder);
}
addDropPlaceholder();

function createDraggableSentence(sentence, index) {
  const draggableSentence = document.createElement("div");
  draggableSentence.draggable = true;
  draggableSentence.classList.add("draggable-sentence");
  draggableSentence.dataset.index = index;
  draggableSentence.textContent = `${index + 1}. ${sentence}`;

  draggableSentence.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", index);
  });

  draggableSentence.addEventListener("touchstart", touchStart);
  draggableSentence.addEventListener("touchmove", touchMove);
  draggableSentence.addEventListener("touchend", touchEnd);

  dragContainer.appendChild(draggableSentence);
}

function touchStart(e) {
  this.style.position = 'absolute';
  this.style.zIndex = 1000;
  const touch = e.touches[0];
  const offsetX = touch.clientX - this.getBoundingClientRect().left;
  const offsetY = touch.clientY - this.getBoundingClientRect().top;
  this.style.left = touch.clientX - offsetX + 'px';
  this.style.top = touch.clientY - offsetY + 'px';
  this.setAttribute('data-index', this.dataset.index);
}

function touchMove(e) {
  const touch = e.touches[0];
  this.style.left = touch.clientX - parseInt(this.offsetWidth / 2) + 'px';
  this.style.top = touch.clientY - parseInt(this.offsetHeight / 2) + 'px';
}

function touchEnd(e) {
  const dropRect = dropContainer.getBoundingClientRect();
  const touchX = e.changedTouches[0].clientX;
  const touchY = e.changedTouches[0].clientY;

  // Check if the touch event ended within the boundaries of the dropContainer
  if (touchX >= dropRect.left && touchX <= dropRect.right && touchY >= dropRect.top && touchY <= dropRect.bottom) {
      const droppedIndex = parseInt(this.getAttribute('data-index'));
      const sentenceText = sentences[droppedIndex];

      createDroppedSentence(sentenceText, marks);
      userOrder.push(sentenceText);

      marks++;
      const dropPlaceholder = document.querySelector(".drop-placeholder");
      if (dropPlaceholder) {
          dropContainer.removeChild(dropPlaceholder);
      }
      this.parentNode.removeChild(this);

      if (marks === sentences.length) {
          dragContainer.classList.add('hidden');
      }
  } else {
      // Reset the position of the sentence to its original position
      this.style.position = '';
      this.style.left = '';
      this.style.top = '';
  }
}

function createDroppedSentence(sentence, index) {
  const droppedSentence = document.createElement("div");
  droppedSentence.classList.add("dropped-sentence");
  droppedSentence.textContent = `${index + 1}. ${sentence}`;
  dropContainer.appendChild(droppedSentence);
}

dropContainer.addEventListener("dragover", (e) => {
  e.preventDefault();
});

dropContainer.addEventListener("drop", (e) => {
  e.preventDefault();
  const droppedIndex = parseInt(e.dataTransfer.getData("text/plain"));
  const sentenceText = sentences[droppedIndex];

  createDroppedSentence(sentenceText, marks);
  userOrder.push(sentenceText);

  marks++;
  const dropPlaceholder = document.querySelector(".drop-placeholder");
  if (dropPlaceholder) {
    dropContainer.removeChild(dropPlaceholder);
  }
  const draggedSentence = document.querySelector(
    `[data-index="${droppedIndex}"]`
  );
  dragContainer.removeChild(draggedSentence);

  if (marks === sentences.length) {
    dragContainer.classList.add("hidden");
  }
});

function showCorrectOrder() {
  resultContainer.textContent = "Correct order: ";
  correctOrder.forEach((sentence, index) => {
    const orderedSentence = document.createElement("div");
    orderedSentence.classList.add("sentenceInOrder");
    orderedSentence.textContent = `${index + 1}. ${sentence}`;
    resultContainer.appendChild(orderedSentence);
  });
}
shuffleArray(sentences);

sentences.forEach((sentence, index) => {
  createDraggableSentence(sentence, index);
});

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

function evaluateAllAnswers() {
  resultContainer.innerHTML = "";
  resultContainer.classList.remove("hidden");

  let allCorrect = true;

  userOrder.forEach((sentence, index) => {
    const droppedSentence = document.querySelector(
      `#drop-container .dropped-sentence:nth-child(${index + 1})`
    );

    if (sentence === correctOrder[index]) {
      tickElement = createTickElement();
      droppedSentence.appendChild(tickElement);
      correctSentences++;
      totalMarks++;
    } else {
      crossElement = createCrossElement();
      droppedSentence.appendChild(crossElement);
      allCorrect = false;
    }
  });

  if (!allCorrect || userOrder.length === 0 || userOrder.length !== sentences.length) {
    showCorrectOrder();
  }
  userAnswers.push({ userOrder: userOrder });

  userAnswers = [];
  const content = document.querySelector(".content").innerHTML;
  userAnswers.push({ story: content, totalMarks: totalMarks, category: 52 });
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
