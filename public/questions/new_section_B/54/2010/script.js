document.addEventListener('DOMContentLoaded', function() {
    const questionsList = document.getElementById('questions-list');
    let totalMarks = 0;

    const questions = [
        {
            question: "What does the writer call a social evil?",
            type: "text",
            answer: "A social evil"
        },
        {
            question: "Mention one place where defilement is carried out according to the poem",
            type: "text",
            answer: ["Towns","Villages","School","Houses"]
        },
		{
            question: "Which people carry out defilement in our communities?",
            type: "multiplechoice",
			choices: [
                "The merciless people carry out defilement in our communities.",
                "Young girls and boys carry out defilement in our communities."
            ],
            answer: "The merciless people carry out defilement in our communities."
        },
        {
            question: "How do defilers trick young girls and boys?",
            type: "multiplechoice",
            choices: [
                "Defilers trick young girls and boys by giving them money and other gifts.",
                "Defilers trick young girls and boys by being nice to them.",
                "Defilers trick young girls and boys by giving them inviting them to parties."
            ],
            answer: "Defilers trick young girls and boys by giving them money and other gifts."
        },
        {
            question: "What advice is the writer giving to young girls and boys?",
            type: "multiplechoice",
            choices: [
                "The writer advises young girls and boys accept money and other gifts.",
                "The writer advises young girls and boys to say no to money and other gifts."
            ],
            answer: "The writer advises young girls and boys to say no to money and other gifts."
        },
        {
            question: "Mention one problem girls and boys get when defiled.",
            type: "text",
            answer: ["Infected with HIV/AIDS.","Dropping out of school", "Death"]
        },
		{
            question: "What should the police do to people who carry out defilement?",
            type: "multiplechoice",
			choices: [
                "The police should arrest and prosecute the men and women who carry out defilement.",
                "The police should not arrest and prosecute the men and women who carry out defilement."
            ],
            answer: "The police should arrest and prosecute the men and women who carry out defilement."
        },
		{
            question: "Select a suitable title to this poem?",
            type: "multiplechoice",
			choices: [
                "Stop Difilement.",
                "Young girls and boys.",
                "The police."
            ],
            answer: "Stop Difilement."
        }
    ];

    const synonymQuestions = [
        {
            mainQuestion: "Give another word or group of words with the same meaning as each of the underlined words in the space.",
            subQuestions: [
                {
                    subQuestion: "Evil",
                    type: "text",
                    answer: ["offence","sin","vice","crime"]
                },
                {
                    subQuestion: "Merciless ",
                    type: "text",
                    answer: ["pitiless","remorseless","brutal","heartless","ruthless"]
                }
            ]
        }
    ];

    function createElement(elementType, className) {
        const element = document.createElement(elementType);
        if (className) {
            element.classList.add(className);
        }
        return element;
    }

    function createTickElement() {
        const tickElement = createElement('span', 'tick');
        tickElement.textContent = '\u2713';
        return tickElement;
    }

    function createCrossElement() {
        const crossElement = createElement('span', 'cross');
        crossElement.textContent = '\u2717';
        return crossElement;
    }

    function evaluateUserAnswer(userAnswer, correctAnswers, item) {
        const isAnswerCorrect = correctAnswers.some(correctAnswer =>
            userAnswer.toLowerCase() === correctAnswer.toLowerCase()
        );

        if (isAnswerCorrect) {
            totalMarks++;
            item.appendChild(createTickElement());
        } else {
            item.appendChild(createCrossElement());
            const correctAnswerElement = createElement('span', 'correct-answer');
            correctAnswerElement.textContent = `Correct answers: ${correctAnswers.join(', ')}`;
            item.appendChild(correctAnswerElement);
        }
    }

    questions.forEach((questionObj, index) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `<span class="question-number"></span> ${questionObj.question}`;

        if (questionObj.type === "text") {
            const input = document.createElement('input');
            input.type = 'text';
            input.placeholder = 'Type your answer here';
            listItem.appendChild(input);
        } else if (questionObj.type === "multiplechoice") {
            const choicesContainer = document.createElement('div');

            questionObj.choices.forEach(choice => {
                const label = document.createElement('label');
                const radio = document.createElement('input');
                radio.type = 'radio';
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
	

    synonymQuestions.forEach((synonymQuestionObj, synonymIndex) => {
		const mainListItem = createElement('li', 'main');
		mainListItem.innerHTML = `${synonymQuestionObj.mainQuestion}`;

		const subList = createElement('ul');

		synonymQuestionObj.subQuestions.forEach(subQuestionObj => {
			const subListItem = createElement('li', 'subs');
			subListItem.innerHTML = `${subQuestionObj.subQuestion}`;

			const input = createElement('input');
			input.type = 'text';
			input.placeholder = 'Type your answer here';
			subListItem.appendChild(input);

			subList.appendChild(subListItem);
		});

		mainListItem.appendChild(subList);
		questionsList.appendChild(mainListItem);
	});

    function evaluateAllAnswers() {
        const questionItems = questionsList.children;
        let userAnswers = [];
    
        for (let i = 0; i < questionItems.length; i++) {
            const questionItem = questionItems[i];
            let userAnswer = '';
    
            if (i < questions.length) {
                const questionObj = questions[i];
    
                if (questionObj.type === "text") {
                    const input = questionItem.querySelector('input');
                    userAnswer = input.value.trim();
                } else if (questionObj.type === "multiplechoice") {
                    const selectedChoice = questionItem.querySelector(`input[name="question-${i}"]:checked`);
                    if (selectedChoice) {
                        userAnswer = selectedChoice.value;
                    }
                }
    
                if (Array.isArray(questionObj.answer)) {
                    const correctAnswers = questionObj.answer.map(ans => ans.toLowerCase());
                    if (correctAnswers.includes(userAnswer.toLowerCase())) {
                        totalMarks++;
                        tickElement = createTickElement();
                        questionItem.appendChild(tickElement);
                    } else {
                        crossElement = createCrossElement();
                        questionItem.appendChild(crossElement);
                        const correctAnswerElement = document.createElement('span');
                        correctAnswerElement.classList.add('correct-answer');
                        correctAnswerElement.textContent = `Correct answers: ${correctAnswers.join(', ')}`;
                        questionItem.appendChild(correctAnswerElement);
                    }
                } else {
                    if (userAnswer.toLowerCase() === questionObj.answer.toLowerCase()) {
                        totalMarks++;
                        tickElement = createTickElement();
                        questionItem.appendChild(tickElement);
                    } else {
                        crossElement = createCrossElement();
                        questionItem.appendChild(crossElement);
                        const correctAnswerElement = document.createElement('span');
                        correctAnswerElement.classList.add('correct-answer');
                        correctAnswerElement.textContent = `Correct answer: ${questionObj.answer}`;
                        questionItem.appendChild(correctAnswerElement);
                    }
                }
                userAnswers.push({ question: questionObj, userAnswer });
            } else {
                const synonymIndex = i - questions.length;
                const synonymQuestionObj = synonymQuestions[synonymIndex];
                const subList = questionItem.querySelector('ul');
                const subQuestionItems = subList.children;
    
                for (let j = 0; j < subQuestionItems.length; j++) {
                    const subQuestionItem = subQuestionItems[j];
                    const subQuestionObj = synonymQuestionObj.subQuestions[j];
                    const input = subQuestionItem.querySelector('input');
                    userAnswer = input.value.trim();
                    const correctAnswers = Array.isArray(subQuestionObj.answer) ? subQuestionObj.answer : [subQuestionObj.answer];
                    evaluateUserAnswer(userAnswer, correctAnswers, subQuestionItem);
                    userAnswers.push({ subQuestion: subQuestionObj, userAnswer });
                }
            }
        }
        const storyContent = document.querySelector('.poem').innerHTML
        userAnswers.push({story:storyContent})

userAnswers=[];
const content = document.querySelector('.content').innerHTML
userAnswers.push({ story: content, totalMarks: totalMarks, category: 54});
        const markedHTML = document.documentElement.outerHTML; 

parent.postMessage({ userAnswers, markedHTML }, window.location.origin);
    }

    window.addEventListener('message', event => {
        if (event.origin === window.location.origin || event.origin === "http://localhost:5173" || event.origin === 'http://localhost:5500') {
            if (event.data === 'callEvaluateAllAnswers') {
                evaluateAllAnswers();
            }
        } else {
            return;
        }
    });
});
