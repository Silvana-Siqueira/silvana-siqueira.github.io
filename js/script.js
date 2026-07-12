/**
 * School Game - Lógica principal do quiz gamificado
 * Gerencia telas, timer, pontuação, validação e ranking (localStorage).
 */

/* ========== CONFIGURAÇÕES ========== */
const CONFIG = {
  timePerQuestion: 20,
  pointsPerCorrect: 100,
  bonusPerSecond: 5,
  maxGrade: 10,
  rankingKey: "schoolgame_silvana_ranking",
  maxRankingEntries: 15,
  teacherName: "Silvana Siqueira da Silva"
};

const LETTERS = ["A", "B", "C", "D"];
const TIMER_CIRCUMFERENCE = 97.39;
const PODIUM_MEDALS = ["gold", "silver", "bronze"];

/* ========== ESTADO DO JOGO ========== */
let state = {
  playerName: "",
  playerRu: "",
  playerTurma: "",
  questions: [],
  answersLog: [],
  currentIndex: 0,
  score: 0,
  correctAnswers: 0,
  answered: false,
  timerInterval: null,
  timeLeft: CONFIG.timePerQuestion
};

function shuffleArray(items) {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** Embaralha alternativas mantendo índice da resposta correta */
function shuffleQuestionOptions(question) {
  const order = shuffleArray([0, 1, 2, 3]);
  return {
    category: question.category,
    question: question.question,
    explanation: question.explanation || "",
    options: order.map((i) => question.options[i]),
    correct: order.indexOf(question.correct)
  };
}

function prepareQuestions(bank) {
  return shuffleArray(bank.map(shuffleQuestionOptions));
}

function getActiveQuestions() {
  if (state.questions.length) return state.questions;
  const bank = typeof getQuestionBank === "function" ? getQuestionBank() : QUESTIONS;
  return prepareQuestions(bank);
}

/* ========== REFERÊNCIAS DOM ========== */
const screens = {
  home: document.getElementById("screen-home"),
  quiz: document.getElementById("screen-quiz"),
  result: document.getElementById("screen-result"),
  review: document.getElementById("screen-review"),
  ranking: document.getElementById("screen-ranking"),
  "teacher-login": document.getElementById("screen-teacher-login"),
  "teacher-panel": document.getElementById("screen-teacher-panel")
};

const formStart = document.getElementById("form-start");
const playerNameInput = document.getElementById("player-name");
const playerRuInput = document.getElementById("player-ru");
const playerTurmaInput = document.getElementById("player-turma");
const formError = document.getElementById("form-error");

const quizPlayerName = document.getElementById("quiz-player-name");
const quizPlayerMeta = document.getElementById("quiz-player-meta");
const timerEl = document.getElementById("timer");
const timerRingFill = document.getElementById("timer-ring-fill");
const timerRing = document.getElementById("timer-ring");
const liveScoreEl = document.getElementById("live-score");
const progressFill = document.getElementById("progress-fill");
const progressText = document.getElementById("progress-text");
const progressBarContainer = document.getElementById("progress-bar-container");
const progressDots = document.getElementById("progress-dots");
const questionCategory = document.getElementById("question-category");
const questionText = document.getElementById("quiz-title");
const optionsList = document.getElementById("options-list");
const feedbackEl = document.getElementById("feedback");
const feedbackText = document.getElementById("feedback-text");
const btnNext = document.getElementById("btn-next");

const resultIconEl = document.getElementById("result-icon");
const resultPlayer = document.getElementById("result-player");
const finalGrade = document.getElementById("final-grade");
const correctCount = document.getElementById("correct-count");
const percentScore = document.getElementById("percent-score");
const totalPoints = document.getElementById("total-points");
const performanceMessage = document.getElementById("performance-message");
const resultRankPosition = document.getElementById("result-rank-position");
const resultCategoryBreakdown = document.getElementById("result-category-breakdown");

const rankingList = document.getElementById("ranking-list");
const rankingEmpty = document.getElementById("ranking-empty");
const rankingPodium = document.getElementById("ranking-podium");
const rankingFilterTurma = document.getElementById("ranking-filter-turma");

const reviewList = document.getElementById("review-list");

const navButtons = document.querySelectorAll(".nav-btn");

/* ========== ÍCONES ESTÁTICOS ========== */

function initStaticIcons() {
  const logoEl = document.querySelector(".logo-icon");
  if (logoEl && !logoEl.querySelector("svg")) {
    logoEl.insertAdjacentHTML("afterbegin", ICONS.logo);
  }

  document.querySelectorAll("[data-icon]").forEach((el) => {
    const name = el.dataset.icon;
    if (ICONS[name]) {
      el.innerHTML = ICONS[name];
      if (!el.classList.contains("icon--xl")) {
        el.classList.add("icon", "icon--sm");
      }
    }
  });
}

function initTimerRing() {
  if (timerRingFill) {
    timerRingFill.style.strokeDasharray = String(TIMER_CIRCUMFERENCE);
    timerRingFill.style.strokeDashoffset = "0";
  }
}

function renderProgressDots() {
  const total = getActiveQuestions().length;
  progressDots.innerHTML = "";

  for (let i = 0; i < total; i++) {
    const dot = document.createElement("span");
    dot.className = "progress-dot";
    if (i < state.currentIndex) dot.classList.add("done");
    if (i === state.currentIndex) dot.classList.add("active");
    progressDots.appendChild(dot);
  }
}

function migrateRankingStorage() {
  const legacyKeys = ["schoolgame_ranking", "schoolgame_silvana_ranking", "schollgame_ranking", "gamegrade_ranking"];
  let merged = getRanking();

  legacyKeys.forEach((key) => {
    if (key === CONFIG.rankingKey) return;
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return;
      const old = JSON.parse(raw);
      if (Array.isArray(old) && old.length) {
        merged = merged.concat(old);
        localStorage.removeItem(key);
      }
    } catch { /* ignora */ }
  });

  if (merged.length) {
    merged.sort((a, b) => b.score - a.score);
    localStorage.setItem(CONFIG.rankingKey, JSON.stringify(merged.slice(0, CONFIG.maxRankingEntries)));
  }
}

