/****************************************
 *  IMPORT FIREBASE API
 ****************************************/
import { loadDB, saveDB } from "./api.js";

/****************************************
 *  GLOBAL DB
 ****************************************/
let DB = {
  farms: {},
  receivings: {},
  trucks: {}
};

/****************************************
 *  ON LOAD
 ****************************************/
document.addEventListener("DOMContentLoaded", async () => {
  DB = await loadDB() || {};

  if (!DB.farms) DB.farms = {};
  if (!DB.receivings) DB.receivings = {};
  if (!DB.trucks) DB.trucks = {};

  /* تشغيل حسب الصفحة */
  if (document.getElementById("farmsTable")) {
    renderFarms();
  }

  if (document.getElementById("receivingsTable")) {
    initReceivings();
  }
});

/****************************************
 *  ========== FARMS ==========
 ****************************************/

/* RENDER FARMS */
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

/* SAVE FARM */
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

/* DELETE FARM */
async function deleteFarm(code) {
  if (!confirm("تأكيد الحذف؟")) return;
  delete DB.farms[code];
  await saveDB(DB);
  renderFarms();
}

/****************************************
 *  ========== RECEIVINGS ==========
 ****************************************/

function initReceivings() {
  fillFarmsSelect();
  renderReceivings();
}

/* FILL FARMS SELECT */
function fillFarmsSelect() {
  const sel = document.getElementById("recv_farm");
  if (!sel) return;

  sel.innerHTML = "<option value=''>اختر مزرعة</option>";

  Object.values(DB.farms).forEach(farm => {
    const opt = document.createElement("option");
    opt.value = farm.code;
    opt.textContent = `${farm.code} - ${farm.name}`;
    sel.appendChild(opt);
  });
}

/* RENDER RECEIVINGS */
function renderReceivings() {
  const tbody = document.querySelector("#receivingsTable tbody");
  if (!tbody) return;

  tbody.innerHTML = "";
  let i = 1;

  Object.values(DB.receivings).forEach(r => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${i++}</td>
      <td>${r.date}</td>
      <td>${r.farm}</td>
      <td>${r.product}</td>
      <td>${r.qty}</td>
      <td>${r.quality}</td>
      <td>${r.truck || ""}</td>
    `;
    tbody.appendChild(tr);
  });
}

/* SAVE RECEIVING */
const recvForm = document.getElementById("receiveForm");
if (recvForm) {
  recvForm.addEventListener("submit", async e => {
    e.preventDefault();

    if (!recv_farm.value) {
      alert("اختر المزرعة");
      return;
    }

    const id = Date.now();

    DB.receivings[id] = {
      date: new Date().toLocaleDateString("ar-EG"),
      farm: recv_farm.value,
      product: recv_product.value,
      qty: Number(recv_qty.value),
      quality: recv_quality.value,
      truck: recv_truck.value || ""
    };

    await saveDB(DB);

    recvForm.reset();
    bootstrap.Modal.getInstance(
      document.getElementById("receiveModal")
    ).hide();

    renderReceivings();
  });
}
