/****************************************
 *  FIREBASE CONFIG
 ****************************************/
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getDatabase,
  ref,
  get,
  set
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

/****************************************
 *  CONFIG (من Firebase Console)
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
 *  INIT
 ****************************************/
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

/* root node */
const DB_REF = ref(db, "SupplySys_DB");

/****************************************
 *  LOAD DB
 ****************************************/
export async function loadDB() {
  try {
    const snap = await get(DB_REF);
    return snap.exists() ? snap.val() : {};
  } catch (e) {
    console.error("LOAD ERROR", e);
    return {};
  }
}

/****************************************
 *  SAVE DB
 ****************************************/
export async function saveDB(data) {
  try {
    await set(DB_REF, data);
    console.log("DB SAVED");
  } catch (e) {
    console.error("SAVE ERROR", e);
  }
}