function setFeedback(type, message) {
  const iconMap = { correct: "check", wrong: "close", timeout: "timer" };
  const classMap = { correct: "icon--success", wrong: "icon--error", timeout: "icon--warning" };
  const iconName = iconMap[type] || "close";
  const iconClass = classMap[type] || "icon--error";
  const feedbackType = type === "timeout" ? "wrong" : type;
  feedbackEl.className = `feedback ${feedbackType}`;
  feedbackText.innerHTML = `${icon(iconName, `icon--sm ${iconClass}`)}<span>${message}</span>`;
  feedbackEl.hidden = false;
}

function logAnswer(question, selectedIndex) {
  state.answersLog.push({
    category: question.category,
    question: question.question,
    options: [...question.options],
    correct: question.correct,
    selected: selectedIndex,
    explanation: question.explanation
  });
}

/* ========== NAVEGAÇÃO ========== */

function showScreen(screenName) {
  Object.keys(screens).forEach((key) => {
    if (!screens[key]) return;
    const isActive = key === screenName;
    screens[key].classList.toggle("active", isActive);
    screens[key].hidden = !isActive;
  });

  const isFullscreen = screenName === "teacher-panel" || screenName === "teacher-login";
  document.body.classList.toggle("mode-dashboard", screenName === "teacher-panel");
  document.body.classList.toggle("mode-login-page", screenName === "teacher-login");
  document.body.classList.toggle("mode-home-wide", screenName === "home");
  document.documentElement.classList.toggle("app-fullscreen", isFullscreen);

  const teacherScreens = ["teacher-login", "teacher-panel"];

  navButtons.forEach((btn) => {
    const target = btn.dataset.screen;
    let match = false;

    if (target === "teacher") {
      match = teacherScreens.includes(screenName);
    } else {
      match = target === screenName;
    }

    btn.classList.toggle("active", match);
    btn.setAttribute("aria-selected", match ? "true" : "false");
  });

  if (screenName === "ranking") renderRanking();
  if (screenName === "teacher-panel" && typeof renderTeacherPanel === "function") {
    renderTeacherPanel();
  }
}

/* ========== INÍCIO DO QUIZ ========== */

function validateStudentForm() {
  const name = playerNameInput.value.trim();
  const ru = playerRuInput.value.replace(/\D/g, "");
  const turma = playerTurmaInput.value;

  if (name.length < 2) {
    return { message: "Digite seu nome completo (mínimo 2 caracteres).", field: playerNameInput };
  }
  if (!/^\d{5,12}$/.test(ru)) {
    return { message: "Informe um RU válido (5 a 12 números).", field: playerRuInput };
  }
  if (!turma) {
    return { message: "Selecione sua turma.", field: playerTurmaInput };
  }

  playerRuInput.value = ru;
  return { name, ru, turma };
}

