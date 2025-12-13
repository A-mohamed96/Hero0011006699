/****************************************
 * IMPORT FIREBASE API
 ****************************************/
import { loadDB, saveDB } from "./api.js";

/****************************************
 * GLOBAL DB
 ****************************************/
let DB = {
  trucks: {},
  shipments: {}
};

/****************************************
 * ON LOAD
 ****************************************/
document.addEventListener("DOMContentLoaded", async () => {
  DB = await loadDB() || {};

  DB.trucks = DB.trucks || {};
  DB.shipments = DB.shipments || {};

  fillTrucksSelect();
  renderShipments();
});

/****************************************
 * FILL AVAILABLE TRUCKS
 ****************************************/
function fillTrucksSelect() {
  const select = document.getElementById("ship_truck");
  if (!select) return;

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
 * RENDER SHIPMENTS TABLE
 ****************************************/
function renderShipments() {
  const tbody = document.querySelector("#shipmentsTable tbody");
  if (!tbody) return;

  tbody.innerHTML = "";

  Object.values(DB.shipments).forEach((s, i) => {
    const truck = DB.trucks[s.truckCode];

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${i + 1}</td>
      <td>${truck ? truck.code : s.truckCode}</td>
      <td>${s.destination}</td>
      <td>${s.departAt}</td>
      <td>${s.arriveAt || "-"}</td>
      <td>${s.status}</td>
      <td>
        ${
          s.status === "في الطريق"
            ? `<button class="btn btn-sm btn-success" data-id="${s.id}">
                وصول
              </button>`
            : ""
        }
      </td>
    `;

    tbody.appendChild(tr);
  });

  tbody.querySelectorAll("button[data-id]").forEach(btn => {
    btn.onclick = () => markArrived(btn.dataset.id);
  });
}

/****************************************
 * SAVE SHIPMENT
 ****************************************/
document.getElementById("shipForm").addEventListener("submit", async e => {
  e.preventDefault();

  const truckCode = ship_truck.value;
  const destination = ship_destination.value.trim();
  const departAt = ship_depart.value;

  if (!truckCode || !destination || !departAt) {
    alert("البراد + الوجهة + وقت المغادرة إجباري");
    return;
  }

  const shipment = {
    id: Date.now().toString(),
    truckCode,
    destination,
    departAt,
    arriveAt: "",
    status: "في الطريق"
  };

  DB.shipments[shipment.id] = shipment;

  // 🔒 قفل البراد
  DB.trucks[truckCode].status = "مشغول";

  await saveDB(DB);

  e.target.reset();
  bootstrap.Modal.getInstance(
    document.getElementById("shipModal")
  ).hide();

  fillTrucksSelect();
  renderShipments();
});

/****************************************
 * MARK ARRIVED (فتح البراد)
 ****************************************/
async function markArrived(id) {
  const shipment = DB.shipments[id];
  if (!shipment) return;

  shipment.status = "تم الوصول";
  shipment.arriveAt = new Date().toISOString().slice(0, 16);

  // 🔓 فتح البراد
  if (DB.trucks[shipment.truckCode]) {
    DB.trucks[shipment.truckCode].status = "متاح";
  }

  await saveDB(DB);

  fillTrucksSelect();
  renderShipments();
}
