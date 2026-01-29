const state = {
  messages: [],
  stats: { users: 0, messages: 0, last_message_at: null },
  limit: 25,
  search: ""
};

const elements = {
  refreshBtn: document.getElementById("refreshBtn"),
  statusBadge: document.getElementById("statusBadge"),
  statUsers: document.getElementById("statUsers"),
  statMessages: document.getElementById("statMessages"),
  statLast: document.getElementById("statLast"),
  searchInput: document.getElementById("searchInput"),
  limitSelect: document.getElementById("limitSelect"),
  messagesBody: document.getElementById("messagesBody"),
  alertArea: document.getElementById("alertArea")
};

function setStatus(text, tone = "idle") {
  elements.statusBadge.textContent = text;
  if (tone === "warn") {
    elements.statusBadge.style.borderColor = "rgba(252, 191, 73, 0.8)";
  } else if (tone === "error") {
    elements.statusBadge.style.borderColor = "rgba(248, 113, 113, 0.8)";
  } else {
    elements.statusBadge.style.borderColor = "rgba(229, 231, 235, 0.2)";
  }
}

function setAlert(message) {
  const alert = document.createElement("div");
  alert.className = "alert";
  alert.textContent = message;
  elements.alertArea.appendChild(alert);
  setTimeout(() => {
    alert.remove();
  }, 6000);
}

function clearAlerts() {
  elements.alertArea.innerHTML = "";
}

function formatDate(value) {
  if (!value) {
    return "--";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "--";
  }
  return new Intl.DateTimeFormat("es-ES", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(date);
}

function renderStats(stats) {
  elements.statUsers.textContent = stats.users;
  elements.statMessages.textContent = stats.messages;
  elements.statLast.textContent = formatDate(stats.last_message_at);
}

function renderMessages(messages) {
  elements.messagesBody.innerHTML = "";
  if (!messages.length) {
    const empty = document.createElement("div");
    empty.className = "table-row empty";
    empty.textContent = "Sin datos disponibles";
    elements.messagesBody.appendChild(empty);
    return;
  }

  messages.forEach((message) => {
    const row = document.createElement("div");
    row.className = "table-row item";

    const time = document.createElement("span");
    time.textContent = formatDate(message.created_at);

    const user = document.createElement("span");
    const userLabel = [message.first_name, message.username].filter(Boolean).join(" ");
    user.textContent = userLabel || "Anonimo";

    const chat = document.createElement("span");
    chat.textContent = message.chat_id || "--";

    const text = document.createElement("span");
    text.textContent = message.text || "";

    row.append(time, user, chat, text);
    elements.messagesBody.appendChild(row);
  });
}

function applyFilters() {
  const term = state.search.trim().toLowerCase();
  if (!term) {
    return state.messages;
  }
  return state.messages.filter((message) => {
    const haystack = [
      message.text,
      message.username,
      message.first_name,
      message.last_name,
      message.chat_id
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return haystack.includes(term);
  });
}

async function fetchJson(path) {
  const response = await fetch(path, {
    headers: { "Accept": "application/json" }
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Solicitud fallida");
  }
  return response.json();
}

async function loadStats() {
  const stats = await fetchJson("/api/stats");
  state.stats = stats;
  renderStats(stats);
}

async function loadMessages() {
  const params = new URLSearchParams({ limit: state.limit });
  const messages = await fetchJson(`/api/messages?${params.toString()}`);
  state.messages = messages;
  renderMessages(applyFilters());
}

async function refreshAll() {
  clearAlerts();
  setStatus("Actualizando", "warn");
  try {
    await Promise.all([loadStats(), loadMessages()]);
    setStatus("Actualizado", "ok");
  } catch (error) {
    setStatus("Error de conexion", "error");
    setAlert("No fue posible consultar la API. Revisa el servidor.");
  }
}

function bindEvents() {
  elements.refreshBtn.addEventListener("click", () => {
    refreshAll();
  });

  elements.searchInput.addEventListener("input", (event) => {
    state.search = event.target.value;
    renderMessages(applyFilters());
  });

  elements.limitSelect.addEventListener("change", (event) => {
    state.limit = Number(event.target.value) || 25;
    loadMessages();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  bindEvents();
  refreshAll();
  setInterval(() => {
    loadStats();
  }, 60000);
});
