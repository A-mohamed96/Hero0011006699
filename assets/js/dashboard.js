import { loadDB } from "./api.js";

document.addEventListener("DOMContentLoaded", async () => {

  const user = JSON.parse(localStorage.getItem("currentUser"));

  if (!user) {
    location.href = "index.html";
    return;
  }

  // اسم المستخدم
  document.getElementById("usernameLabel").textContent = user.username;

  const DB = await loadDB() || {};

  document.getElementById("totalFarms").textContent =
    Object.keys(DB.farms || {}).length;

  document.getElementById("totalReceivings").textContent =
    Object.keys(DB.receivings || {}).length;

  document.getElementById("totalEmpty").textContent =
    DB.emptyTotal || 0;

  document.getElementById("totalPallets").textContent =
    DB.palletsTotal || 0;
});

// Logout
document.getElementById("logoutBtn").onclick = () => {
  localStorage.removeItem("currentUser");
  location.href = "index.html";
};
