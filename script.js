const STORAGE_KEY = "renitaCalendarSettings";

const status = {
  text: "Werk focus blok (React project)",
  updatedAt: new Date().toLocaleString("nl-NL"),
};

const fallbackBusyBlocks = [
  { start: "2026-03-16T09:00:00+01:00", end: "2026-03-16T12:00:00+01:00" },
  { start: "2026-03-18T14:00:00+01:00", end: "2026-03-18T16:00:00+01:00" },
  { start: "2026-03-20T19:30:00+01:00", end: "2026-03-20T22:00:00+01:00" },
];

const nextDate = new Date();
nextDate.setDate(nextDate.getDate() + 5);
nextDate.setHours(19, 30, 0, 0);

function renderStatus() {
  document.getElementById("statusText").textContent = status.text;
  document.getElementById("statusTime").textContent = `Laatst geüpdatet: ${status.updatedAt}`;
}

function formatDateTime(value) {
  const date = new Date(value);
  return new Intl.DateTimeFormat("nl-NL", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function renderBusyBlocks(blocks, sourceLabel) {
  const list = document.getElementById("scheduleList");
  const meta = document.getElementById("agendaMeta");

  list.innerHTML = "";

  if (!blocks.length) {
    meta.textContent = `${sourceLabel}: geen bezette blokken in de komende 7 dagen.`;
    const li = document.createElement("li");
    li.innerHTML = `<div class="event-title">Alles vrij 🎉</div>`;
    list.appendChild(li);
    return;
  }

  meta.textContent = `${sourceLabel}: ${blocks.length} bezette blok(ken) in de komende 7 dagen.`;

  blocks.forEach((block) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <div class="event-title">Bezet</div>
      <div class="event-time">${formatDateTime(block.start)} → ${formatDateTime(block.end)}</div>
    `;
    list.appendChild(li);
  });
}

function getDateRangeISO(daysAhead = 7) {
  const now = new Date();
  const end = new Date(now);
  end.setDate(now.getDate() + daysAhead);
  return { timeMin: now.toISOString(), timeMax: end.toISOString() };
}

function loadSettings() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    document.getElementById("apiKeyInput").value = parsed.apiKey || "";
    document.getElementById("calendarIdInput").value = parsed.calendarId || "";
  } catch {
    document.getElementById("apiKeyInput").value = "";
    document.getElementById("calendarIdInput").value = "";
  }
}

function saveSettings() {
  const apiKey = document.getElementById("apiKeyInput").value.trim();
  const calendarId = document.getElementById("calendarIdInput").value.trim();
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ apiKey, calendarId }));
}

async function loadGoogleBusyBlocks() {
  const apiKey = document.getElementById("apiKeyInput").value.trim();
  const calendarId = document.getElementById("calendarIdInput").value.trim();

  if (!apiKey || !calendarId) {
    renderBusyBlocks(fallbackBusyBlocks, "Voorbeelddata");
    return;
  }

  const { timeMin, timeMax } = getDateRangeISO();

  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/freeBusy?key=${encodeURIComponent(apiKey)}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        timeMin,
        timeMax,
        items: [{ id: calendarId }],
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Google Calendar API error (${response.status})`);
  }

  const data = await response.json();
  const busyBlocks = data.calendars?.[calendarId]?.busy || [];
  renderBusyBlocks(busyBlocks, "Google Calendar");
}

async function handleLoadAgenda() {
  try {
    await loadGoogleBusyBlocks();
  } catch (error) {
    document.getElementById("agendaMeta").textContent =
      "Kon Google Calendar niet laden. Check je API key, Calendar ID en calendar-sharing settings.";
  }
}

function updateCountdown() {
  const el = document.getElementById("countdownText");
  const diff = nextDate - new Date();

  if (diff <= 0) {
    el.textContent = "Het is date time! ❤️";
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);

  el.textContent = `Nog ${days} dagen, ${hours} uur en ${minutes} min tot jullie date.`;
}

function init() {
  renderStatus();
  loadSettings();
  renderBusyBlocks(fallbackBusyBlocks, "Voorbeelddata");
  updateCountdown();

  document.getElementById("saveSettingsBtn").addEventListener("click", () => {
    saveSettings();
    document.getElementById("agendaMeta").textContent = "Instellingen opgeslagen op dit apparaat.";
  });

  document.getElementById("loadAgendaBtn").addEventListener("click", async () => {
    saveSettings();
    await handleLoadAgenda();
  });

  setInterval(updateCountdown, 60 * 1000);
}

init();
