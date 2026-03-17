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

function loginHome() {
  const email = document.getElementById("emailInput").value;
  const password = document.getElementById("passwordInput").value;
  const errorEl = document.getElementById("loginError");

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;

      // Check role in database
      db.ref('users/' + user.uid + '/role').once('value').then(snapshot => {
        const role = snapshot.val();

        if(role === 'home' || role === 'admin'){
          // Login succesvol
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("role", role);
          window.location.href = "home.html";
        } else {
          // Geen toestemming
          firebase.auth().signOut();
          errorEl.textContent = "You are not authorized to access the home page 💔";
        }
      });
    })
    .catch((error) => {
      errorEl.textContent = error.message;
    });
}

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/service-worker.js")
    .then(reg => console.log("Service worker registered!", reg))
    .catch(err => console.log("Service worker failed:", err));
}