"use strict";

// Element Selections

// Buttons
const lockAnswerBtn = document.querySelector(".lock-answer");
const leaveQuizBtn = document.querySelector(".leave-quiz");
const showScoreBtn = document.querySelector(".show-score");
const nextQuestionBtn = document.querySelector(".next-question");
const startBtn = document.querySelector(".start");
const toggleDarkModeBtn = document.querySelector(".darkmode-btn");
const exitQuizBtn = document.querySelector(".exit");

// Containers
const mainSection = document.querySelector(".main-section");
const startQuizCon = document.querySelector(".start-quiz");
const quizCon = document.querySelector(".quiz-con");
const resultCon = document.querySelector(".result-con");

// Text Elements
const questionEl = document.querySelector(".question");
const answer1El = document.querySelector(".answer1");
const answer2El = document.querySelector(".answer2");
const answer3El = document.querySelector(".answer3");
const answer4El = document.querySelector(".answer4");
const scoreEl = document.querySelector(".score");
const highScoreEl = document.querySelector(".high-score");

// Variables

const answerInputs = document.querySelectorAll("input[name=answer]");
let currentQuestionIndex = 0;
let score = 0;
let highScore = 0;

const questions = [
  // 1. Question
  {
    question: "In UI design, what does the acronym 'CTA' stand for?",
    answers: [
      "Click to Activate",
      "Create to Animate",
      "Call to Action",
      "Code to Application",
    ],
    correctAnswer: 2,
  },
  // 2. Question
  {
    question: "What does HTML stand for?",
    answers: [
      "Hyper Text Markup Language",
      "Home Tool Markup Language",
      "Hyperlinks and Text Markup Language",
      "Hyperlinking Text Marking Language",
    ],
    correctAnswer: 0,
  },
  // 3. Question
  {
    question: "Which HTML tag is used for creating a hyperlink?",
    answers: ["<link>", "<href>", "<url>", "<a>"],
    correctAnswer: 3,
  },
];

// Functions

const setUIState = function (state) {
  // Hide and reset everything
  startQuizCon.classList.add("hidden");
  resultCon.classList.add("hidden");
  quizCon.classList.add("hidden");
  quizCon.classList.remove("grid");
  mainSection.classList.remove("after-quiz-state");
  mainSection.classList.remove("start-quiz-state");
  mainSection.classList.remove("quiz-state");

  switch (state) {
    case "start":
      startQuizCon.classList.remove("hidden");
      mainSection.classList.add("start-quiz-state");
      break;
    case "quiz":
      quizCon.classList.remove("hidden");
      quizCon.classList.add("grid");
      mainSection.classList.add("quiz-state");
      break;
    case "result":
      resultCon.classList.remove("hidden");
      mainSection.classList.add("after-quiz-state");
      break;
    default:
      break;
  }
};

const updateQuestion = function (currentQuestionIndex) {
  // Update the elements after every question
  questionEl.textContent = `${currentQuestionIndex + 1}. ${questions[currentQuestionIndex].question}`;
  answer1El.textContent = questions[currentQuestionIndex].answers[0];
  answer2El.textContent = questions[currentQuestionIndex].answers[1];
  answer3El.textContent = questions[currentQuestionIndex].answers[2];
  answer4El.textContent = questions[currentQuestionIndex].answers[3];
};
const resetQuestionUI = function () {
  resetAnswerBorders(answerInputs);
  lockAnswerBtn.disabled = false;
  nextQuestionBtn.classList.add("hidden");
};

const showScore = function () {
  scoreEl.textContent = `${score}/${questions.length}`;
  highScoreEl.textContent = highScore;
  showScoreBtn.classList.add("hidden");
};

const startQuiz = function () {
  setUIState("quiz");
  updateQuestion(currentQuestionIndex);
};

const leaveQuiz = function () {
  currentQuestionIndex = 0;
  score = 0;
  resetQuestionUI();
  setUIState("start");
};

const highlightWrongAnswer = function (selectedAnswer) {
  selectedAnswer.labels[0].classList.remove("border-transparent");
  selectedAnswer.labels[0].classList.add("border-red-600");
  selectedAnswer.labels[0].classList.add("dark:border-red-400");
};

const highlightCorrectAnswer = function (correctAnswer) {
  correctAnswer.labels[0].classList.remove("border-transparent");
  correctAnswer.labels[0].classList.add("border-green-600");
  correctAnswer.labels[0].classList.add("dark:border-green-400");
};

const resetAnswerBorders = function (answerInputs) {
  // Resets the borders of every question
  for (const answer of answerInputs) {
    answer.labels[0].classList.add("answer-hover-effect");
    answer.labels[0].classList.add("border-transparent");
    answer.labels[0].classList.remove("border-green-600");
    answer.labels[0].classList.remove("dark:border-green-400");
    answer.labels[0].classList.remove("border-red-600");
    answer.labels[0].classList.remove("dark:border-red-400");

    answer.checked = false;
  }
};

const prepareNextQuestion = function () {};

const lockAnswer = function () {
  const selectedAnswer = document.querySelector("input[name=answer]:checked");
  const correctAnswer = document.querySelector(
    `input[value="${String(questions[currentQuestionIndex].correctAnswer)}"]`
  );
  if (selectedAnswer) {
    // Removes the hover effect for all answers
    for (let i = 0; i < answerInputs.length; i++) {
      answerInputs[i].labels[0].classList.remove("answer-hover-effect");
    }
    highlightCorrectAnswer(correctAnswer);

    if (selectedAnswer !== correctAnswer) highlightWrongAnswer(selectedAnswer);
    else score++;

    // Only show the next question button if there is another question
    if (currentQuestionIndex < questions.length - 1)
      nextQuestionBtn.classList.remove("hidden");
    else showScoreBtn.classList.remove("hidden");

    lockAnswerBtn.disabled = true;
  }
};

// Events
startBtn.addEventListener("click", startQuiz);

lockAnswerBtn.addEventListener("click", lockAnswer);

leaveQuizBtn.addEventListener("click", leaveQuiz);

exitQuizBtn.addEventListener("click", leaveQuiz);

nextQuestionBtn.addEventListener("click", function () {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    updateQuestion(currentQuestionIndex);
    resetQuestionUI();
  }
});

toggleDarkModeBtn.addEventListener("click", function () {
  document.documentElement.classList.toggle("dark");
  document.documentElement.classList.contains("dark")
    ? localStorage.setItem("darkMode", "true")
    : localStorage.setItem("darkMode", "false");
});

showScoreBtn.addEventListener("click", function () {
  if (score > highScore) {
    localStorage.setItem("highScore", `${score}`);
    highScore = Number(localStorage.getItem("highScore"));
  }

  setUIState("result");
  showScore();
});

document.addEventListener("DOMContentLoaded", (event) => {
  if (localStorage.getItem("darkMode") === "true")
    document.documentElement.classList.add("dark");

  highScore = Number(localStorage.getItem("highScore")) || 0;
});
