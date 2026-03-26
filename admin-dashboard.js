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
    window.location.href = "account.html";
    return;
  }


  // Check role in database
  db.ref('users/' + user.uid + '/role').once('value').then(snapshot => {
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

// Random fact
const factInput = document.getElementById("randomFact");
const factPreview = document.getElementById("randomFactPreview"); 

randomFactInput.addEventListener("input", () => {
  randomFactPreview.innerHTML = "";
  const lines = randomFactInput.value.split("\n");
  lines.forEach(line => {
    if(line.trim() !== ""){
      const li = document.createElement("li");
      li.textContent = line;
      randomFactPreview.appendChild(li);
    }
  });
});

function saveRandomFact(){
  const facts = randomFactInput.value.split("\n").filter(f => f.trim() !== "");
  const updates = {};
  facts.forEach((fact, index) => {
    updates[`fact${index+1}`] = fact;
  });
  db.ref('randomFacts').set(updates);
  alert("Random facts saved to Firebase!");
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

// Logout
function logout() {
  localStorage.removeItem("isLoggedIn");
  window.location.href = "index.html";
}


if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/service-worker.js")
    .then(reg => console.log("Service worker registered!", reg))
    .catch(err => console.log("Service worker failed:", err));
}

//LOADER

window.addEventListener("load", () => {

const loader = document.getElementById("loader");
const start = Date.now();

function hideLoader(){
  const elapsed = Date.now() - start;
  const minTime = 800; // 1.2 sec zichtbaar

  const remaining = minTime - elapsed;

  setTimeout(() => {
    loader.style.opacity = "0";
    setTimeout(() => loader.style.display = "none", 300);
  }, remaining > 0 ? remaining : 0);
}

hideLoader();

});
