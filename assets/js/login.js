import { login } from "./api.js";

document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const u = document.getElementById("username").value.trim();
  const p = document.getElementById("password").value.trim();

  console.log("TRY LOGIN:", u, p);

  const user = await login(u, p);

  console.log("USER:", user);

  if (!user) {
    alert("اسم المستخدم أو كلمة المرور خطأ");
    return;
  }

  window.location.href = "dashboard.html";
});
