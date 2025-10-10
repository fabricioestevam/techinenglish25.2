const questoes = [
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

// NOVA FUNÇÃO: Mostrar feedback visual baseado na pontuação
function showScoreFeedback(score) {
  const feedbackContainer = document.getElementById('score-feedback');
  const feedbackImage = document.getElementById('feedback-image');
  const feedbackMessage = document.getElementById('feedback-message');
  
  if (!feedbackContainer) return; // Se não existir o elemento, não faz nada
  
  let imageUrl = '';
  let message = '';
  let category = '';
  
  // Calcular percentual (assumindo pontuação máxima de ~420 pontos)
  let possibleScores = questoes.map(item => pontos[item.difficulty]);
  let maxScore = possibleScores.reduce((a, b) => a + b);
  const percentual = (score / maxScore) * 100;
  console.log("Pontos: ", score, "\nPercentual: ", percentual);
  
  if (percentual >= 80) {
    // Excelente (80%+)
    imageUrl = 'https://msabores.com/wp-content/uploads/2025/07/Design-sem-nome-12.webp';
    message = ' Esse é o seu morango do amor supremo';
    category = 'excellent';
  } else if (percentual >= 60) {
    // Bom (60-79%)
    imageUrl = 'https://static.ndmais.com.br/2025/07/morango-do-amor-em-blumenau-saiba-onde-encontrar-2.jpg';
    message = ' MUITO BOM! Esse é o seu morango do amor';
    category = 'good';
  } else if (percentual >= 40) {
    // Regular (40-59%)
    imageUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8llVVRArpL5cdLDJH2lJp6uJ0y1GaVutkFw&s';
    message = ' Esse é o seu morango do amor mediano';
    category = 'average';
  } else {
    // Precisa melhorar (0-39%)
    imageUrl = './assets/poor_score.jpg';
    message = 'CONTINUE ESTUDANDO! Esse é o seu morango do amor';
    category = 'poor';
  }
  
  // Atualizar elementos
  feedbackImage.src = imageUrl;
  feedbackImage.style.maxWidth = "100%";
  feedbackMessage.textContent = message;
  
  // Remover classes anteriores e adicionar nova
  feedbackContainer.className = 'feedback-container show ' + category;
  
  // Mostrar o feedback
  feedbackContainer.style.display = 'block';
}

function iniciarQuestao() {
  if (index >= questoes.length) return finalizarQuiz(); 

  const q = questoes[index]; 
  questionEl.textContent = q.q;
  progressEl.textContent = `${index + 1}/${questoes.length}`;
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
  const q = questoes[index]; 
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
      buttons[questoes[index].a].classList.add("correct"); 
      
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
  
  //Mostrar feedback visual
  showScoreFeedback(score);
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
    li.textContent = `${r.nome} — ${r.score} pts`;
    leaderboardList.appendChild(li);
  });
}

document.getElementById("save-score").onclick = salvarPlacar;
document.getElementById("restart").onclick = () => location.reload();

// Inicializar o quiz
renderizarPlacar();
iniciarQuestao();