formStart.addEventListener("submit", (e) => {
  e.preventDefault();
  const result = validateStudentForm();

  if (result.message) {
    formError.textContent = result.message;
    formError.hidden = false;
    result.field.focus();
    return;
  }

  formError.hidden = true;
  startQuiz(result);
});

function startQuiz(student) {
  const bank = typeof getQuestionBank === "function" ? getQuestionBank() : QUESTIONS;

  state = {
    playerName: student.name,
    playerRu: student.ru,
    playerTurma: student.turma,
    questions: prepareQuestions(bank),
    answersLog: [],
    currentIndex: 0,
    score: 0,
    correctAnswers: 0,
    answered: false,
    timerInterval: null,
    timeLeft: CONFIG.timePerQuestion
  };

  quizPlayerName.textContent = student.name;
  quizPlayerMeta.textContent = `RU ${student.ru} · ${student.turma}`;
  liveScoreEl.textContent = "0";
  showScreen("quiz");
  loadQuestion();
}

/* ========== CARREGAR PERGUNTA ========== */

function loadQuestion() {
  const questions = getActiveQuestions();
  const total = questions.length;
  const q = questions[state.currentIndex];

  state.answered = false;
  state.timeLeft = CONFIG.timePerQuestion;

  const progressPercent = (state.currentIndex / total) * 100;
  progressFill.style.width = `${progressPercent}%`;
  progressBarContainer.setAttribute("aria-valuenow", Math.round(progressPercent));
  progressText.textContent = `Pergunta ${state.currentIndex + 1} de ${total}`;
  renderProgressDots();

  questionCategory.textContent = q.category;
  questionText.textContent = q.question;

  optionsList.innerHTML = "";
  q.options.forEach((opt, index) => {
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "option-btn";
    btn.dataset.index = String(index);
    btn.setAttribute("role", "option");
    btn.setAttribute("aria-keyshortcuts", LETTERS[index]);
    btn.innerHTML = `
      <span class="option-letter">${LETTERS[index]}</span>
      <span class="option-text">${escapeHtml(opt)}</span>
    `;
    btn.addEventListener("click", () => selectAnswer(index));
    li.appendChild(btn);
    optionsList.appendChild(li);
  });

  feedbackEl.hidden = true;
  feedbackText.innerHTML = "";
  btnNext.disabled = true;
  btnNext.textContent = state.currentIndex < total - 1 ? "Próxima pergunta" : "Ver resultado";

  startTimer();
}

/* ========== TIMER ========== */

function startTimer() {
  clearInterval(state.timerInterval);
  updateTimerDisplay();

  state.timerInterval = setInterval(() => {
    state.timeLeft--;
    updateTimerDisplay();

    if (state.timeLeft <= 0) {
      clearInterval(state.timerInterval);
      if (!state.answered) {
        handleTimeout();
      }
    }
  }, 1000);
}

function updateTimerDisplay() {
  timerEl.textContent = state.timeLeft;

  if (timerRingFill) {
    const offset = TIMER_CIRCUMFERENCE * (1 - state.timeLeft / CONFIG.timePerQuestion);
    timerRingFill.style.strokeDashoffset = String(offset);
  }

  const isWarning = state.timeLeft <= 5;
  timerEl.classList.toggle("warning", isWarning);
  timerRing?.classList.toggle("warning", isWarning);
}

function handleTimeout() {
  state.answered = true;
  const q = getActiveQuestions()[state.currentIndex];
  logAnswer(q, -1);
  revealCorrectAnswer(q.correct, -1);

  setFeedback("timeout", "Tempo esgotado! A resposta correta foi destacada.");
  btnNext.disabled = false;
}

/* ========== SELEÇÃO E VALIDAÇÃO ========== */

function selectAnswer(selectedIndex) {
  if (state.answered) return;

  state.answered = true;
  clearInterval(state.timerInterval);

  const q = getActiveQuestions()[state.currentIndex];
  const isCorrect = selectedIndex === q.correct;

  logAnswer(q, selectedIndex);

  if (isCorrect) {
    state.correctAnswers++;
    const bonus = state.timeLeft * CONFIG.bonusPerSecond;
    const points = CONFIG.pointsPerCorrect + bonus;
    state.score += points;

    liveScoreEl.textContent = state.score;

    setFeedback("correct", `Correto! +${points} pontos (${CONFIG.pointsPerCorrect} + ${bonus} de bônus)`);
  } else {
    setFeedback("wrong", "Resposta incorreta. Veja a alternativa correta abaixo.");
  }

  revealCorrectAnswer(q.correct, selectedIndex);
  btnNext.disabled = false;
}

