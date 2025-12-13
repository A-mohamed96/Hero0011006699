import { loadDB } from "./api.js";

document.getElementById("loginForm").addEventListener("submit", async e => {
  e.preventDefault();

  const username = username.value.trim();
  const password = password.value.trim();

  const DB = await loadDB();
  const users = DB.users || {};

  const user = Object.values(users).find(
    u => u.username === username && u.password === password
  );

  if (!user) {
    alert("بيانات غير صحيحة");
    return;
  }

  localStorage.setItem("SupplySysUser", JSON.stringify(user));

  window.location.href =
    user.role === "admin" ? "dashboard.html" : "receivings.html";
});
