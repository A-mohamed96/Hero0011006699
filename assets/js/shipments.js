/****************************************
 * IMPORT API
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
 * FILL TRUCKS (مشغول فقط)
 ****************************************/
function fillTrucksSelect() {
  const select = document.getElementById("ship_truck");
  if (!select) return;

  select.innerHTML = `<option value="">اختر براد</option>`;

  Object.values(DB.trucks).forEach(truck => {
    if (truck.status === "مشغول") {
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
function renderShipments() {
  const tbody = document.querySelector("#shipmentsTable tbody");
  if (!tbody) return;

  tbody.innerHTML = "";

  Object.values(DB.shipments).forEach((s, i) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${i + 1}</td>
      <td>${s.truckCode}</td>
      <td>${s.depart}</td>
      <td>${s.arrive || "—"}</td>
      <td>${s.arrive ? "تم الوصول" : "في الطريق"}</td>
      <td>
        ${
          !s.arrive
            ? `<button class="btn btn-sm btn-success" data-arrive="${s.id}">
                 تسجيل الوصول
               </button>`
            : ""
        }
      </td>
    `;

    tbody.appendChild(tr);
  });

  tbody.querySelectorAll("button[data-arrive]").forEach(btn => {
    btn.onclick = () => finishShipment(btn.dataset.arrive);
  });
}

/****************************************
 * SAVE SHIPMENT
 ****************************************/
document.getElementById("shipForm").addEventListener("submit", async e => {
  e.preventDefault();

  const truckCode = ship_truck.value;
  const depart = ship_depart.value;

  if (!truckCode || !depart) {
    alert("البراد وتاريخ المغادرة إجباري");
    return;
  }

  const shipment = {
    id: Date.now().toString(),
    truckCode,
    depart,
    arrive: null
  };

  DB.shipments[shipment.id] = shipment;
  await saveDB(DB);

  e.target.reset();
  bootstrap.Modal.getInstance(
    document.getElementById("shipModal")
  ).hide();

  renderShipments();
});

/****************************************
 * ARRIVAL (فتح البراد)
 ****************************************/
async function finishShipment(id) {
  const shipment = DB.shipments[id];
  if (!shipment) return;

  shipment.arrive = new Date().toISOString().slice(0, 16);

  if (DB.trucks[shipment.truckCode]) {
    DB.trucks[shipment.truckCode].status = "متاح";
  }

  await saveDB(DB);
  fillTrucksSelect();
  renderShipments();
}