function revealCorrectAnswer(correctIndex, selectedIndex) {
  const buttons = optionsList.querySelectorAll(".option-btn");
  buttons.forEach((btn) => {
    btn.disabled = true;
    const idx = parseInt(btn.dataset.index, 10);
    if (idx === correctIndex) {
      btn.classList.add("correct");
    } else if (idx === selectedIndex && selectedIndex !== correctIndex) {
      btn.classList.add("wrong");
    }
  });
}

document.addEventListener("keydown", (e) => {
  if (!screens.quiz?.classList.contains("active") || state.answered) return;

  const keyMap = { a: 0, b: 1, c: 2, d: 3 };
  const idx = keyMap[e.key.toLowerCase()];
  if (idx === undefined) return;

  e.preventDefault();
  selectAnswer(idx);
});

/* ========== PRÓXIMA PERGUNTA / RESULTADO ========== */

btnNext.addEventListener("click", () => {
  const total = getActiveQuestions().length;

  if (state.currentIndex < total - 1) {
    state.currentIndex++;
    loadQuestion();
  } else {
    finishQuiz();
  }
});

/* ========== FINALIZAÇÃO ========== */

function finishQuiz() {
  clearInterval(state.timerInterval);

  const total = getActiveQuestions().length;
  const percent = Math.round((state.correctAnswers / total) * 100);
  const grade = ((state.correctAnswers / total) * CONFIG.maxGrade).toFixed(1);

  resultPlayer.textContent = `Parabéns, ${state.playerName}! (RU ${state.playerRu} · ${state.playerTurma})`;
  finalGrade.textContent = grade;
  correctCount.textContent = `${state.correctAnswers}/${total}`;
  percentScore.textContent = `${percent}%`;
  totalPoints.textContent = state.score;

  const { message, iconName } = getPerformanceFeedback(percent);
  performanceMessage.textContent = message;
  resultIconEl.innerHTML = icon(iconName, "icon--xl");

  renderCategoryBreakdown();
  renderResultRankPosition();

  if (parseFloat(grade) >= 7) {
    launchConfetti();
  }

  progressFill.style.width = "100%";
  progressBarContainer.setAttribute("aria-valuenow", "100");

  saveToRanking({
    name: state.playerName,
    ru: state.playerRu,
    turma: state.playerTurma,
    score: state.score,
    percent,
    grade: parseFloat(grade)
  });

  showScreen("result");
}

function getPerformanceFeedback(percent) {
  if (percent >= 90) {
    return { iconName: "trophy", message: "Excelente! Você domina o conteúdo. Continue assim!" };
  }
  if (percent >= 70) {
    return { iconName: "star", message: "Muito bom! Você está no caminho certo." };
  }
  if (percent >= 50) {
    return { iconName: "book", message: "Bom trabalho! Revise os temas que errou para melhorar." };
  }
  if (percent >= 30) {
    return { iconName: "zap", message: "Não desista! Estude um pouco mais e tente de novo." };
  }
  return { iconName: "target", message: "Hora de praticar! Cada tentativa é uma oportunidade de aprender." };
}

function buildCategoryStats() {
  const stats = {};

  state.answersLog.forEach((entry) => {
    if (!stats[entry.category]) {
      stats[entry.category] = { correct: 0, total: 0 };
    }
    stats[entry.category].total++;
    if (entry.selected === entry.correct) {
      stats[entry.category].correct++;
    }
  });

  return stats;
}

function renderCategoryBreakdown() {
  if (!resultCategoryBreakdown) return;

  const stats = buildCategoryStats();
  const categories = Object.keys(stats);

  if (categories.length === 0) {
    resultCategoryBreakdown.innerHTML = "";
    return;
  }

  resultCategoryBreakdown.innerHTML = categories.map((cat) => {
    const { correct, total } = stats[cat];
    const pct = Math.round((correct / total) * 100);
    return `
      <div class="category-breakdown-item">
        <span class="category-breakdown-name">${escapeHtml(cat)}</span>
        <span class="category-breakdown-score">${correct}/${total}</span>
        <div class="category-breakdown-bar" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100">
          <div class="category-breakdown-fill" style="width:${pct}%"></div>
        </div>
      </div>
    `;
  }).join("");
}

