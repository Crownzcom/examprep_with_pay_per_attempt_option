const dragContainer = document.getElementById("drag-container");
const dropContainer = document.getElementById("drop-container");
const resultContainer = document.getElementById("result-container");

let marks = 0;
let totalMarks = 0;
let correctSentences = 0;
let userOrder = [];
let userAnswers = [];

let userName = "John Doe";
let userAddress = "123 Main St";
let schoolName = "P.N primary school";
let userEmail = "johndoe@example.com";
let phoneNumber = "123-456-7890";
let boxNumber = "123";
let schLoc = "Wakiso";

const date = new Date();
const year = date.getFullYear();
const month = date.getMonth() + 1;
const day = date.getDate();

const currentDate = `${day}/${month}/${year}`;

const sentences = [
  `${schoolName}`,
  `P.O BOX ${boxNumber}`,
  `${schLoc}`,
  `${currentDate}`,
  `The Headmaster`,
  `Pong-Pong Primary School`,
  `P.O. Box 1 Kiddo`,
  `Dear Sir,`,
  `RE: SCHOOL'S FRIENDLY DEBATE`,
  `As the chairperson of our school's Debate club, on behalf of ${schoolName} and the Debate club, `,
  `I write to request you to allow your school Debate Club have a friendly debate with our club.`,
  `It has been agreed upon that your school debate club suggests the motion for the debate.`,
  `We have suggested that the debate takes place on 6th November, 2001 at 2:00 p.m. in your Main hall.`,
  `This debate will strengthen our school ties and provide a memorable educational experience`,
  `We eagerly await your confirmation.`,
  `Yours faithfully,`,
  `${userName}`,
  `Chairperson Debating Club`,
];
userAnswers.push({ sentences: sentences });

const correctOrder = [
  `${schoolName}`,
  `P.O BOX ${boxNumber}`,
  `${schLoc}`,
  `${currentDate}`,
  `The Headmaster`,
  `Pong-Pong Primary School`,
  `P.O. Box 1 Kiddo`,
  `Dear Sir,`,
  `RE: SCHOOL'S FRIENDLY DEBATE`,
  `As the chairperson of our school's Debate club, on behalf of ${schoolName} and the Debate club, `,
  `I write to request you to allow your school Debate Club have a friendly debate with our club.`,
  `It has been agreed upon that your school debate club suggests the motion for the debate.`,
  `We have suggested that the debate takes place on 6th November, 2001 at 2:00 p.m. in your Main hall.`,
  `This debate will strengthen our school ties and provide a memorable educational experience`,
  `We eagerly await your confirmation.`,
  `Yours faithfully,`,
  `${userName}`,
  `Chairperson Debating Club`,
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
  draggableSentence.textContent = `${sentence}`;

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

dropContainer.addEventListener("dragover", (e) => {
  e.preventDefault();
});

function createDroppedSentence(sentence, index) {
  const droppedSentence = document.createElement("div");
  droppedSentence.classList.add("dropped-sentence");

  if (
    sentence === `${schoolName}` ||
    sentence === `P.O BOX ${boxNumber}` ||
    sentence === `${schLoc}` ||
    sentence === `${currentDate}`
  ) {
    droppedSentence.classList.add("right-aligned");
  }
  droppedSentence.textContent = `${sentence}`;
  dropContainer.appendChild(droppedSentence);
}

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
    if (
      sentence === `${schoolName}` ||
      sentence === `P.O BOX ${boxNumber}` ||
      sentence === `${schLoc}` ||
      sentence === `${currentDate}`
    ) {
      orderedSentence.classList.add("right-aligned");
    }
    orderedSentence.textContent = `${sentence}`;
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
      totalMarks += 0.5;
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
  userAnswers.push({ story: content, totalMarks: totalMarks, category: 55 });
  const markedHTML = document.documentElement.outerHTML; 

parent.postMessage({ userAnswers, markedHTML }, window.location.origin);
}

window.addEventListener("message", (event) => {
  if (
    event.origin === window.location.origin ||
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
