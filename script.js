// ========================
// Load saved data from localStorage
// ========================

// Currently status
const savedStatus = localStorage.getItem("statusText");
const savedTime = localStorage.getItem("statusTime");
if (savedStatus) document.getElementById("statusText").textContent = savedStatus;
if (savedTime) document.getElementById("statusTime").textContent = savedTime;

// Countdown date
let savedDate = localStorage.getItem("nextDate");
let nextDate;
if (savedDate) {
  nextDate = new Date(savedDate);
} else {
  nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + 5);
  nextDate.setHours(19, 30, 0, 0);
}

// Love messages
const savedMessages = JSON.parse(localStorage.getItem("loveMessages") || "[]");
const loveText = document.getElementById("loveText");
if (loveText && savedMessages.length) {
  const rand = Math.floor(Math.random() * savedMessages.length);
  loveText.textContent = savedMessages[rand];
}

// Photo gallery
const savedPhotos = JSON.parse(localStorage.getItem("photoGallery") || "[]");
const galleryDiv = document.querySelector(".gallery");
if (galleryDiv && savedPhotos.length) {
  galleryDiv.innerHTML = "";
  savedPhotos.forEach(url => {
    const img = document.createElement("img");
    img.src = url;
    img.style.width = "120px";
    img.style.borderRadius = "12px";
    img.style.margin = "5px";
    galleryDiv.appendChild(img);
  });
}

// ========================
// Live countdown
// ========================
function updateCountdown() {
  const el = document.getElementById("countdownText");
  const now = new Date();
  const diff = nextDate - now;

  if (diff <= 0) {
    el.textContent = "It's date time! ❤️";
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);

  el.textContent = `Still ${days} days, ${hours} hours, ${minutes} min until we have another datieeeeee`;
}

updateCountdown();
setInterval(updateCountdown, 60 * 1000);

// ========================
// Personalized message by time
// ========================
const loveMsg = document.getElementById("loveMessage");
const hour = new Date().getHours();
if (hour < 12) {
  loveMsg.textContent = "Good morning Renita ☀️ I hope your day will be awesome.";
} else if (hour < 18) {
  loveMsg.textContent = "Hi pookie ❤️ I hope you're fine <3";
} else {
  loveMsg.textContent = "Good evening Eepiehead 🌙 I'm thinking about you!";
}

// ========================
// Relationship time counter
// ========================
const startDate = new Date("2025-03-06");
const now = new Date();
const diffRel = now - startDate;
const daysTogether = Math.floor(diffRel / (1000 * 60 * 60 * 24));
document.getElementById("relationshipTime").textContent =
  `We've been dating for ${daysTogether} days ❤️`;

// ========================
// Time at her location (long distance)
// ========================
function updateTime(){
  const options = { timeZone: "Europe/London", hour: "2-digit", minute: "2-digit" };
  const herTimeEl = document.getElementById("herTime");
  if(herTimeEl){
    herTimeEl.textContent = "It is " + new Intl.DateTimeFormat([], options).format(new Date()) + " for you";
  }
  const options2 = { timeZone: "Europe/London", hour: "2-digit", minute: "2-digit" };
  const myTimeEl = document.getElementById("myTime");
  if(myTimeEl){
    myTimeEl.textContent = "It is " + new Intl.DateTimeFormat([], options2).format(new Date()) + " for me"
  }
}

updateTime();
setInterval(updateTime, 1000);

//=================
// home-guard.js
//=================
if(localStorage.getItem("isLoggedIn") !== "true"){
  // Als iemand niet ingelogd is, stuur naar login
  window.location.href = "index.html"; // of admin-login.html
}

setTimeout(() => localStorage.removeItem("isLoggedIn"), 60*60*1000);

function logout() {
  // verwijder flags
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("isAdmin");

  // terugsturen naar loginpagina
  window.location.href = "index.html"; // of admin-login.html als admin
}


//============
// admin login
//============
const title = document.getElementById("siteTitle");
let clickCount = 0;

title.addEventListener("click", () => {
  clickCount++;
  if(clickCount >= 5){ // 5 keer klikken
    window.location.href = "admin-login.html";
  }
});