function renderResultRankPosition() {
  if (!resultRankPosition) return;

  const position = getPlayerRank(state.playerRu);
  if (!position) {
    resultRankPosition.hidden = true;
    return;
  }

  resultRankPosition.hidden = false;
  resultRankPosition.innerHTML = `${icon("trophy", "icon--sm icon--gold")} Você ficou em <strong>${position}º lugar</strong> no ranking!`;
}

function getPlayerRank(ru) {
  const ranking = getDisplayRanking();
  const idx = ranking.findIndex((entry) => entry.ru === ru && !entry.isDemo);
  return idx >= 0 ? idx + 1 : null;
}

function launchConfetti() {
  const container = document.getElementById("confetti-container");
  if (!container) return;

  container.innerHTML = "";
  const colors = ["#f97316", "#38bdf8", "#16a34a", "#e21b3c", "#d89e00", "#1368ce"];

  for (let i = 0; i < 60; i++) {
    const piece = document.createElement("span");
    piece.className = "confetti-piece";
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDelay = `${Math.random() * 0.6}s`;
    piece.style.animationDuration = `${2 + Math.random() * 2}s`;
    container.appendChild(piece);
  }

  setTimeout(() => { container.innerHTML = ""; }, 4500);
}

/* ========== REVISÃO ========== */

function renderReview() {
  if (!reviewList) return;

  reviewList.innerHTML = "";

  state.answersLog.forEach((entry, index) => {
    const li = document.createElement("li");
    const isCorrect = entry.selected === entry.correct;
    const statusClass = entry.selected === -1 ? "timeout" : isCorrect ? "correct" : "wrong";
    const statusLabel = entry.selected === -1 ? "Tempo esgotado" : isCorrect ? "Acertou" : "Errou";

    const selectedText = entry.selected >= 0
      ? `${LETTERS[entry.selected]}) ${escapeHtml(entry.options[entry.selected])}`
      : "—";

    const correctText = `${LETTERS[entry.correct]}) ${escapeHtml(entry.options[entry.correct])}`;
    const explanation = entry.explanation
      ? escapeHtml(entry.explanation)
      : `A alternativa correta é: ${correctText}`;

    li.className = `review-item review-item--${statusClass}`;
    li.innerHTML = `
      <div class="review-item-head">
        <span class="category-tag category-tag--sm">${escapeHtml(entry.category)}</span>
        <span class="review-status review-status--${statusClass}">${statusLabel}</span>
      </div>
      <p class="review-question"><strong>${index + 1}.</strong> ${escapeHtml(entry.question)}</p>
      <p class="review-answer"><span>Sua resposta:</span> ${selectedText}</p>
      <p class="review-answer review-answer--correct"><span>Correta:</span> ${correctText}</p>
      <p class="review-explanation">${explanation}</p>
    `;
    reviewList.appendChild(li);
  });
}

document.getElementById("btn-review")?.addEventListener("click", () => {
  renderReview();
  showScreen("review");
});

document.getElementById("btn-review-back")?.addEventListener("click", () => {
  showScreen("result");
});

document.getElementById("btn-review-home")?.addEventListener("click", () => {
  showScreen("home");
  navButtons.forEach((btn) => {
    const isHome = btn.dataset.screen === "home";
    btn.classList.toggle("active", isHome);
    btn.setAttribute("aria-selected", isHome ? "true" : "false");
  });
});

/* ========== RANKING ========== */

