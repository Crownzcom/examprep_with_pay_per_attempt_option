const optionsContainer = document.getElementById("questions-container");
let totalMarks = 0;
let userAnswers = [];

const correctPassage = `<p>
                            During Jane's successful party held at the main hall, many people got drunk. 
                            I personally ate a lot of meat, and there were so many other things to eat. Among 
                            the many things, fish was not the best for me. I had terrible diarrhea, which made
                            me very weak and sick.
                        </p>
                        <p>
                            Asiimwe, my friend, came to check on me on the following day.
                        </p>`;
userAnswers.push({ correctPassage: correctPassage });

const options = [
  `<p>
        During Jane’s successful party held at the main hall, many people got drunk. I personally ate a lot of 
        meat and there were so many other things to eat Among the many things fish was not the best for me; 
        I had terrible diarrhea which made me very weak and sick.
    </p>
    <p>
        asiimwe, my friend came to check on me on the following day.
    </p>`,
  `<p>
        During Jane's successful party held at the main hall, many people got drunk. 
        I personally ate a lot of meat, and there were so many other things to eat. Among 
        the many things, fish was not the best for me. I had terrible diarrhea, which made
        me very weak and sick.
    </p>
    <p>
        Asiimwe, my friend, came to check on me on the following day.
    </p>`,
  `<p>
        During Jane's successful party held at the main hall many people got drunk. I personally ate a lot of meat, 
        and there were so many other things to eat. Among the many things, fish was not the best for me I had
        terrible diarrhea, which made me very weak and sick
    </p>
    <p>
        Asiimwe, my friend, came to check on me on the following day.
    </p>`,
];
userAnswers.push({ options: options });

options.forEach((option, index) => {
  const optionDiv = document.createElement("div");
  optionDiv.classList.add("option");

  const radioInput = document.createElement("input");
  radioInput.type = "radio";
  radioInput.name = "passageOption";
  radioInput.value = index;
  radioInput.id = `option${index}`;

  const label = document.createElement("label");
  label.innerHTML = option;
  label.setAttribute("for", `option${index}`);

  optionDiv.appendChild(radioInput);
  optionDiv.appendChild(label);

  optionsContainer.appendChild(optionDiv);
});

function appendCorrectAnswer() {
  const correctAnswerDiv = document.createElement("div");
  correctAnswerDiv.classList.add("correct-answer");
  correctAnswerDiv.innerHTML = `<p>Correct Answer:</p>${correctPassage}`;
  optionsContainer.appendChild(correctAnswerDiv);
}

function createElement(elementType, className) {
  const element = document.createElement(elementType);
  if (className) {
    element.classList.add(className);
  }
  return element;
}

function markOption(option, markElement) {
  const optionLabel = option.nextElementSibling;
  optionLabel.appendChild(markElement);
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
  const selectedOption = document.querySelector(
    'input[name="passageOption"]:checked'
  );

  if (selectedOption) {
    const selectedOptionIndex = parseInt(selectedOption.value);
    if (selectedOptionIndex === 1) {
      totalMarks += 10;
    } else {
      appendCorrectAnswer();
    }
    markOption(
      selectedOption,
      selectedOptionIndex === 1 ? createTickElement() : createCrossElement()
    );
    userAnswers.push({ selectedOptionIndex: selectedOptionIndex });
  } else {
    appendCorrectAnswer();
  }
  const storyContent = document.querySelector(".passage").innerHTML;
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
    event.origin === "http://localhost:5500"
  ) {
    if (event.data === "callEvaluateAllAnswers") {
      evaluateAllAnswers();
    }
  } else {
    return;
  }
});
