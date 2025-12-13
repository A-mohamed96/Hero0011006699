import { loadDB, getCurrentUser } from "./api.js";

document.addEventListener("DOMContentLoaded", async () => {
  const DB = await loadDB() || {};

  // أرقام
  document.getElementById("totalFarms").textContent =
    Object.keys(DB.farms || {}).length;

  document.getElementById("totalReceivings").textContent =
    Object.keys(DB.receivings || {}).length;

  document.getElementById("totalEmpty").textContent =
    DB.emptyTotal || 0;

  document.getElementById("totalPallets").textContent =
    DB.palletsTotal || 0;

  // صلاحيات
  applyPermissions();
});

function applyPermissions() {
  const user = getCurrentUser();
  if (!user || user.role !== "admin") {
    document.querySelectorAll(".admin-only").forEach(el => el.remove());
  }
}