function getRanking() {
  try {
    const data = localStorage.getItem(CONFIG.rankingKey);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function getDisplayRanking(turmaFilter = "") {
  const real = getRanking().map((entry) => ({ ...entry, isDemo: false }));
  const demo = (typeof DEMO_STUDENTS !== "undefined" ? DEMO_STUDENTS : []).map((entry) => ({
    ...entry,
    isDemo: true
  }));

  let list = [...real, ...demo].sort((a, b) => b.score - a.score);

  if (turmaFilter) {
    list = list.filter((entry) => entry.turma === turmaFilter);
  }

  return list;
}

function saveToRanking(entry) {
  const ranking = getRanking();
  ranking.push({
    ...entry,
    date: new Date().toISOString()
  });

  ranking.sort((a, b) => b.score - a.score);
  localStorage.setItem(CONFIG.rankingKey, JSON.stringify(ranking.slice(0, CONFIG.maxRankingEntries)));
}

function renderRankingPodium(topThree) {
  if (!rankingPodium) return;

  if (topThree.length < 2) {
    rankingPodium.hidden = true;
    rankingPodium.innerHTML = "";
    return;
  }

  rankingPodium.hidden = false;

  const order = topThree.length >= 3
    ? [topThree[1], topThree[0], topThree[2]]
    : [topThree[1], topThree[0]];

  rankingPodium.innerHTML = order.map((entry, visualIndex) => {
    const realIndex = topThree.indexOf(entry);
    const medal = PODIUM_MEDALS[realIndex];
    const place = realIndex + 1;
    const heightClass = realIndex === 0 ? "podium-place--1" : realIndex === 1 ? "podium-place--2" : "podium-place--3";

    return `
      <div class="podium-place ${heightClass}">
        <span class="podium-medal">${icon("trophy", `icon--md icon--${medal}`)}</span>
        <span class="podium-rank">${place}º</span>
        <strong class="podium-name">${escapeHtml(entry.name)}</strong>
        <span class="podium-score">${entry.score} pts</span>
        <span class="podium-meta">${escapeHtml(entry.turma || "—")}</span>
      </div>
    `;
  }).join("");
}

function renderRanking() {
  const turmaFilter = rankingFilterTurma?.value || "";
  const ranking = getDisplayRanking(turmaFilter);

  rankingList.innerHTML = "";

  if (ranking.length === 0) {
    rankingEmpty.hidden = false;
    if (rankingPodium) {
      rankingPodium.hidden = true;
      rankingPodium.innerHTML = "";
    }
    return;
  }

  rankingEmpty.hidden = true;

  const topThree = ranking.slice(0, 3);
  const rest = ranking.slice(3);

  renderRankingPodium(topThree);

  const listEntries = ranking.length >= 4 ? rest : ranking.length === 3 ? [] : ranking;

  listEntries.forEach((entry, index) => {
    const position = ranking.length >= 4 ? index + 4 : index + 1;
    const li = document.createElement("li");
    li.className = "ranking-item";

    const dateStr = entry.date
      ? new Date(entry.date).toLocaleDateString("pt-BR")
      : "—";
    const ru = entry.ru ? escapeHtml(String(entry.ru)) : "—";
    const turma = entry.turma ? escapeHtml(entry.turma) : "—";
    const youBadge = entry.ru === state.playerRu && !entry.isDemo
      ? '<span class="ranking-you">Você</span>'
      : "";

    li.innerHTML = `
      <span class="ranking-position-num">${position}º</span>
      <div class="ranking-info">
        <div class="ranking-name">${escapeHtml(entry.name)} ${youBadge}</div>
        <div class="ranking-meta">RU ${ru} · Turma ${turma} · Nota ${entry.grade} · ${entry.percent}% · ${dateStr}</div>
      </div>
      <span class="ranking-score">${entry.score} pts</span>
    `;
    rankingList.appendChild(li);
  });
}

rankingFilterTurma?.addEventListener("change", renderRanking);

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

/* ========== BOTÕES DE AÇÃO ========== */

document.getElementById("btn-restart")?.addEventListener("click", () => {
  playerNameInput.value = state.playerName;
  playerRuInput.value = state.playerRu;
  playerTurmaInput.value = state.playerTurma;
  showScreen("home");
  playerNameInput.focus();
});

document.getElementById("btn-go-ranking")?.addEventListener("click", () => {
  showScreen("ranking");
  navButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.screen === "ranking");
    btn.setAttribute("aria-selected", btn.dataset.screen === "ranking" ? "true" : "false");
  });
});

document.getElementById("btn-back-home")?.addEventListener("click", () => {
  showScreen("home");
  navButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.screen === "home");
    btn.setAttribute("aria-selected", btn.dataset.screen === "home" ? "true" : "false");
  });
});

document.getElementById("btn-clear-ranking")?.addEventListener("click", () => {
  if (confirm("Tem certeza? Isso apagará as respostas salvas neste navegador. Os alunos de demonstração continuarão visíveis.")) {
    localStorage.removeItem(CONFIG.rankingKey);
    renderRanking();
  }
});

navButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const target = btn.dataset.screen;
    clearInterval(state.timerInterval);

    if (target === "home") {
      showScreen("home");
    } else if (target === "ranking") {
      showScreen("ranking");
    } else if (target === "teacher") {
      if (typeof openTeacherArea === "function") openTeacherArea();
    }

    navButtons.forEach((b) => {
      b.classList.toggle("active", b === btn);
      b.setAttribute("aria-selected", b === btn ? "true" : "false");
    });
  });
});

/* Inicialização */
migrateRankingStorage();
initStaticIcons();
initTimerRing();
initTeacherModule();
document.body.classList.add("mode-home-wide");
showScreen("home");
playerNameInput.focus();
