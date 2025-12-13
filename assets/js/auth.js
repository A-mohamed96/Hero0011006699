import { loadDB } from "./api.js";

const session = JSON.parse(localStorage.getItem("SupplySysUser"));

if (!session) {
  window.location.href = "index.html";
}

const page = window.location.pathname.split("/").pop();

const employeePages = [
  "receivings.html",
  "trucks.html",
  "shipments.html"
];

if (session.role === "employee" && !employeePages.includes(page)) {
  alert("غير مصرح بالدخول");
  window.location.href = "receivings.html";
}
