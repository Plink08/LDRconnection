const status = {
  text: "Werk focus blok (React project)",
  updatedAt: new Date().toLocaleString("nl-NL"),
};

const nextDate = new Date();
nextDate.setDate(nextDate.getDate() + 5);
nextDate.setHours(19, 30, 0, 0);

function renderStatus() {
  document.getElementById("statusText").textContent = status.text;
  document.getElementById("statusTime").textContent = `Laatst geüpdatet: ${status.updatedAt}`;
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
updateCountdown();
setInterval(updateCountdown, 60 * 1000);
