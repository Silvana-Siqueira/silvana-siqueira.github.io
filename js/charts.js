/**
 * School Game - Gráficos do dashboard (Chart.js)
 * Visualização do desempenho das turmas e alunos.
 */

const CHART_THEME = {
  orange: "#f97316",
  blue: "#1368ce",
  green: "#16a34a",
  red: "#dc2626",
  yellow: "#d89e00",
  purple: "#7c3aed",
  gray: "#94a3b8"
};

const CHART_PALETTE = [
  CHART_THEME.orange,
  CHART_THEME.blue,
  CHART_THEME.green,
  CHART_THEME.yellow,
  CHART_THEME.purple,
  CHART_THEME.red
];

let dashboardCharts = [];

/** Destrói gráficos anteriores para evitar sobreposição ao atualizar */
function destroyDashboardCharts() {
  dashboardCharts.forEach((chart) => chart.destroy());
  dashboardCharts = [];
}

function registerChart(chart) {
  if (chart) dashboardCharts.push(chart);
}

/** Opções padrão dos gráficos */
function baseChartOptions() {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          font: { family: "Nunito", weight: "600", size: 12 },
          color: "#64748b"
        }
      }
    }
  };
}

/** Média de nota por turma */
function buildTurmaAverageData(students) {
  const map = {};
  students.forEach((e) => {
    const turma = e.turma || "Sem turma";
    if (!map[turma]) map[turma] = { sum: 0, count: 0 };
    map[turma].sum += Number(e.grade) || 0;
    map[turma].count += 1;
  });

  const labels = Object.keys(map).sort();
  return {
    labels,
    values: labels.map((t) => Number((map[t].sum / map[t].count).toFixed(1)))
  };
}

/** Faixas de nota para gráfico de rosca */
function buildGradeBandsData(students) {
  const bands = {
    "Insuficiente (0-4,9)": 0,
    "Regular (5-6,9)": 0,
    "Bom (7-8,9)": 0,
    "Excelente (9-10)": 0
  };

  students.forEach((e) => {
    const g = Number(e.grade);
    if (g < 5) bands["Insuficiente (0-4,9)"]++;
    else if (g < 7) bands["Regular (5-6,9)"]++;
    else if (g < 9) bands["Bom (7-8,9)"]++;
    else bands["Excelente (9-10)"]++;
  });

  return {
    labels: Object.keys(bands),
    values: Object.values(bands)
  };
}

/** Situação definida pela professora */
function buildStatusData(students, getStatusFn) {
  const counts = {
    Aprovado: 0,
    Recuperação: 0,
    Revisar: 0,
    "Não avaliado": 0
  };

  students.forEach((e) => {
    if (e.isDemo) {
      counts["Não avaliado"]++;
      return;
    }
    const s = getStatusFn ? getStatusFn(e) : "";
    if (s === "aprovado") counts.Aprovado++;
    else if (s === "recuperacao") counts.Recuperação++;
    else if (s === "revisar") counts.Revisar++;
    else counts["Não avaliado"]++;
  });

  return {
    labels: Object.keys(counts),
    values: Object.values(counts)
  };
}

/** Respostas agrupadas por dia */
function buildResponsesByDay(students) {
  const map = {};
  students.forEach((e) => {
    if (!e.date) return;
    const day = new Date(e.date).toLocaleDateString("pt-BR");
    map[day] = (map[day] || 0) + 1;
  });

  const labels = Object.keys(map).sort((a, b) => {
    const [da, ma, aa] = a.split("/").map(Number);
    const [db, mb, ab] = b.split("/").map(Number);
    return new Date(aa, ma - 1, da) - new Date(ab, mb - 1, db);
  });

  return {
    labels,
    values: labels.map((d) => map[d])
  };
}

/** Top alunos por pontuação */
function buildTopScoresData(students, limit = 8) {
  const sorted = [...students].sort((a, b) => b.score - a.score).slice(0, limit);
  return {
    labels: sorted.map((e) => e.name.split(" ")[0]),
    values: sorted.map((e) => e.score)
  };
}

function renderEmptyChart(canvas, message) {
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = "600 14px Nunito, sans-serif";
  ctx.fillStyle = "#94a3b8";
  ctx.textAlign = "center";
  ctx.fillText(message, canvas.width / 2 || 120, canvas.height / 2 || 80);
}

