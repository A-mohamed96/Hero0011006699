/****************************************
 * FIREBASE CONFIG
 ****************************************/
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getDatabase,
  ref,
  get,
  set,
  update
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

/****************************************
 * CONFIG
 ****************************************/
const firebaseConfig = {
  apiKey: "AIzaSyANmvWGm-Y3V2qeQlwbQZVTwpvFHG_MSm0",
  authDomain: "supplysys-2025.firebaseapp.com",
  databaseURL: "https://supplysys-2025-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "supplysys-2025",
  storageBucket: "supplysys-2025.appspot.com",
  messagingSenderId: "116513264770",
  appId: "1:116513264770:web:a1923cb82ec147a1be109b"
};

/****************************************
 * INIT
 ****************************************/
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const DB_REF = ref(db, "SupplySys_DB");

/****************************************
 * LOAD DB
 ****************************************/
export async function loadDB() {
  const snap = await get(DB_REF);
  return snap.exists() ? snap.val() : {};
}

/****************************************
 * AUTH
 ****************************************/
export async function login(username, password) {
  const data = await loadDB();

  if (!data.users || !data.users[username]) return null;

  const user = data.users[username];

  if (user.password !== password) return null;

  localStorage.setItem(
    "SupplySys_user",
    JSON.stringify({
      username: user.username,
      role: user.role
    })
  );

  return user;
}

/****************************************
 * SESSION
 ****************************************/
export function getCurrentUser() {
  const u = localStorage.getItem("SupplySys_user");
  return u ? JSON.parse(u) : null;
}

export function logout() {
  localStorage.removeItem("SupplySys_user");
  window.location.href = "index.html";
}
