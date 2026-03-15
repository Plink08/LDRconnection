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

// Admin dashboard guard
firebase.auth().onAuthStateChanged(user => {
  if(!user){
    // Niet ingelogd → terug naar login
    window.location.href = "admin-login.html";
    return;
  }

  // Email key aanpassen voor database (punt vervangen door komma)
  const emailKey = user.email.replace(/\./g, ',');

  // Check role in database
  db.ref('users/' + emailKey + '/role').once('value').then(snapshot => {
    const role = snapshot.val();
    if(role !== 'admin'){
      // Geen admin → terug naar home
      alert("You are not authorized for the admin dashboard!");
      window.location.href = "home.html";
    }
  });
});

// Status
const statusInput = document.getElementById("statusInput");
const statusPreview = document.getElementById("statusPreview");

statusInput.addEventListener("input", () => {
  statusPreview.textContent = statusInput.value;
});

function saveStatus(){
  const text = statusInput.value;
  const updatedAt = new Date().toISOString();
  db.ref('status').set({ text, updatedAt });
  alert("Status saved to Firebase!");
}

// Countdown
const dateInput = document.getElementById("dateInput");
const datePreview = document.getElementById("datePreview");

dateInput.addEventListener("input", () => {
  datePreview.textContent = dateInput.value;
});

function saveDate(){
  const nextDate = dateInput.value;
  db.ref('nextDate').set(nextDate);
  alert("Countdown saved to Firebase!");
}

// Love messages
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
  const messages = loveInput.value.split("\n").filter(m => m.trim() !== "");
  const updates = {};
  messages.forEach((msg, index) => {
    updates[`msg${index+1}`] = msg;
  });
  db.ref('loveMessages').set(updates);
  alert("Love messages saved to Firebase!");
}

// Photo gallery
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
  const urls = photoInput.value.split(",").map(u => u.trim());
  const updates = {};
  urls.forEach((url, i) => { updates[`photo${i+1}`] = url; });
  db.ref('photos').set(updates);
  alert("Photos saved to Firebase!");
}

// home-guard
if(localStorage.getItem("isAdmin") !== "true"){
  window.location.href = "admin-login.html";
}

// Logout
function logout() {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("isAdmin");
  window.location.href = "admin-login.html";
}

firebase.auth().onAuthStateChanged(user => {
  if(!user){
    // niet ingelogd → terug naar login
    window.location.href = "admin-login.html";
  }
});