function createBarChart(canvasId, labels, values, labelY = "Nota média") {
  if (typeof Chart === "undefined") return;
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  if (!labels.length) {
    renderEmptyChart(canvas, "Sem dados para exibir");
    return;
  }

  const chart = new Chart(canvas, {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: labelY,
        data: values,
        backgroundColor: CHART_PALETTE.map((c) => c + "cc"),
        borderColor: CHART_PALETTE,
        borderWidth: 2,
        borderRadius: 8
      }]
    },
    options: {
      ...baseChartOptions(),
      scales: {
        y: {
          beginAtZero: true,
          max: 10,
          grid: { color: "#e2e8f0" },
          ticks: { font: { family: "Nunito" } }
        },
        x: {
          grid: { display: false },
          ticks: { font: { family: "Nunito", weight: "600" } }
        }
      }
    }
  });
  registerChart(chart);
}

function createDoughnutChart(canvasId, labels, values) {
  if (typeof Chart === "undefined") return;
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const total = values.reduce((a, b) => a + b, 0);
  if (!total) {
    renderEmptyChart(canvas, "Sem dados para exibir");
    return;
  }

  const chart = new Chart(canvas, {
    type: "doughnut",
    data: {
      labels,
      datasets: [{
        data: values,
        backgroundColor: CHART_PALETTE,
        borderWidth: 2,
        borderColor: "#fff"
      }]
    },
    options: {
      ...baseChartOptions(),
      cutout: "55%",
      plugins: {
        ...baseChartOptions().plugins,
        legend: { position: "bottom" }
      }
    }
  });
  registerChart(chart);
}

function createLineChart(canvasId, labels, values) {
  if (typeof Chart === "undefined") return;
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  if (!labels.length) {
    renderEmptyChart(canvas, "Sem dados para exibir");
    return;
  }

  const chart = new Chart(canvas, {
    type: "line",
    data: {
      labels,
      datasets: [{
        label: "Respostas",
        data: values,
        borderColor: CHART_THEME.blue,
        backgroundColor: "rgba(19, 104, 206, 0.15)",
        fill: true,
        tension: 0.35,
        pointBackgroundColor: CHART_THEME.orange,
        pointRadius: 5,
        pointHoverRadius: 7
      }]
    },
    options: {
      ...baseChartOptions(),
      scales: {
        y: {
          beginAtZero: true,
          ticks: { stepSize: 1, font: { family: "Nunito" } },
          grid: { color: "#e2e8f0" }
        },
        x: {
          ticks: { font: { family: "Nunito", size: 11 } },
          grid: { display: false }
        }
      }
    }
  });
  registerChart(chart);
}

function createHorizontalBarChart(canvasId, labels, values, labelX = "Pontos") {
  if (typeof Chart === "undefined") return;
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  if (!labels.length) {
    renderEmptyChart(canvas, "Sem dados para exibir");
    return;
  }

  const chart = new Chart(canvas, {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: labelX,
        data: values,
        backgroundColor: CHART_THEME.orange + "cc",
        borderColor: CHART_THEME.orange,
        borderWidth: 2,
        borderRadius: 6
      }]
    },
    options: {
      ...baseChartOptions(),
      indexAxis: "y",
      scales: {
        x: { beginAtZero: true, grid: { color: "#e2e8f0" } },
        y: { grid: { display: false } }
      },
      plugins: { legend: { display: false } }
    }
  });
  registerChart(chart);
}

/**
 * Gráficos da aba Visão geral
 */
function renderOverviewCharts(students) {
  destroyDashboardCharts();

  const turma = buildTurmaAverageData(students);
  const bands = buildGradeBandsData(students);
  const byDay = buildResponsesByDay(students);
  const top = buildTopScoresData(students);

  createBarChart("chart-turma-avg", turma.labels, turma.values, "Média da turma");
  createDoughnutChart("chart-grade-bands", bands.labels, bands.values);
  createLineChart("chart-responses-day", byDay.labels, byDay.values);
  createHorizontalBarChart("chart-top-scores", top.labels, top.values, "Pontuação");
}

/**
 * Gráficos da aba Alunos (respeita filtros da tabela)
 */
function renderStudentsTabCharts(students) {
  destroyDashboardCharts();

  const turma = buildTurmaAverageData(students);
  const status = buildStatusData(
    students,
    typeof getStudentStatus === "function" ? getStudentStatus : null
  );

  createBarChart("chart-students-turma", turma.labels, turma.values, "Média");
  createDoughnutChart("chart-students-status", status.labels, status.values);
}
