import { loadDB, getCurrentUser, logout } from "./api.js";

document.addEventListener("DOMContentLoaded", async () => {

  /* ====== تأكيد تسجيل الدخول ====== */
  const user = getCurrentUser();
  if (!user) {
    window.location.href = "index.html";
    return;
  }

  /* ====== تحميل الداتا ====== */
  const DB = await loadDB();

  /* ====== الإحصائيات ====== */
  const farms = DB.farms || {};
  const receivings = DB.receivings || {};

  document.getElementById("totalFarms").textContent =
    Object.keys(farms).length;

  document.getElementById("totalReceivings").textContent =
    Object.keys(receivings).length;

  /* ====== حساب الأرصدة من الاستلامات ====== */
  let emptyTotal = 0;
  let palletsTotal = 0;

  Object.values(receivings).forEach(r => {
    emptyTotal += Number(r.empty || 0);
    palletsTotal += Number(r.pallets || 0);
  });

  document.getElementById("totalEmpty").textContent = emptyTotal;
  document.getElementById("totalPallets").textContent = palletsTotal;

  /* ====== آخر الاستلامات ====== */
  const recentBox = document.getElementById("recentReceivings");
  const last = Object.values(receivings).slice(-5).reverse();

  if (last.length === 0) {
    recentBox.textContent = "لا توجد استلامات";
  } else {
    recentBox.innerHTML = last.map(r => `
      <div class="border-bottom py-1">
        مزرعة: ${r.farm || "-"} — كمية: ${r.qty || 0}
      </div>
    `).join("");
  }

  /* ====== الصلاحيات ====== */
  if (user.role !== "admin") {
    document.querySelectorAll(".admin-only").forEach(el => el.remove());
  }

  /* ====== تسجيل الخروج ====== */
  document.getElementById("logoutBtn")?.addEventListener("click", e => {
    e.preventDefault();
    logout();
  });
});
