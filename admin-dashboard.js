// Status
const statusInput = document.getElementById("statusInput");
const statusPreview = document.getElementById("statusPreview");

statusInput.addEventListener("input", () => {
  statusPreview.textContent = statusInput.value;
});

function saveStatus(){
  localStorage.setItem("statusText", statusInput.value);
  localStorage.setItem("statusTime", "Updated just now");
  alert("Status saved!");
}

// Countdown
const dateInput = document.getElementById("dateInput");
const datePreview = document.getElementById("datePreview");

dateInput.addEventListener("input", () => {
  datePreview.textContent = dateInput.value;
});

function saveDate(){
  localStorage.setItem("nextDate", dateInput.value);
  alert("Countdown saved!");
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
  localStorage.setItem("loveMessages", JSON.stringify(messages));
  alert("Love messages saved!");
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
  localStorage.setItem("photoGallery", JSON.stringify(urls));
  alert("Photos saved!");
}

// home-guard.js
if(localStorage.getItem("isAdmin") !== "true"){
  // Als iemand niet ingelogd is, stuur naar login
  window.location.href = "admin-login.html"; // of admin-login.html
}

function logout() {
  // verwijder flags
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("isAdmin");

  // terugsturen naar loginpagina
  window.location.href = "admin-login.html"; // of admin-login.html als admin
}