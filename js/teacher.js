/**
 * School Game - Módulo da professora
 * Login, edição de perguntas (localStorage) e avaliação de alunos.
 */

const TEACHER_CONFIG = {
  user: "silvana",
  password: "ti2026",
  sessionKey: "schoolgame_teacher_session",
  questionsKey: "schoolgame_custom_questions",
  evaluationsKey: "schoolgame_teacher_evaluations"
};

let teacherEditIndex = -1;

/* ========== BANCO DE PERGUNTAS ========== */

/**
 * Retorna perguntas salvas pela professora ou o padrão de questions.js
 */
function getQuestionBank() {
  try {
    const raw = localStorage.getItem(TEACHER_CONFIG.questionsKey);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch { /* usa padrão */ }
  return [...QUESTIONS];
}

function saveQuestionBank(questions) {
  localStorage.setItem(TEACHER_CONFIG.questionsKey, JSON.stringify(questions));
  updateQuestionsCountUI();
}

function resetQuestionBankToDefault() {
  localStorage.removeItem(TEACHER_CONFIG.questionsKey);
  updateQuestionsCountUI();
  renderQuestionsList();
}

/* ========== AUTENTICAÇÃO ========== */

function isTeacherLoggedIn() {
  return sessionStorage.getItem(TEACHER_CONFIG.sessionKey) === "1";
}

function teacherLogin(username, password) {
  const user = username.trim().toLowerCase();
  const pass = password.trim();
  if (user === TEACHER_CONFIG.user && pass === TEACHER_CONFIG.password) {
    sessionStorage.setItem(TEACHER_CONFIG.sessionKey, "1");
    return true;
  }
  return false;
}

function teacherLogout() {
  sessionStorage.removeItem(TEACHER_CONFIG.sessionKey);
}

function openTeacherArea() {
  if (isTeacherLoggedIn()) {
    showScreen("teacher-panel");
    renderTeacherPanel();
  } else {
    showScreen("teacher-login");
    document.getElementById("teacher-user")?.focus();
  }
}

/* ========== AVALIAÇÕES (SITUAÇÃO DO ALUNO) ========== */

function getEvaluations() {
  try {
    const raw = localStorage.getItem(TEACHER_CONFIG.evaluationsKey);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveEvaluations(data) {
  localStorage.setItem(TEACHER_CONFIG.evaluationsKey, JSON.stringify(data));
}

function studentEntryId(entry) {
  return `${entry.ru}_${entry.date || "nodate"}`;
}

function getStudentStatus(entry) {
  const ev = getEvaluations()[studentEntryId(entry)];
  return ev?.status || "";
}

function setStudentStatus(entry, status) {
  const all = getEvaluations();
  const id = studentEntryId(entry);
  all[id] = { ...all[id], status, updatedAt: new Date().toISOString() };
  saveEvaluations(all);
}

/* ========== UI — PERGUNTAS ========== */

function updateQuestionsCountUI() {
  const el = document.getElementById("questions-count-label");
  if (el) {
    const n = getQuestionBank().length;
    el.textContent = `${n} pergunta${n !== 1 ? "s" : ""} no quiz (ordem aleatória para os alunos)`;
  }
  updateHomeBadgesQuestionCount();
}

function updateHomeBadgesQuestionCount() {
  const n = getQuestionBank().length;
  document.querySelectorAll(".badge-question-count").forEach((el) => {
    el.textContent = `${n} perguntas`;
  });
}

function renderQuestionsList() {
  const list = document.getElementById("questions-list");
  if (!list) return;

  const bank = getQuestionBank();
  list.innerHTML = "";

  bank.forEach((q, index) => {
    const item = document.createElement("article");
    item.className = "question-item";
    item.innerHTML = `
      <div class="question-item-head">
        <span class="category-tag category-tag--sm">${escapeHtmlTeacher(q.category)}</span>
        <span class="question-item-num">#${index + 1}</span>
      </div>
      <p class="question-item-text">${escapeHtmlTeacher(q.question)}</p>
      <p class="question-item-answer">Correta: <strong>${["A", "B", "C", "D"][q.correct]}</strong> — ${escapeHtmlTeacher(q.options[q.correct])}</p>
      <div class="question-item-actions">
        <button type="button" class="btn btn-secondary btn-small" data-edit="${index}">Editar</button>
        <button type="button" class="btn btn-danger btn-small" data-delete="${index}">Excluir</button>
      </div>
    `;
    list.appendChild(item);
  });

  list.querySelectorAll("[data-edit]").forEach((btn) => {
    btn.addEventListener("click", () => openQuestionEditor(parseInt(btn.dataset.edit, 10)));
  });

  list.querySelectorAll("[data-delete]").forEach((btn) => {
    btn.addEventListener("click", () => deleteQuestion(parseInt(btn.dataset.delete, 10)));
  });

  updateQuestionsCountUI();
}

function openQuestionEditor(index = -1) {
  teacherEditIndex = index;
  const editor = document.getElementById("question-editor");
  const title = document.getElementById("editor-title");
  const form = document.getElementById("form-question");

  if (!editor || !form) return;

  editor.hidden = false;
  document.getElementById("question-form-error").hidden = true;

  if (index >= 0) {
    const q = getQuestionBank()[index];
    title.textContent = `Editar pergunta #${index + 1}`;
    document.getElementById("edit-question-index").value = String(index);
    document.getElementById("q-category").value = q.category;
    document.getElementById("q-text").value = q.question;
    document.getElementById("q-explanation").value = q.explanation || "";
    q.options.forEach((opt, i) => {
      document.getElementById(`q-opt-${i}`).value = opt;
    });
    const radio = form.querySelector(`input[name="q-correct"][value="${q.correct}"]`);
    if (radio) radio.checked = true;
  } else {
    title.textContent = "Nova pergunta";
    document.getElementById("edit-question-index").value = "-1";
    form.reset();
    form.querySelector('input[name="q-correct"][value="0"]').checked = true;
  }

  editor.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function closeQuestionEditor() {
  teacherEditIndex = -1;
  const editor = document.getElementById("question-editor");
  if (editor) editor.hidden = true;
}

function deleteQuestion(index) {
  const bank = getQuestionBank();
  if (!confirm(`Excluir a pergunta #${index + 1}?`)) return;
  bank.splice(index, 1);
  if (bank.length === 0) {
    alert("É necessário manter pelo menos 1 pergunta. Restaurando padrão.");
    resetQuestionBankToDefault();
    return;
  }
  saveQuestionBank(bank);
  renderQuestionsList();
  closeQuestionEditor();
}

function saveQuestionFromForm(e) {
  e.preventDefault();
  const errEl = document.getElementById("question-form-error");

  const category = document.getElementById("q-category").value.trim();
  const question = document.getElementById("q-text").value.trim();
  const options = [0, 1, 2, 3].map((i) => document.getElementById(`q-opt-${i}`).value.trim());
  const correctRadio = document.querySelector('input[name="q-correct"]:checked');

  if (!category || !question || options.some((o) => !o) || !correctRadio) {
    errEl.textContent = "Preencha todos os campos e marque a alternativa correta.";
    errEl.hidden = false;
    return;
  }

  const explanation = document.getElementById("q-explanation").value.trim();

  const newQ = {
    category,
    question,
    options,
    correct: parseInt(correctRadio.value, 10),
    ...(explanation ? { explanation } : {})
  };

  const bank = getQuestionBank();
  const idx = parseInt(document.getElementById("edit-question-index").value, 10);

  if (idx >= 0) {
    bank[idx] = newQ;
  } else {
    bank.push(newQ);
  }

  saveQuestionBank(bank);
  renderQuestionsList();
  closeQuestionEditor();
  errEl.hidden = true;
  if (document.getElementById("teacher-tab-overview")?.classList.contains("active")) {
    renderDashboardOverview();
  }
}

/* ========== UI — AVALIAR ALUNOS ========== */

function getStudentsForTeacher(showDemo) {
  const real = typeof getRanking === "function"
    ? getRanking().map((e) => ({ ...e, isDemo: false }))
    : [];

  let list = [...real];

  if (showDemo && typeof DEMO_STUDENTS !== "undefined") {
    list = list.concat(DEMO_STUDENTS.map((e) => ({ ...e, isDemo: true })));
  }

  return list.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
}

function gradeStatusClass(grade) {
  if (grade >= 7) return "status--ok";
  if (grade >= 5) return "status--warn";
  return "status--bad";
}

function renderStudentsSummary(list) {
  const el = document.getElementById("students-summary");
  if (!el) return;

  if (list.length === 0) {
    el.innerHTML = `<p class="panel-meta">Nenhuma resposta registrada ainda neste navegador.</p>`;
    return;
  }

  const avg = list.reduce((s, e) => s + e.grade, 0) / list.length;
  const approved = list.filter((e) => e.grade >= 7).length;

  el.innerHTML = `
    <div class="summary-card"><span class="summary-num">${list.length}</span><span class="summary-label">respostas</span></div>
    <div class="summary-card"><span class="summary-num">${avg.toFixed(1)}</span><span class="summary-label">média de notas</span></div>
    <div class="summary-card"><span class="summary-num">${approved}</span><span class="summary-label">nota ≥ 7,0</span></div>
  `;
}

function renderStudentsTable() {
  const tbody = document.getElementById("students-table-body");
  const empty = document.getElementById("students-empty");
  const turmaFilter = document.getElementById("filter-turma")?.value || "";
  const showDemo = document.getElementById("filter-show-demo")?.checked || false;

  if (!tbody) return;

  let list = getStudentsForTeacher(showDemo);
  if (turmaFilter) {
    list = list.filter((e) => e.turma === turmaFilter);
  }

  renderStudentsSummary(list);
  tbody.innerHTML = "";

  if (list.length === 0) {
    empty.hidden = false;
    if (typeof renderStudentsTabCharts === "function") {
      setTimeout(() => renderStudentsTabCharts([]), 50);
    }
    return;
  }
  empty.hidden = true;

  list.forEach((entry) => {
    const tr = document.createElement("tr");
    const dateStr = entry.date
      ? new Date(entry.date).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })
      : "—";
    const status = getStudentStatus(entry);
    const gradeClass = gradeStatusClass(entry.grade);
    const demoTag = entry.isDemo ? '<span class="tag-demo">demo</span>' : "";

    tr.innerHTML = `
      <td data-label="Aluno"><strong>${escapeHtmlTeacher(entry.name)}</strong> ${demoTag}</td>
      <td data-label="RU">${escapeHtmlTeacher(String(entry.ru || "—"))}</td>
      <td data-label="Turma">${escapeHtmlTeacher(entry.turma || "—")}</td>
      <td data-label="Nota"><span class="grade-pill ${gradeClass}">${entry.grade}</span></td>
      <td data-label="%">${entry.percent}%</td>
      <td data-label="Pontos">${entry.score}</td>
      <td data-label="Data">${dateStr}</td>
      <td data-label="Situação">
        <select class="input input-select input-select--sm status-select" data-entry-id="${escapeHtmlTeacher(studentEntryId(entry))}" ${entry.isDemo ? "disabled title='Aluno de demonstração'" : ""}>
          <option value="" ${status === "" ? "selected" : ""}>—</option>
          <option value="aprovado" ${status === "aprovado" ? "selected" : ""}>Aprovado</option>
          <option value="recuperacao" ${status === "recuperacao" ? "selected" : ""}>Recuperação</option>
          <option value="revisar" ${status === "revisar" ? "selected" : ""}>Revisar</option>
        </select>
      </td>
      <td data-label="Ações">
        ${entry.isDemo
          ? '<span class="panel-meta">—</span>'
          : `<button type="button" class="btn btn-danger btn-small" data-remove-id="${escapeHtmlTeacher(studentEntryId(entry))}">Remover</button>`
        }
      </td>
    `;
    tbody.appendChild(tr);
  });

  tbody.querySelectorAll(".status-select").forEach((sel) => {
    sel.addEventListener("change", () => {
      const entry = list.find((e) => studentEntryId(e) === sel.dataset.entryId);
      if (entry) {
        setStudentStatus(entry, sel.value);
        if (typeof renderStudentsTabCharts === "function") {
          renderStudentsTabCharts(list);
        }
      }
    });
  });

  tbody.querySelectorAll("[data-remove-id]").forEach((btn) => {
    btn.addEventListener("click", () => {
      removeStudentAttempt(btn.dataset.removeId);
    });
  });

  if (typeof renderStudentsTabCharts === "function") {
    setTimeout(() => renderStudentsTabCharts(list), 50);
  }
}

function removeStudentAttempt(entryId) {
  if (!confirm("Remover esta tentativa do registro?")) return;
  let ranking = typeof getRanking === "function" ? getRanking() : [];
  ranking = ranking.filter((e) => studentEntryId(e) !== entryId);
  localStorage.setItem(
    typeof CONFIG !== "undefined" ? CONFIG.rankingKey : "schoolgame_silvana_ranking",
    JSON.stringify(ranking)
  );
  renderStudentsTable();
  if (document.getElementById("teacher-tab-overview")?.classList.contains("active")) {
    renderDashboardOverview();
  }
}

/* ========== DASHBOARD — ABAS ========== */

const DASHBOARD_TITLES = {
  overview: "Visão geral",
  questions: "Perguntas",
  students: "Alunos"
};

function updateDashboardTopbar(tabName) {
  const titleEl = document.getElementById("dashboard-page-title");
  const dateEl = document.getElementById("dashboard-date");
  if (titleEl) titleEl.textContent = DASHBOARD_TITLES[tabName] || "Dashboard";
  if (dateEl) {
    dateEl.textContent = new Date().toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  }
}

function switchTeacherTab(tabName) {
  document.querySelectorAll(".sidebar-link").forEach((btn) => {
    const active = btn.dataset.teacherTab === tabName;
    btn.classList.toggle("active", active);
    btn.setAttribute("aria-selected", active ? "true" : "false");
  });

  document.querySelectorAll(".dashboard-panel").forEach((panel) => {
    const id = panel.id.replace("teacher-tab-", "");
    const show = id === tabName;
    panel.classList.toggle("active", show);
    panel.hidden = !show;
  });

  updateDashboardTopbar(tabName);

  if (tabName === "overview") renderDashboardOverview();
  if (tabName === "students") renderStudentsTable();
  if (tabName === "questions") {
    destroyDashboardCharts();
    renderQuestionsList();
  }
}

function renderDashboardOverview() {
  const kpiEl = document.getElementById("dashboard-kpis");
  const recentEl = document.getElementById("dashboard-recent");
  if (!kpiEl) return;

  const bank = getQuestionBank();
  const real = getStudentsForTeacher(false);
  const all = getStudentsForTeacher(true);
  const avg = real.length
    ? (real.reduce((s, e) => s + e.grade, 0) / real.length).toFixed(1)
    : "—";
  const approved = real.filter((e) => e.grade >= 7).length;
  const pending = real.filter((e) => !getStudentStatus(e)).length;

  kpiEl.innerHTML = `
    <article class="kpi-card kpi-card--accent">
      <span class="kpi-icon" aria-hidden="true">${ICONS.list}</span>
      <div>
        <span class="kpi-value">${bank.length}</span>
        <span class="kpi-label">Perguntas ativas</span>
      </div>
    </article>
    <article class="kpi-card kpi-card--blue">
      <span class="kpi-icon" aria-hidden="true">${ICONS.user}</span>
      <div>
        <span class="kpi-value">${real.length}</span>
        <span class="kpi-label">Respostas reais</span>
      </div>
    </article>
    <article class="kpi-card kpi-card--green">
      <span class="kpi-icon" aria-hidden="true">${ICONS.chart}</span>
      <div>
        <span class="kpi-value">${avg}</span>
        <span class="kpi-label">Média de notas</span>
      </div>
    </article>
    <article class="kpi-card kpi-card--warn">
      <span class="kpi-icon" aria-hidden="true">${ICONS.trophy}</span>
      <div>
        <span class="kpi-value">${approved}</span>
        <span class="kpi-label">Aprovados (≥ 7)</span>
      </div>
    </article>
    <article class="kpi-card">
      <span class="kpi-icon" aria-hidden="true">${ICONS.timer}</span>
      <div>
        <span class="kpi-value">${pending}</span>
        <span class="kpi-label">Sem situação</span>
      </div>
    </article>
    <article class="kpi-card">
      <span class="kpi-icon" aria-hidden="true">${ICONS.star}</span>
      <div>
        <span class="kpi-value">${all.length}</span>
        <span class="kpi-label">Total registros</span>
      </div>
    </article>
  `;

  if (recentEl) {
    const recent = all.slice(0, 6);
    if (recent.length === 0) {
      recentEl.innerHTML = `<li class="recent-empty">Nenhuma resposta registrada ainda.</li>`;
    } else {
      recentEl.innerHTML = recent.map((e) => `
        <li class="recent-item">
          <div>
            <strong>${escapeHtmlTeacher(e.name)}</strong>
            <span>${escapeHtmlTeacher(e.turma || "—")} · RU ${escapeHtmlTeacher(String(e.ru || "—"))}</span>
          </div>
          <span class="recent-grade grade-pill ${gradeStatusClass(e.grade)}">${e.grade}</span>
        </li>
      `).join("");
    }
  }

  updateQuestionsCountUI();

  // Gráficos com dados reais + demonstração (visão completa)
  if (typeof renderOverviewCharts === "function") {
    setTimeout(() => {
      renderOverviewCharts(getStudentsForTeacher(true));
    }, 50);
  }
}

function renderTeacherPanel() {
  updateDashboardTopbar("overview");
  renderDashboardOverview();
  renderQuestionsList();
  closeQuestionEditor();
  switchTeacherTab("overview");
}

function escapeHtmlTeacher(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

/* ========== INICIALIZAÇÃO ========== */

function initTeacherModule() {
  document.getElementById("form-teacher-login")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const err = document.getElementById("teacher-login-error");
    const user = document.getElementById("teacher-user").value;
    const pass = document.getElementById("teacher-password").value;

    if (teacherLogin(user, pass)) {
      err.hidden = true;
      showScreen("teacher-panel");
      renderTeacherPanel();
    } else {
      err.textContent = "Usuário ou senha incorretos.";
      err.hidden = false;
    }
  });

  document.getElementById("btn-teacher-login-back")?.addEventListener("click", () => showScreen("home"));
  document.getElementById("btn-teacher-logout")?.addEventListener("click", () => {
    teacherLogout();
    if (typeof destroyDashboardCharts === "function") destroyDashboardCharts();
    showScreen("home");
  });

  document.querySelectorAll(".sidebar-link").forEach((btn) => {
    btn.addEventListener("click", () => switchTeacherTab(btn.dataset.teacherTab));
  });

  document.querySelectorAll("[data-goto-tab]").forEach((btn) => {
    btn.addEventListener("click", () => switchTeacherTab(btn.dataset.gotoTab));
  });

  document.getElementById("btn-dash-add-question")?.addEventListener("click", () => {
    switchTeacherTab("questions");
    openQuestionEditor(-1);
  });

  document.getElementById("btn-add-question")?.addEventListener("click", () => openQuestionEditor(-1));
  document.getElementById("btn-cancel-question")?.addEventListener("click", closeQuestionEditor);
  document.getElementById("form-question")?.addEventListener("submit", saveQuestionFromForm);

  document.getElementById("btn-reset-questions")?.addEventListener("click", () => {
    if (confirm("Restaurar todas as perguntas originais de TI? As edições serão perdidas.")) {
      resetQuestionBankToDefault();
      closeQuestionEditor();
    }
  });

  document.getElementById("filter-turma")?.addEventListener("change", renderStudentsTable);
  document.getElementById("filter-show-demo")?.addEventListener("change", renderStudentsTable);

  updateHomeBadgesQuestionCount();
}
