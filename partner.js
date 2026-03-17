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
const auth = firebase.auth();
const db = firebase.database();


// =======================
// GUARD (alleen home role)
// =======================

auth.onAuthStateChanged(user => {

if(!user){
window.location.href = "account.html";
return;
}

db.ref("users/" + user.uid).once("value", snap => {

const role = snap.val()?.role;

if(role !== "home"){
alert("You are not authorized for the admin dashboard!");
window.location.href = "home.html";
}

});

});

//===========
// Status
//==========
const statusInput = document.getElementById("statusInput");
const statusPreview = document.getElementById("statusPreview");

statusInput.addEventListener("input", () => {
  statusPreview.textContent = statusInput.value;
});

function saveStatus(){
  const text = statusInput.value;
  const updatedAt = new Date().toISOString();
  db.ref('status2').set({ text, updatedAt });
  alert("Status saved to Firebase!");
}

//==============
// Love messages
//==============
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
  db.ref('loveMessages2').set(updates);
  alert("Love messages saved to Firebase!");
}

//===============
// Photo gallery
//===============
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
  db.ref('photos2').set(updates);
  alert("Photos saved to Firebase!");
}


// =======================
// LOGOUT
// =======================

function logout(){
auth.signOut().then(() => {
window.location.href = "index.html";
});
}

// ============
// LOADER
// ============

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

function backHome(){
  window.location.href = "home.html"
}