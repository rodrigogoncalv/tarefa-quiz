import { questionsDB } from './question_db.js';
const DOM_question = document.querySelector('[data-js-question]');
const DOM_choices = document.querySelectorAll('[data-js-choice]');
const DOM_buttonNext = document.querySelector('[data-js-button-next]');
const DOM_rightAnswer = document.querySelector('[data-js-right-anwser]');
const DOM_wrongAnswer = document.querySelector('[data-js-wrong-answer]');
const DOM_totalQuestions = document.querySelector('[data-js-total-questions]');
const DOM_totalRemainingQuestions = document.querySelector('[data-js-total-remaining-questions]');

const totalQuestions = questionsDB.length;

let currentQuestion = 0;
let totalRightAnswer = 0;
let totalWrongAnswer = 0;
let answerChosen = false;
let totalRemainingQuestions = questionsDB.length;

const clearAndAddText = (element, text, value) => {
    element.innerText = '';
    element.innerText = `${text} ${value}`;
};

const shuffleArray = (array) => {
    let currentIndex = array.length;
    let temporaryValue = null;
    let randomIndex = null;

    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
};

const loadQuestion = () => {
    const currentQuestionData = questionsDB[currentQuestion];
    clearAndAddText(DOM_question, '', currentQuestionData.question);
    const choices = shuffleArray(currentQuestionData.choices);

    for (let i = 0; i < DOM_choices.length; i++) {
        DOM_choices[i].innerText = '';
        DOM_choices[i].innerText = choices[i];
    }

    answerChosen = false;
};

const restartQuiz = () => {
    currentQuestion = 0;
    totalRightAnswer = 0;
    totalWrongAnswer = 0;
    totalRemainingQuestions = totalQuestions;

    clearAndAddText(DOM_totalRemainingQuestions, 'Perguntas restantes:', totalRemainingQuestions);
    clearAndAddText(DOM_rightAnswer, 'Acertos:', totalRightAnswer);
    clearAndAddText(DOM_wrongAnswer, 'Erros:', totalWrongAnswer);
    loadQuestion();
}

const checkAnswer = (event) => {
    const eventTarget = event.target;
    const selectedText = eventTarget.innerText;
    const rightAnswer = questionsDB[currentQuestion].answer;

    if (answerChosen) {
        alert('Esta pergunta já foi respondida, ir para próxima!');
        return;
    }

    answerChosen = true;

    if (selectedText === rightAnswer) {
        totalRemainingQuestions -= 1;
        totalRightAnswer += 1;
        clearAndAddText(DOM_totalRemainingQuestions, 'Perguntas restantes:', totalRemainingQuestions);
        clearAndAddText(DOM_rightAnswer, 'Acertos:', totalRightAnswer);
        alert('Correto!')
    }
    else {
        totalRemainingQuestions -= 1;
        totalWrongAnswer += 1;
        clearAndAddText(DOM_totalRemainingQuestions, 'Perguntas restantes:', totalRemainingQuestions);
        clearAndAddText(DOM_wrongAnswer, 'Erros:', totalWrongAnswer);
        alert(`Errado! Resposta correta ${rightAnswer.toUpperCase()}`);
    }
};

const startQuiz = () => {
    loadQuestion();
};

DOM_choices.forEach((element) => {
    element.addEventListener('click', (event) => {
        checkAnswer(event);
    });
});

DOM_buttonNext.addEventListener('click', () => {
    let stillHaveQuestions = null;

    if (!answerChosen) {
        alert('Por favor, responda a pergunta!');
        return;
    }

    currentQuestion++;

    stillHaveQuestions = currentQuestion < totalQuestions;

    if (stillHaveQuestions) {
        loadQuestion();
    }
    else {
        alert(`Fim de jogo! Você acertou ${totalRightAnswer} de ${totalQuestions} perguntas.`);
        restartQuiz();
    }
});

window.document.addEventListener('DOMContentLoaded', () => {
    clearAndAddText(DOM_totalQuestions, 'Total de perguntas:', totalQuestions);
    clearAndAddText(DOM_totalRemainingQuestions, 'Perguntas restantes:', totalQuestions);
    clearAndAddText(DOM_rightAnswer, 'Acertos:', totalRightAnswer);
    clearAndAddText(DOM_wrongAnswer, 'Erros:', totalWrongAnswer);
    startQuiz();
});