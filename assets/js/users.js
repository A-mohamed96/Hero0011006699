import { loadDB, saveDB, getCurrentUser } from "./api.js";

let DB = { users: {} };

document.addEventListener("DOMContentLoaded", async () => {
  DB = await loadDB() || {};
  DB.users = DB.users || {};
  renderUsers();
});

/****************************************
 * RENDER
 ****************************************/
function renderUsers() {
  const tbody = document.querySelector("#usersTable tbody");
  tbody.innerHTML = "";

  Object.values(DB.users).forEach(u => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${u.username}</td>
      <td>${u.role}</td>
      <td>
        <button class="btn btn-sm btn-danger" data-u="${u.username}">
          حذف
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  tbody.querySelectorAll("button[data-u]").forEach(btn => {
    btn.onclick = () => deleteUser(btn.dataset.u);
  });
}

/****************************************
 * SAVE
 ****************************************/
document.getElementById("userForm").addEventListener("submit", async e => {
  e.preventDefault();

  const username = u_username.value.trim();

  if (DB.users[username]) {
    alert("اسم المستخدم موجود بالفعل");
    return;
  }

  const user = {
    username,
    password: u_password.value.trim(),
    role: u_role.value
  };

  if (!user.username || !user.password) {
    alert("بيانات ناقصة");
    return;
  }

  DB.users[username] = user;
  await saveDB(DB);

  e.target.reset();
  bootstrap.Modal.getInstance(userModal).hide();
  renderUsers();
});

/****************************************
 * DELETE
 ****************************************/
async function deleteUser(username) {
  const current = getCurrentUser();

  if (current && current.username === username) {
    alert("لا يمكن حذف المستخدم الحالي");
    return;
  }

  if (!confirm("تأكيد الحذف؟")) return;

  delete DB.users[username];
  await saveDB(DB);
  renderUsers();
}
