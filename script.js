//=============
// Firebase
//=============
const firebaseConfig = {
  apiKey: "AIzaSyAMAYAoLAexGfhaNBcYQMfT0IgVDnJrzbY",
  authDomain: "ldrconnection.firebaseapp.com",
  databaseURL: "https://ldrconnection-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "ldrconnection",
  storageBucket: "ldrconnection.firebasestorage.app",
  messagingSenderId: "760366146881",
  appId: "1:760366146881:web:750ef1af34dc8b2a5c2dc0",
  measurementId: "G-86C5Q8WBJK"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

if(localStorage.getItem("isLoggedIn") !== "true"){
  window.location.href = "index.html";
}

setTimeout(() => localStorage.removeItem("isLoggedIn"), 60*60*1000);

function getCoupleId() {
  const params = new URLSearchParams(window.location.search);
  const inviteId = params.get("couple");
  if (inviteId) {
    localStorage.setItem("coupleId", inviteId);
  }
  return localStorage.getItem("coupleId");
}

const coupleId = getCoupleId();

function couplePath(path) {
  return `couples/${coupleId}/${path}`;
}

function logout() {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("isAdmin");
  window.location.href = "index.html";
}

function showMissingCoupleMessage() {
  const statusTextEl = document.getElementById("statusText");
  const statusTimeEl = document.getElementById("statusTime");
  const countdownTextEl = document.getElementById("countdownText");
  const loveMsgEl = document.getElementById("loveMessage");
  const todEl = document.getElementById("todResult");

  if (statusTextEl) statusTextEl.textContent = "No couple found yet. Login via invite or create one from login.";
  if (statusTimeEl) statusTimeEl.textContent = "";
  if (countdownTextEl) countdownTextEl.textContent = "No countdown available without a coupleId.";
  if (loveMsgEl) loveMsgEl.textContent = "No messages yet.";
  if (todEl) todEl.textContent = "Truth or Dare is unavailable without a coupleId.";
}

let nextDate;

if (!coupleId) {
  showMissingCoupleMessage();
} else {
  db.ref(couplePath("status")).on("value", snapshot => {
    const data = snapshot.val();
    if(data){
      const statusTextEl = document.getElementById("statusText");
      const statusTimeEl = document.getElementById("statusTime");
      statusTextEl.textContent = data.text;
      statusTimeEl.textContent = `Last updated: ${new Date(data.updatedAt).toLocaleString()}`;
    }
  });

  db.ref(couplePath("nextDate")).on("value", snapshot => {
    const val = snapshot.val();
    if(val){
      nextDate = new Date(val);
      updateCountdown();
    }
  });

  db.ref(couplePath("loveMessages")).on("value", snapshot => {
    const messages = snapshot.val();
    if(messages){
      const keys = Object.keys(messages);
      const rand = keys[Math.floor(Math.random() * keys.length)];
      const loveMsgEl = document.getElementById("loveMessage");
      if(loveMsgEl){
        loveMsgEl.textContent = messages[rand];
      }
    }
  });

  db.ref(couplePath("photos")).on("value", snapshot => {
    const photos = snapshot.val();
    const galleryDiv = document.querySelector(".gallery");
    if(galleryDiv){
      galleryDiv.innerHTML = "";
      if(photos){
        Object.values(photos).forEach(url => {
          const img = document.createElement("img");
          img.src = url;
          img.style.width = "120px";
          img.style.borderRadius = "12px";
          img.style.margin = "5px";
          galleryDiv.appendChild(img);
        });
      }
    }
  });

  db.ref(couplePath("game/current")).on("value", snapshot => {
    const data = snapshot.val();

    if(!data) return;

    const el = document.getElementById("todResult");

    if(data.type === "truth"){
      el.textContent = "Truth: " + data.text;
    }

    if(data.type === "dare"){
      el.textContent = "Dare: " + data.text;
    }
  });
}

function updateCountdown() {
  const el = document.getElementById("countdownText");
  if(!nextDate) return;

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

setInterval(updateCountdown, 60*1000);

const hour = new Date().getHours();
const loveMsg = document.getElementById("loveMessageTime");
if(hour < 12){
  loveMsg.textContent = "Good morning Renita ☀️ I hope your day will be awesome.";
} else if(hour < 18){
  loveMsg.textContent = "Hi pookie ❤️ I hope you're fine <3";
} else {
  loveMsg.textContent = "Good evening Eepiehead 🌙 I'm thinking about you!";
}

const startDate = new Date("2025-03-06");
const now = new Date();
const diffRel = now - startDate;
const daysTogether = Math.floor(diffRel / (1000 * 60 * 60 * 24));
document.getElementById("relationshipTime").textContent =
  `We've been dating for ${daysTogether} days ❤️`;

function updateTime(){
  const optionsHer = { timeZone: "Europe/London", hour: "2-digit", minute: "2-digit" };
  const herTimeEl = document.getElementById("herTime");
  if(herTimeEl){
    herTimeEl.textContent = "It is " + new Intl.DateTimeFormat([], optionsHer).format(new Date()) + " for you";
  }
  const optionsMe = { timeZone: "Europe/Amsterdam", hour: "2-digit", minute: "2-digit" };
  const myTimeEl = document.getElementById("myTime");
  if(myTimeEl){
    myTimeEl.textContent = "It is " + new Intl.DateTimeFormat([], optionsMe).format(new Date()) + " for me";
  }
}

updateTime();
setInterval(updateTime, 1000);

const title = document.getElementById("siteTitle");
let clickCount = 0;
title.addEventListener("click", () => {
  clickCount++;
  if(clickCount >= 5){
    if(localStorage.getItem("isAdmin") === "true"){
      window.location.href = "admin-dashboard.html";
    } else {
      window.location.href = "admin-login.html";
    }
  }
});

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/service-worker.js")
    .then(reg => console.log("Service worker registered!", reg))
    .catch(err => console.log("Service worker failed:", err));
}

window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  if(loader){
    loader.style.opacity = "0";
    setTimeout(() => loader.remove(), 400);
  }
});

const truths = [
  "What's your favourite memory with me?",
  "When did you first realize you liked me?",
  "What's something you love about me?",
  "What do you miss most about me right now?",
  "What's a place you want to travel with me?",
  "What's something cute I do that you love?"
];

const dares = [
  "Send me a cute selfie right now 📸",
  "Send a voice message saying you love me",
  "Blow me a kiss on camera",
  "Send a random heart emoji spam ❤️❤️❤️",
  "Tell me one thing you want to do together next time we meet",
  "Say something cheesy about us"
];

function sendTruth(){
  if (!coupleId) return;

  const rand = Math.floor(Math.random()*truths.length);

  db.ref(couplePath("game/current")).set({
    type: "truth",
    text: truths[rand],
    time: Date.now()
  });
}

function sendDare(){
  if (!coupleId) return;

  const rand = Math.floor(Math.random()*dares.length);

  db.ref(couplePath("game/current")).set({
    type: "dare",
    text: dares[rand],
    time: Date.now()
  });
}
