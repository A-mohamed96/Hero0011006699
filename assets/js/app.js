/****************************************
 *  IMPORT FIREBASE API
 ****************************************/
import { loadDB, saveDB } from "./api.js";

/****************************************
 *  GLOBAL DB
 ****************************************/
let DB = { farms: {} };

/****************************************
 *  ON LOAD
 ****************************************/
document.addEventListener("DOMContentLoaded", async () => {
  DB = await loadDB() || {};
  if (!DB.farms) DB.farms = {};
  renderFarms();
});

/****************************************
 *  RENDER FARMS
 ****************************************/
function renderFarms() {
  const tbody = document.querySelector("#farmsTable tbody");
  if (!tbody) return;

  tbody.innerHTML = "";

  Object.values(DB.farms).forEach(farm => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${farm.code}</td>
      <td>${farm.name}</td>
      <td>${farm.owner || ""}</td>
      <td>${farm.acres || 0}</td>
      <td>${farm.target || 0}</td>
      <td>—</td>
      <td>
        <button class="btn btn-sm btn-danger" data-code="${farm.code}">
          حذف
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  document.querySelectorAll("button[data-code]").forEach(btn => {
    btn.onclick = () => deleteFarm(btn.dataset.code);
  });
}

/****************************************
 *  SAVE FARM
 ****************************************/
const farmForm = document.getElementById("farmForm");

if (farmForm) {
  farmForm.addEventListener("submit", async e => {
    e.preventDefault();

    const farm = {
      code: document.getElementById("farm_code").value.trim(),
      name: document.getElementById("farm_name").value.trim(),
      owner: document.getElementById("owner_name").value.trim(),
      acres: Number(document.getElementById("acres").value || 0),
      target: Number(document.getElementById("target").value || 0)
    };

    if (!farm.code || !farm.name) {
      alert("الكود واسم المزرعة إجباري");
      return;
    }

    DB.farms[farm.code] = farm;
    await saveDB(DB);

    farmForm.reset();
    bootstrap.Modal.getInstance(
      document.getElementById("farmModal")
    ).hide();

    renderFarms();
  });
}

/****************************************
 *  DELETE FARM
 ****************************************/
async function deleteFarm(code) {
  if (!confirm("تأكيد الحذف؟")) return;
  delete DB.farms[code];
  await saveDB(DB);
  renderFarms();
}
