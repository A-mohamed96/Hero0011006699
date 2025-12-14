import { loadDB, saveDB } from "./api.js";

let DB = { farms: {} };

document.addEventListener("DOMContentLoaded", async () => {
  DB = await loadDB();
  DB.farms = DB.farms || {};
  renderFarms();
});

/****************************************
 * RENDER TABLE
 ****************************************/
function renderFarms() {
  const tbody = document.querySelector("#farmsTable tbody");
  if (!tbody) return;

  tbody.innerHTML = "";

  Object.values(DB.farms).forEach(farm => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${farm.code}</td>
      <td>${farm.name || ""}</td>
      <td>${farm.owner || ""}</td>
      <td>${farm.acres || 0}</td>
      <td>${farm.target || 0}</td>
      <td>${farm.progress || 0}</td>
      <td>
        <button class="btn btn-sm btn-danger" data-del="${farm.code}">
          حذف
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

/****************************************
 * SAVE FARM
 ****************************************/
document.getElementById("farmForm").addEventListener("submit", async e => {
  e.preventDefault();

  const farm = {
    code: farm_code.value.trim(),
    name: farm_name.value.trim(),
    owner: owner_name.value.trim(),
    acres: Number(acres.value || 0),
    target: Number(target.value || 0),
    progress: 0
  };

  if (!farm.code || !farm.name) {
    alert("كود واسم المزرعة إجباري");
    return;
  }

  DB.farms[farm.code] = farm;
  await saveDB(DB);

  e.target.reset();
  bootstrap.Modal.getInstance(
    document.getElementById("farmModal")
  ).hide();

  renderFarms();
});

/****************************************
 * DELETE
 ****************************************/
document.addEventListener("click", async e => {
  if (!e.target.dataset.del) return;

  if (!confirm("تأكيد الحذف؟")) return;

  delete DB.farms[e.target.dataset.del];
  await saveDB(DB);
  renderFarms();
});
