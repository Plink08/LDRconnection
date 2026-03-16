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

function getInviteCoupleId() {
  const params = new URLSearchParams(window.location.search);
  return params.get("couple");
}

async function resolveCoupleIdForUser(emailKey) {
  const inviteId = getInviteCoupleId();
  if (inviteId) {
    localStorage.setItem("coupleId", inviteId);
    return inviteId;
  }

  const localCoupleId = localStorage.getItem("coupleId");
  if (localCoupleId) {
    return localCoupleId;
  }

  const userCoupleSnap = await db.ref("users/" + emailKey + "/coupleId").once("value");
  const userCoupleId = userCoupleSnap.val();
  if (userCoupleId) {
    localStorage.setItem("coupleId", userCoupleId);
    return userCoupleId;
  }

  const newCoupleRef = db.ref("couples").push();
  const newCoupleId = newCoupleRef.key;

  await newCoupleRef.child("meta").set({
    createdAt: new Date().toISOString(),
    createdBy: emailKey
  });

  localStorage.setItem("coupleId", newCoupleId);
  return newCoupleId;
}

async function loginHome() {
  const email = document.getElementById("emailInput").value;
  const password = document.getElementById("passwordInput").value;
  const errorEl = document.getElementById("loginError");

  try {
    const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
    const user = userCredential.user;
    const emailKey = user.email.replace(/\./g, ",");

    const roleSnapshot = await db.ref("users/" + emailKey + "/role").once("value");
    const role = roleSnapshot.val();

    if (role !== "home" && role !== "admin") {
      await firebase.auth().signOut();
      errorEl.textContent = "You are not authorized to access the home page 💔";
      return;
    }

    const coupleId = await resolveCoupleIdForUser(emailKey);

    await db.ref("users/" + emailKey).update({
      coupleId,
      role,
      lastLoginAt: new Date().toISOString()
    });

    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("role", role);
    localStorage.setItem("coupleId", coupleId);

    window.location.href = "home.html";
  } catch (error) {
    errorEl.textContent = error.message;
  }
}

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/service-worker.js")
    .then(reg => console.log("Service worker registered!", reg))
    .catch(err => console.log("Service worker failed:", err));
}
