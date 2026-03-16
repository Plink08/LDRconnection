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
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

//=================
// home-guard.js
//=================
if(localStorage.getItem("isLoggedIn") !== "true"){
  window.location.href = "index.html";
}

setTimeout(() => localStorage.removeItem("isLoggedIn"), 60*60*1000);

function logout() {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("isAdmin");
  window.location.href = "index.html";
}

//=================
// Status realtime
//=================
db.ref('status').on('value', snapshot => {
  const data = snapshot.val();
  if(data){
    const statusTextEl = document.getElementById("statusText");
    const statusTimeEl = document.getElementById("statusTime");
    statusTextEl.textContent = data.text;
    statusTimeEl.textContent = `Last updated: ${new Date(data.updatedAt).toLocaleString()}`;
  }
});

//=================
// Countdown realtime
//=================
let nextDate;
db.ref('nextDate').on('value', snapshot => {
  const val = snapshot.val();
  if(val){
    nextDate = new Date(val);
    updateCountdown();
  }
});

//=================
// Love messages realtime
//=================
db.ref('loveMessages').on('value', snapshot => {
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

//=================
// Photo gallery realtime
//=================
db.ref('photos').on('value', snapshot => {
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

//=================
// Live countdown
//=================
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

//=================
// Personalized message by time
//=================
const hour = new Date().getHours();
const loveMsg = document.getElementById("loveMessageTime");
if(hour < 12){
  loveMsg.textContent = "Good morning Renita ☀️ I hope your day will be awesome.";
} else if(hour < 18){
  loveMsg.textContent = "Hi pookie ❤️ I hope you're fine <3";
} else {
  loveMsg.textContent = "Good evening Eepiehead 🌙 I'm thinking about you!";
}

//=================
// Relationship counter
//=================
const startDate = new Date("2025-03-06");
const now = new Date();
const diffRel = now - startDate;
const daysTogether = Math.floor(diffRel / (1000 * 60 * 60 * 24));
document.getElementById("relationshipTime").textContent =
  `We've been dating for ${daysTogether} days ❤️`;

//=================
// Time at her location (long distance)
//=================
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

//=================
// Secret admin login trigger
//=================
const title = document.getElementById("siteTitle");
let clickCount = 0;
title.addEventListener("click", () => {
  clickCount++;
  if(clickCount >= 5){
    window.location.href = "admin-login.html";
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