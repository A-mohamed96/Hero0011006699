import { login } from "./api.js";

document.getElementById("loginForm").addEventListener("submit", async e => {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  const user = await login(username, password);

  if (!user) {
    alert("اسم المستخدم أو كلمة المرور خطأ");
    return;
  }

  window.location.href = "dashboard.html";
});
