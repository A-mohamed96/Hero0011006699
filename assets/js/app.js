/****************************************
 *  IMPORT FIREBASE API
 ****************************************/
import { loadDB, saveDB } from "./api.js";

/****************************************
 *  GLOBAL DB OBJECT
 ****************************************/
let DB = {
  farms: {}
};

/****************************************
 *  ON LOAD
 ****************************************/
document.addEventListener("DOMContentLoaded", async () => {
  DB = await loadDB();

  // تأمين الهيكل
  if (!DB.farms) DB.farms = {};

  renderFarms();
});

/****************************************
 *  RENDER FARMS TABLE
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
        <button class="btn btn-sm btn-danger" onclick="deleteFarm('${farm.code}')">
          حذف
        </button>
      </td>
    `;

    tbody.appendChild(tr);
  });
}

/****************************************
 *  ADD / SAVE FARM
 ****************************************/
const farmForm = document.getElementById("farmForm");
if (farmForm) {
  farmForm.addEventListener("submit", async e => {
    e.preventDefault();

    const farm = {
      code: farm_code.value.trim(),
      name: farm_name.value.trim(),
      owner: owner_name.value.trim(),
      acres: Number(acres.value || 0),
      target: Number(target.value || 0)
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
window.deleteFarm = async function(code) {
  if (!confirm("تأكيد الحذف؟")) return;

  delete DB.farms[code];
  await saveDB(DB);
  renderFarms();
};
