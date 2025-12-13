import { loadDB, saveDB } from "./api.js";

let DB = { trucks: {} };

document.addEventListener("DOMContentLoaded", async () => {
  DB = await loadDB() || {};
  if (!DB.trucks) DB.trucks = {};
  renderTrucks();
});

/****************************************
 * RENDER TABLE
 ****************************************/
function renderTrucks() {
  const tbody = document.querySelector("#trucksTable tbody");
  if (!tbody) return;

  tbody.innerHTML = "";

  Object.values(DB.trucks).forEach(truck => {
    const tr = document.createElement("tr");

    let actionHTML = `
      <button class="btn btn-sm btn-danger" data-delete="${truck.code}">
        حذف
      </button>
    `;

    // زر فتح البراد لو مشغول
    if (truck.status === "مشغول") {
      actionHTML += `
        <button class="btn btn-sm btn-warning ms-1" data-open="${truck.code}">
          فتح البراد
        </button>
      `;
    }

    tr.innerHTML = `
      <td>${truck.code}</td>
      <td>${truck.plate || ""}</td>
      <td>${truck.capacity || 0}</td>
      <td>
        <span class="badge ${
          truck.status === "متاح" ? "bg-success" :
          truck.status === "مشغول" ? "bg-danger" :
          "bg-secondary"
        }">
          ${truck.status}
        </span>
      </td>
      <td>${actionHTML}</td>
    `;

    tbody.appendChild(tr);
  });

  // حذف
  document.querySelectorAll("[data-delete]").forEach(btn => {
    btn.onclick = () => deleteTruck(btn.dataset.delete);
  });

  // فتح البراد
  document.querySelectorAll("[data-open]").forEach(btn => {
    btn.onclick = () => openTruck(btn.dataset.open);
  });
}

/****************************************
 * SAVE
 ****************************************/
document.getElementById("truckForm")?.addEventListener("submit", async e => {
  e.preventDefault();

  const truck = {
    code: truck_code.value.trim(),
    plate: truck_plate.value.trim(),
    capacity: Number(truck_capacity.value || 0),
    status: truck_status.value
  };

  if (!truck.code) {
    alert("كود البراد إجباري");
    return;
  }

  DB.trucks[truck.code] = truck;
  await saveDB(DB);

  e.target.reset();
  bootstrap.Modal.getInstance(
    document.getElementById("truckModal")
  ).hide();

  renderTrucks();
});

/****************************************
 * OPEN TRUCK (إعادة متاح)
 ****************************************/
async function openTruck(code) {
  if (!confirm("تأكيد فتح البراد؟")) return;

  if (!DB.trucks[code]) return;

  DB.trucks[code].status = "متاح";
  await saveDB(DB);
  renderTrucks();
}

/****************************************
 * DELETE
 ****************************************/
async function deleteTruck(code) {
  if (!confirm("تأكيد الحذف؟")) return;

  delete DB.trucks[code];
  await saveDB(DB);
  renderTrucks();
}
