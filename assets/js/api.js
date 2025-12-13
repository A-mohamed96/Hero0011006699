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
 * CONFIG (Firebase Console)
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

/****************************************
 * ROOT NODE
 ****************************************/
const DB_REF = ref(db, "SupplySys_DB");

/****************************************
 * LOAD FULL DB
 ****************************************/
export async function loadDB() {
  try {
    const snap = await get(DB_REF);
    const data = snap.exists() ? snap.val() : {};

    /* ضمان الهيكل الأساسي */
    return {
      farms: data.farms || {},
      trucks: data.trucks || {},
      receivings: data.receivings || {},
      shipments: data.shipments || {},
      users: data.users || {},
      settings: data.settings || {}
    };
  } catch (e) {
    console.error("LOAD ERROR", e);
    return {
      farms: {},
      trucks: {},
      receivings: {},
      shipments: {},
      users: {},
      settings: {}
    };
  }
}

/****************************************
 * SAVE FULL DB (استبدال كامل)
 ****************************************/
export async function saveDB(data) {
  try {
    await set(DB_REF, data);
    console.log("DB SAVED");
  } catch (e) {
    console.error("SAVE ERROR", e);
  }
}

/****************************************
 * UPDATE PARTIAL DB (آمن للتوسعة)
 ****************************************/
export async function updateDB(partialData) {
  try {
    await update(DB_REF, partialData);
    console.log("DB UPDATED");
  } catch (e) {
    console.error("UPDATE ERROR", e);
  }
}

/****************************************
 * USERS / AUTH HELPERS
 ****************************************/

/* تسجيل دخول بسيط (Local Auth) */
export async function login(username, password) {
  const data = await loadDB();
  const users = data.users || {};

  const user = Object.values(users).find(
    u => u.username === username && u.password === password
  );

  if (!user) return null;

  localStorage.setItem("SupplySys_user", JSON.stringify(user));
  return user;
}

/* جلب المستخدم الحالي */
export function getCurrentUser() {
  const u = localStorage.getItem("SupplySys_user");
  return u ? JSON.parse(u) : null;
}

/* تسجيل خروج */
export function logout() {
  localStorage.removeItem("SupplySys_user");
  window.location.href = "index.html";
}

/****************************************
 * PERMISSIONS
 ****************************************/
export function requireAdmin() {
  const user = getCurrentUser();
  if (!user || user.role !== "admin") {
    alert("غير مصرح بالدخول");
    window.location.href = "dashboard.html";
  }
}

/****************************************
 * TRUCK STATUS HELPERS
 ****************************************/
export async function lockTruck(truckCode) {
  const data = await loadDB();
  if (data.trucks && data.trucks[truckCode]) {
    data.trucks[truckCode].status = "مشغول";
    await saveDB(data);
  }
}

export async function unlockTruck(truckCode) {
  const data = await loadDB();
  if (data.trucks && data.trucks[truckCode]) {
    data.trucks[truckCode].status = "متاح";
    await saveDB(data);
  }
}
