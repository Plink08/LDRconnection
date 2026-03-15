const status = {
  text: "Werk focus blok (React project)",
  updatedAt: new Date().toLocaleString("nl-NL"),
};

const events = [
  { title: "Werk", time: "Ma 09:00 - 17:00", location: "Kantoor" },
  { title: "Sportschool", time: "Di 19:00 - 20:30", location: "Basic-Fit" },
  { title: "Date night", time: "Vr 19:30", location: "Centrum" },
  { title: "Familiebezoek", time: "Zo 14:00", location: "Thuis" },
];

const nextDate = new Date();
nextDate.setDate(nextDate.getDate() + 5);
nextDate.setHours(19, 30, 0, 0);

function renderStatus() {
  document.getElementById("statusText").textContent = status.text;
  document.getElementById("statusTime").textContent = `Laatst geüpdatet: ${status.updatedAt}`;
}

function renderSchedule() {
  const list = document.getElementById("scheduleList");
  list.innerHTML = "";

  events.forEach((event) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <div class="event-title">${event.title}</div>
      <div class="event-time">${event.time} · ${event.location}</div>
    `;
    list.appendChild(li);
  });
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

renderStatus();
renderSchedule();
updateCountdown();
setInterval(updateCountdown, 60 * 1000);
