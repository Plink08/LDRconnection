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


const inputs = document.querySelectorAll(".code-inputs input");
const secretCodeHash = "cG9va2ll"; 

inputs.forEach((input, index) => {
  input.addEventListener("input", () => {
    if(input.value.length === 1 && index < inputs.length - 1){
      inputs[index + 1].focus();
    }
  });
  input.addEventListener("keydown", (e) => {
    if(e.key === "Backspace" && input.value === "" && index > 0){
      inputs[index - 1].focus();
    }
  });
});

// function checkCode(){
//   let code = "";
//   inputs.forEach(input => { code += input.value; });

//   // Versleut de input dezelfde manier als de hash
//   const codeHash = btoa(code); 

//   if(codeHash === secretCodeHash){
//     localStorage.setItem("isAdmin","true"); // login flag
//     window.location.href = "admin-dashboard.html";
//   } else {
//     document.getElementById("error").textContent = "Wrong code 💔";
//   }
//}

function homer(){
    window.location.href = "index.html";
}

// Login functie
function loginAdmin() {
  const email = document.getElementById("emailInput").value;
  const password = document.getElementById("passwordInput").value;

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(() => {
      localStorage.setItem("isAdmin", "true"); // flag voor dashboard guard
      window.location.href = "admin-dashboard.html";
    })
    .catch((error) => {
      document.getElementById("loginError").textContent = error.message;
    });
}

// Logout functie
function logoutAdmin() {
  firebase.auth().signOut().then(() => {
    localStorage.removeItem("isAdmin");
    window.location.href = "admin-login.html";
  });
}