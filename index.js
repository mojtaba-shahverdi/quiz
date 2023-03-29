const question = document.getElementById('question');
const options = document.querySelector('.quiz-options');
const checkBtn = document.getElementById('check-answer');
const startAgainBtn = document.getElementById('play-again');
const result = document.getElementById('result');
const correctSco = document.getElementById('correct-score');
const totalQuestions = document.getElementById('total-question');

let correctAnswer = "", correctScore = askedCount = 0, totalQuestion = 10;

const loadQuestion= async () => {
    const APIUrl = 'https://opentdb.com/api.php?amount=1';
    const result = await fetch(`${APIUrl}`)
    const data = await result.json();
    result.innerHTML = "";
    showQuestion(data.results[0]);
}
const eventListeners = () => {
    checkBtn.addEventListener('click', checkAnswer);
    startAgainBtn.addEventListener('click', restartQuiz);
}
document.addEventListener('DOMContentLoaded', function(){
    loadQuestion();
    eventListeners();
    totalQuestions.textContent = totalQuestion;
    correctSco.textContent = correctScore;
});
const showQuestion = (data) => {
    checkBtn.disabled = false;
    correctAnswer = data.correct_answer;
    let incorrectAnswer = data.incorrect_answers;
    let optionsList = incorrectAnswer;
    optionsList.splice(Math.floor(Math.random() * (incorrectAnswer.length + 1)), 0, correctAnswer);
    question.innerHTML = `${data.question} <br> <span class = "category"> ${data.category} </span>`;
    options.innerHTML = `
        ${optionsList.map((option, index) => `
            <li> ${index + 1}. <span>${option}</span> </li>
        `).join('')}
    `;
    selectOption();
}
const selectOption = () => {
    options.querySelectorAll('li').forEach(function(option){
        option.addEventListener('click', function(){
            if(options.querySelector('.selected')){
                const activeOption = options.querySelector('.selected');
                activeOption.classList.remove('selected');
            }
            option.classList.add('selected');
        });
    });
}
const checkAnswer = () => {
    checkBtn.disabled = true;
    if(options.querySelector('.selected')){
        let selectedAnswer = options.querySelector('.selected span').textContent;
        if(selectedAnswer == HTMLDecode(correctAnswer)){
            correctScore++;
            result.innerHTML = `<p><i class = "fas fa-check"></i>Correct Answer!</p>`;
        } else {
            result.innerHTML = `<p><i class = "fas fa-times"></i>Incorrect Answer!</p> <small><b>Correct Answer: </b>${correctAnswer}</small>`;
        }
        checkCount();
    } else {
        result.innerHTML = `<p><i class = "fas fa-question"></i>Please select an option!</p>`;
        checkBtn.disabled = false;
    }
}
const HTMLDecode = (textString) => {
    let doc = new DOMParser().parseFromString(textString, "text/html");
    return doc.documentElement.textContent;
}
const checkCount = () => {
    askedCount++;
    setCount();
    if(askedCount == totalQuestion){
        setTimeout(function(){
            console.log("");
        }, 5000);


        result.innerHTML += `<p>Your score is ${correctScore}.</p>`;
        startAgainBtn.style.display = "block";
        checkBtn.style.display = "none";
    } else {
        setTimeout(function(){
            loadQuestion();
        }, 300);
    }
}
const setCount = () => {
    totalQuestions.textContent = totalQuestion;
    correctSco.textContent = correctScore;
}
const restartQuiz = () => {
    correctScore = askedCount = 0;
    startAgainBtn.style.display = "none";
    checkBtn.style.display = "block";
    checkBtn.disabled = false;
    setCount();
    loadQuestion();
}