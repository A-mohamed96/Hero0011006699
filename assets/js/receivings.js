/****************************************
 * IMPORT FIREBASE API
 ****************************************/
import { loadDB, saveDB } from "./api.js";

/****************************************
 * GLOBAL DB
 ****************************************/
let DB = {
  farms: {},
  trucks: {},
  receivings: {}
};

/****************************************
 * ON LOAD
 ****************************************/
document.addEventListener("DOMContentLoaded", async () => {
  DB = await loadDB() || {};

  if (!DB.farms) DB.farms = {};
  if (!DB.trucks) DB.trucks = {};
  if (!DB.receivings) DB.receivings = {};

  fillFarmsSelect();
  fillTrucksSelect();
  renderReceivings();
});

/****************************************
 * FILL FARMS
 ****************************************/
function fillFarmsSelect() {
  const select = document.getElementById("recv_farm");
  select.innerHTML = `<option value="">اختر مزرعة</option>`;

  Object.values(DB.farms).forEach(farm => {
    const opt = document.createElement("option");
    opt.value = farm.code;
    opt.textContent = `${farm.code} - ${farm.name}`;
    select.appendChild(opt);
  });
}

/****************************************
 * FILL TRUCKS
 ****************************************/
function fillTrucksSelect() {
  const select = document.getElementById("recv_truck");
  select.innerHTML = `<option value="">اختر براد</option>`;

  Object.values(DB.trucks).forEach(truck => {
    if (truck.status === "متاح") {
      const opt = document.createElement("option");
      opt.value = truck.code;
      opt.textContent = `${truck.code} (${truck.plate || ""})`;
      select.appendChild(opt);
    }
  });
}

/****************************************
 * RENDER TABLE
 ****************************************/
function renderReceivings() {
  const tbody = document.querySelector("#receivingsTable tbody");
  tbody.innerHTML = "";

  Object.values(DB.receivings).forEach((r, i) => {
    const farm = DB.farms[r.farmCode];
    const truck = DB.trucks[r.truckCode];

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${i + 1}</td>
      <td>${r.date}</td>
      <td>${farm ? farm.name : r.farmCode}</td>
      <td>${r.product}</td>
      <td>${r.qty}</td>
      <td>${r.quality}</td>
      <td>${truck ? truck.code : ""}</td>
      <td>
        <button class="btn btn-sm btn-danger" data-id="${r.id}">
          حذف
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  document.querySelectorAll("button[data-id]").forEach(btn => {
    btn.onclick = () => deleteReceiving(btn.dataset.id);
  });
}

/****************************************
 * SAVE RECEIVING
 ****************************************/
document.getElementById("receiveForm").addEventListener("submit", async e => {
  e.preventDefault();

  const receiving = {
    id: Date.now(),
    date: new Date().toISOString().split("T")[0],
    farmCode: recv_farm.value,
    product: recv_product.value.trim(),
    qty: Number(recv_qty.value),
    quality: recv_quality.value,
    truckCode: recv_truck.value
  };

  if (!receiving.farmCode || !receiving.qty || !receiving.truckCode) {
    alert("المزرعة + الكمية + البراد إجباري");
    return;
  }

  DB.receivings[receiving.id] = receiving;
  await saveDB(DB);

  e.target.reset();
  bootstrap.Modal.getInstance(
    document.getElementById("receiveModal")
  ).hide();

  renderReceivings();
});

/****************************************
 * DELETE
 ****************************************/
async function deleteReceiving(id) {
  if (!confirm("تأكيد الحذف؟")) return;
  delete DB.receivings[id];
  await saveDB(DB);
  renderReceivings();
}
