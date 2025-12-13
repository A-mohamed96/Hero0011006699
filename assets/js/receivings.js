/****************************************
 *  IMPORT FIREBASE API
 ****************************************/
import { loadDB, saveDB } from "./api.js";

/****************************************
 *  GLOBAL DB
 ****************************************/
let DB = {
  farms: {},
  receivings: {}
};

/****************************************
 *  ON LOAD
 ****************************************/
document.addEventListener("DOMContentLoaded", async () => {
  DB = await loadDB() || {};

  if (!DB.farms) DB.farms = {};
  if (!DB.receivings) DB.receivings = {};

  fillFarmsSelect();
  renderReceivings();
});

/****************************************
 *  FILL FARMS DROPDOWN
 ****************************************/
function fillFarmsSelect() {
  const select = document.getElementById("recv_farm");
  if (!select) return;

  select.innerHTML = `<option value="">اختر مزرعة</option>`;

  Object.values(DB.farms).forEach(farm => {
    const opt = document.createElement("option");
    opt.value = farm.code;
    opt.textContent = `${farm.code} - ${farm.name}`;
    select.appendChild(opt);
  });
}

/****************************************
 *  RENDER RECEIVINGS TABLE
 ****************************************/
function renderReceivings() {
  const tbody = document.querySelector("#receivingsTable tbody");
  if (!tbody) return;

  tbody.innerHTML = "";

  Object.values(DB.receivings).forEach((r, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${i + 1}</td>
      <td>${r.date}</td>
      <td>${r.farmCode}</td>
      <td>${r.product}</td>
      <td>${r.qty}</td>
      <td>${r.quality}</td>
      <td>${r.truck || ""}</td>
    `;
    tbody.appendChild(tr);
  });
}

/****************************************
 *  SAVE RECEIVING
 ****************************************/
const recvForm = document.getElementById("receiveForm");

if (recvForm) {
  recvForm.addEventListener("submit", async e => {
    e.preventDefault();

    const receiving = {
      id: Date.now(),
      date: new Date().toISOString().split("T")[0],
      farmCode: document.getElementById("recv_farm").value,
      product: document.getElementById("recv_product").value.trim(),
      qty: Number(document.getElementById("recv_qty").value),
      quality: document.getElementById("recv_quality").value,
      truck: document.getElementById("recv_truck").value || ""
    };

    if (!receiving.farmCode || !receiving.qty) {
      alert("اختر المزرعة والكمية");
      return;
    }

    DB.receivings[receiving.id] = receiving;
    await saveDB(DB);

    recvForm.reset();
    bootstrap.Modal.getInstance(
      document.getElementById("receiveModal")
    ).hide();

    renderReceivings();
  });
}
