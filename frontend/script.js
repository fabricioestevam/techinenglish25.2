const questions = [
  { topic: "Present Simple", difficulty: "fácil", q: "He ____ to school every day.", choices: ["go", "goes", "going", "gone"], a: 1 },
  { topic: "Present Continuous", difficulty: "médio", q: "She ____ (study) right now.", choices: ["studies", "is studying", "study", "was studying"], a: 1 },
  { topic: "Future (Will)", difficulty: "fácil", q: "I think it ____ rain tomorrow.", choices: ["is", "will", "was", "would"], a: 1 },
  { topic: "WH Questions", difficulty: "médio", q: "____ did you arrive?", choices: ["When", "What", "How", "Who"], a: 0 },
  { topic: "Question Formation", difficulty: "difícil", q: "Turn into a question: 'She has finished the work.'", choices: ["Has she finished the work?", "She has finished the work?", "Does she finish the work?", "Has finished she the work?"], a: 0 },
  { topic: "JavaScript", difficulty: "difícil", q: "Which keyword declares a block-scoped variable in modern JS?", choices: ["var", "let", "const", "define"], a: 1 },
  { topic: "Present Simple", difficulty: "fácil", q: "She ___ to school every day.", choices: ["go", "goes", "going", "gone"], a: 1},
  { topic: "Present Simple", difficulty: "fácil", q: "They ___ football on Sundays.", choices: ["play", "plays", "playing", "played"], a: 0},
  { topic: "Present Simple", difficulty: "médio", q: "He ___ like pizza.", choices: ["don't", "doesn't", "isn't", "aren't"], a: 1},
  { topic: "Present Continuous", difficulty: "fácil", q: "Right now, I ___ a book.", choices: ["read", "reads", "am reading", "reading"], a: 2},
  { topic: "Present Continuous", difficulty: "fácil", q: "They ___ TV at the moment.", choices: ["watch", "are watching", "watched", "watching"], a: 1},
  { topic: "Present Continuous", difficulty: "médio", q: "Listen! The birds ___.", choices: ["sing", "sings", "are singing", "singing"], a: 2},
  { topic: "Future (Will)", difficulty: "fácil", q: "I think it ___ rain tomorrow.", choices: ["will", "won't", "is", "does"], a: 0},
  { topic: "Future (Will)", difficulty: "fácil", q: "She ___ help you with your homework.", choices: ["will", "is", "can", "does"], a: 0},
  { topic: "Future (Will)", difficulty: "médio", q: "Don't worry! I ___ call you later.", choices: ["will", "shall", "am", "can"], a: 0},
  { topic: "WH Questions", difficulty: "fácil", q: "___ is your best friend?", choices: ["Who", "Where", "What", "How"], a: 0},
  { topic: "WH Questions", difficulty: "fácil", q: "___ are you going on holiday?", choices: ["Who", "Where", "When", "What"], a: 1},
  { topic: "WH Questions", difficulty: "médio", q: "___ do you usually have for breakfast?", choices: ["How", "What", "Where", "Who"], a: 1},
  { topic: "JavaScript", difficulty: "fácil", q: "Which keyword declares a constant in JavaScript?", choices: ["var", "let", "const", "define"], a: 2 },
  { topic: "JavaScript", difficulty: "médio", q: "What does DOM stand for?", choices: ["Document Object Model", "Data Oriented Method", "Digital Output Manager", "Dynamic Object Map"], a: 0 },
  { topic: "JavaScript", difficulty: "médio", q: "Which operator is used for strict equality?", choices: ["=", "==", "===", "!=="], a: 2 }
];

const pontos = { "fácil": 5, "médio": 10, "difícil": 20 };

let index = 0, score = 0, timer, tempoRestante = 25;

const quizEl = document.getElementById("quiz");
const endScreenEl = document.getElementById("end-screen");
const questionEl = document.getElementById("question");
const choicesEl = document.getElementById("choices");
const progressEl = document.getElementById("progress");
const categoryEl = document.getElementById("question-category");
const timerEl = document.getElementById("timer");
const scoreEl = document.getElementById("score");
const finalScoreEl = document.getElementById("final-score");
const nameInput = document.getElementById("player-name");
const leaderboardList = document.getElementById("leaderboard-list");

function iniciarQuestao() {
  if (index >= questions.length) return finalizarQuiz();

  const q = questions[index];
  questionEl.textContent = q.q;
  progressEl.textContent = `${index + 1}/${questions.length}`;
  categoryEl.textContent = `${q.topic} - ${q.difficulty}`;
  choicesEl.innerHTML = "";

  q.choices.forEach((choice, i) => {
    const btn = document.createElement("button");
    btn.textContent = choice;
    btn.onclick = () => verificarResposta(i);
    choicesEl.appendChild(btn);
  });

  resetarTimer();
}

function verificarResposta(i) {
  const q = questions[index];
  const buttons = choicesEl.querySelectorAll("button");
  
  // Desabilitar todos os botões
  buttons.forEach(btn => btn.disabled = true);
  
  if (i === q.a) {
    score += pontos[q.difficulty];
    buttons[i].classList.add("correct");
  } else {
    buttons[i].classList.add("wrong");
    buttons[q.a].classList.add("correct");
  }
  
  scoreEl.textContent = `Pontos: ${score}`;
  index++;
  
  setTimeout(iniciarQuestao, 1500);
}

function resetarTimer() {
  clearInterval(timer);
  tempoRestante = 25;
  timerEl.textContent = `Tempo: ${tempoRestante}s`;
  
  timer = setInterval(() => {
    tempoRestante--;
    timerEl.textContent = `Tempo: ${tempoRestante}s`;
    
    if (tempoRestante <= 0) {
      clearInterval(timer);
      // Simular resposta errada quando o tempo acaba
      const buttons = choicesEl.querySelectorAll("button");
      buttons.forEach(btn => btn.disabled = true);
      buttons[questions[index].a].classList.add("correct");
      
      index++;
      setTimeout(iniciarQuestao, 1500);
    }
  }, 1000);
}

function finalizarQuiz() {
  clearInterval(timer);
  quizEl.classList.add("hidden");
  endScreenEl.classList.remove("hidden");
  finalScoreEl.textContent = score;
}

function salvarPlacar() {
  const nome = nameInput.value.trim() || "Anônimo";
  const record = { nome, score, data: Date.now() };

  let placar = JSON.parse(localStorage.getItem("quiz_scores") || "[]");
  placar.push(record);
  placar.sort((a, b) => b.score - a.score);
  placar = placar.slice(0, 10);
  localStorage.setItem("quiz_scores", JSON.stringify(placar));

  renderizarPlacar();
}

function renderizarPlacar() {
  const placar = JSON.parse(localStorage.getItem("quiz_scores") || "[]");
  leaderboardList.innerHTML = "";
  placar.forEach((r, i) => {
    const li = document.createElement("li");
    li.textContent = `${i + 1}. ${r.nome} — ${r.score} pts`;
    leaderboardList.appendChild(li);
  });
}

// Event listeners
document.getElementById("save-score").onclick = salvarPlacar;
document.getElementById("restart").onclick = () => location.reload();

// Inicializar o quiz
renderizarPlacar();
iniciarQuestao();