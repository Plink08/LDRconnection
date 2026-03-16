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

function getCoupleId() {
  const params = new URLSearchParams(window.location.search);
  const inviteId = params.get("couple");
  if (inviteId) {
    localStorage.setItem("coupleId", inviteId);
  }

  return localStorage.getItem("coupleId");
}

let coupleId = getCoupleId();

function couplePath(path) {
  return `couples/${coupleId}/${path}`;
}

async function ensureCoupleId(user) {
  if (coupleId) return coupleId;

  const emailKey = user.email.replace(/\./g, ",");
  const userCoupleSnap = await db.ref("users/" + emailKey + "/coupleId").once("value");
  const userCoupleId = userCoupleSnap.val();

  if (userCoupleId) {
    coupleId = userCoupleId;
    localStorage.setItem("coupleId", userCoupleId);
    return userCoupleId;
  }

  const newCoupleRef = db.ref("couples").push();
  coupleId = newCoupleRef.key;

  await newCoupleRef.child("meta").set({
    createdAt: new Date().toISOString(),
    createdBy: emailKey
  });

  await db.ref("users/" + emailKey).update({
    coupleId,
    lastLoginAt: new Date().toISOString()
  });

  localStorage.setItem("coupleId", coupleId);
  return coupleId;
}

function renderCoupleInfo() {
  const coupleIdEl = document.getElementById("coupleIdValue");
  const inviteEl = document.getElementById("inviteLink");

  if (!coupleIdEl || !inviteEl) return;

  coupleIdEl.textContent = coupleId || "Not set";
  inviteEl.value = coupleId
    ? `${window.location.origin}${window.location.pathname.replace("admin-dashboard.html", "index.html")}?couple=${coupleId}`
    : "";
}

function copyInviteLink() {
  const inviteEl = document.getElementById("inviteLink");
  if (!inviteEl || !inviteEl.value) return;

  navigator.clipboard.writeText(inviteEl.value)
    .then(() => alert("Invite link copied!"))
    .catch(() => alert("Could not copy invite link automatically."));
}

window.copyInviteLink = copyInviteLink;

firebase.auth().onAuthStateChanged(async user => {
  if(!user){
    window.location.href = "admin-login.html";
    return;
  }

  const emailKey = user.email.replace(/\./g, ',');

  const roleSnapshot = await db.ref('users/' + emailKey + '/role').once('value');
  const role = roleSnapshot.val();
  if(role !== 'admin'){
    alert("You are not authorized for the admin dashboard!");
    window.location.href = "home.html";
    return;
  }

  await ensureCoupleId(user);
  renderCoupleInfo();
});

const statusInput = document.getElementById("statusInput");
const statusPreview = document.getElementById("statusPreview");
statusInput.addEventListener("input", () => {
  statusPreview.textContent = statusInput.value;
});

function saveStatus(){
  if (!coupleId) return;

  const text = statusInput.value;
  const updatedAt = new Date().toISOString();
  db.ref(couplePath('status')).set({ text, updatedAt });
  alert("Status saved to this couple home!");
}

const dateInput = document.getElementById("dateInput");
const datePreview = document.getElementById("datePreview");
dateInput.addEventListener("input", () => {
  datePreview.textContent = dateInput.value;
});

function saveDate(){
  if (!coupleId) return;

  const nextDate = dateInput.value;
  db.ref(couplePath('nextDate')).set(nextDate);
  alert("Countdown saved to this couple home!");
}

const loveInput = document.getElementById("loveInput");
const lovePreview = document.getElementById("lovePreview");
loveInput.addEventListener("input", () => {
  lovePreview.innerHTML = "";
  const lines = loveInput.value.split("\n");
  lines.forEach(line => {
    if(line.trim() !== ""){
      const li = document.createElement("li");
      li.textContent = line;
      lovePreview.appendChild(li);
    }
  });
});

function saveLove(){
  if (!coupleId) return;

  const messages = loveInput.value.split("\n").filter(m => m.trim() !== "");
  const updates = {};
  messages.forEach((msg, index) => {
    updates[`msg${index+1}`] = msg;
  });
  db.ref(couplePath('loveMessages')).set(updates);
  alert("Love messages saved to this couple home!");
}

const photoInput = document.getElementById("photoInput");
const photoPreview = document.getElementById("photoPreview");
photoInput.addEventListener("input", () => {
  photoPreview.innerHTML = "";
  const urls = photoInput.value.split(",");
  urls.forEach(url => {
    const img = document.createElement("img");
    img.src = url.trim();
    img.style.width = "100px";
    img.style.margin = "5px";
    img.style.borderRadius = "12px";
    photoPreview.appendChild(img);
  });
});

function savePhotos(){
  if (!coupleId) return;

  const urls = photoInput.value.split(",").map(u => u.trim()).filter(Boolean);
  const updates = {};
  urls.forEach((url, i) => { updates[`photo${i+1}`] = url; });
  db.ref(couplePath('photos')).set(updates);
  alert("Photos saved to this couple home!");
}

window.saveStatus = saveStatus;
window.saveDate = saveDate;
window.saveLove = saveLove;
window.savePhotos = savePhotos;

if(localStorage.getItem("isAdmin") !== "true"){
  window.location.href = "admin-login.html";
}

function logout() {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("isAdmin");
  window.location.href = "admin-login.html";
}

window.logout = logout;

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/service-worker.js")
    .then(reg => console.log("Service worker registered!", reg))
    .catch(err => console.log("Service worker failed:", err));
}
