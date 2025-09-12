// Configuração da API
const API_BASE = '/.netlify/functions/api';

// Variáveis globais
let questions = [];
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

// Funções da API
async function fetchQuestions() {
  try {
    const response = await fetch(`${API_BASE}/questions`);
    if (!response.ok) throw new Error('Erro ao buscar perguntas');
    questions = await response.json();
    console.log('Perguntas carregadas:', questions.length);
  } catch (error) {
    console.error('Erro ao carregar perguntas:', error);
    // Fallback para perguntas locais se a API falhar
    questions = [
      { topic: "Present Simple", difficulty: "fácil", q: "He ____ to school every day.", choices: ["go", "goes", "going", "gone"], a: 1 },
      { topic: "Present Continuous", difficulty: "médio", q: "She ____ (study) right now.", choices: ["studies", "is studying", "study", "was studying"], a: 1 },
      { topic: "JavaScript", difficulty: "fácil", q: "Which keyword declares a constant in JavaScript?", choices: ["var", "let", "const", "define"], a: 2 }
    ];
  }
}

async function saveScore(nome, score) {
  try {
    const response = await fetch(`${API_BASE}/scores`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ nome, score })
    });
    
    if (!response.ok) throw new Error('Erro ao salvar pontuação');
    
    const result = await response.json();
    console.log('Pontuação salva:', result);
    return true;
  } catch (error) {
    console.error('Erro ao salvar pontuação:', error);
    // Fallback para localStorage se a API falhar
    const record = { nome, score, data: Date.now() };
    let placar = JSON.parse(localStorage.getItem("quiz_scores") || "[]");
    placar.push(record);
    placar.sort((a, b) => b.score - a.score);
    placar = placar.slice(0, 10);
    localStorage.setItem("quiz_scores", JSON.stringify(placar));
    return false;
  }
}

async function fetchLeaderboard() {
  try {
    const response = await fetch(`${API_BASE}/scores`);
    if (!response.ok) throw new Error('Erro ao buscar ranking');
    
    const scores = await response.json();
    return scores;
  } catch (error) {
    console.error('Erro ao carregar ranking:', error);
    // Fallback para localStorage
    return JSON.parse(localStorage.getItem("quiz_scores") || "[]");
  }
}

// Funções do quiz
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

async function salvarPlacar() {
  const nome = nameInput.value.trim() || "Anônimo";
  
  // Mostrar loading
  const saveButton = document.getElementById("save-score");
  const originalText = saveButton.textContent;
  saveButton.textContent = "Salvando...";
  saveButton.disabled = true;
  
  const apiSuccess = await saveScore(nome, score);
  
  if (apiSuccess) {
    saveButton.textContent = "Salvo!";
    saveButton.style.backgroundColor = "#4caf50";
  } else {
    saveButton.textContent = "Salvo localmente";
    saveButton.style.backgroundColor = "#ff9800";
  }
  
  await renderizarPlacar();
  
  setTimeout(() => {
    saveButton.textContent = originalText;
    saveButton.disabled = false;
    saveButton.style.backgroundColor = "";
  }, 2000);
}

async function renderizarPlacar() {
  try {
    const placar = await fetchLeaderboard();
    leaderboardList.innerHTML = "";
    
    if (placar.length === 0) {
      leaderboardList.innerHTML = "<li>Nenhuma pontuação ainda</li>";
      return;
    }
    
    placar.forEach((r, i) => {
      const li = document.createElement("li");
      const nome = r.nome || r.name || 'Anônimo';
      li.textContent = `${i + 1}. ${nome} — ${r.score} pts`;
      leaderboardList.appendChild(li);
    });
  } catch (error) {
    console.error('Erro ao renderizar placar:', error);
    leaderboardList.innerHTML = "<li>Erro ao carregar ranking</li>";
  }
}

// Event listeners
document.getElementById("save-score").onclick = salvarPlacar;
document.getElementById("restart").onclick = () => location.reload();

// Inicialização
async function inicializarQuiz() {
  // Mostrar loading
  questionEl.textContent = "Carregando perguntas...";
  
  await fetchQuestions();
  await renderizarPlacar();
  
  // Embaralhar perguntas
  questions = questions.sort(() => Math.random() - 0.5);
  
  iniciarQuestao();
}

// Inicializar quando a página carregar
inicializarQuiz();