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
// REGISTER
// =======================

function register(){

const email = document.getElementById("email").value;
const password = document.getElementById("password").value;

auth.createUserWithEmailAndPassword(email,password)
.then(() => {

showCoupleOptions();

})
.catch(error => {

document.getElementById("authError").textContent = error.message;

});

}


// =======================
// LOGIN
// =======================

function login(){

const email = document.getElementById("loginEmail").value;
const password = document.getElementById("loginPassword").value;

auth.signInWithEmailAndPassword(email,password)
.then(() => {

showCoupleOptions();

})
.catch(error => {

document.getElementById("authError").textContent = error.message;

});

}


// =======================
// USER STATE
// =======================

auth.onAuthStateChanged(user => {

if(user){

showCoupleOptions();

}

});


// =======================
// SHOW NEXT STEP
// =======================

function showCoupleOptions(){

document.getElementById("authCard").style.display = "none";

document.getElementById("createCoupleCard").classList.remove("hidden");
document.getElementById("joinCoupleCard").classList.remove("hidden");

}


// =======================
// PLACEHOLDERS FOR NEXT STEPS
// =======================

function createCouple(){

    const user = firebase.auth().currentUser;

    if(!user){
    alert("You must be logged in");
    return;
    }

    const coupleRef = db.ref("couples").push();

    const coupleId = coupleRef.key;

    coupleRef.set({
    createdAt: Date.now(),
    members: {
    [user.uid]: true
    }
    });

    localStorage.setItem("coupleId", coupleId);

    const inviteLink = window.location.origin + "/account.html?invite=" + coupleId;

    alert("Couple created! Send this invite link to your partner:\n\n" + inviteLink);

}

document.getElementById("inviteLink").textContent =
"Send this link to your partner: " + inviteLink;

function joinCouple(){

alert("This will join an existing couple in step 3");

}