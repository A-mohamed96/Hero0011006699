import { loadDB, saveDB } from "./api.js";

let DB = { trucks: {} };

document.addEventListener("DOMContentLoaded", async () => {
  DB = await loadDB() || {};
  DB.trucks = DB.trucks || {};
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

    tr.innerHTML = `
      <td>${truck.code}</td>
      <td>${truck.plate || ""}</td>
      <td>${truck.capacity || 0}</td>
      <td>${truck.status}</td>
      <td>
        ${
          truck.status === "مشغول"
            ? `<button class="btn btn-sm btn-success" data-open="${truck.code}">فتح</button>`
            : ""
        }
        <button class="btn btn-sm btn-danger" data-delete="${truck.code}">
          حذف
        </button>
      </td>
    `;

    tbody.appendChild(tr);
  });
}

/****************************************
 * ACTIONS (OPEN / DELETE)
 ****************************************/
document.addEventListener("click", async e => {
  if (e.target.dataset.open) {
    const code = e.target.dataset.open;

    if (!DB.trucks[code]) return;

    DB.trucks[code].status = "متاح";
    await saveDB(DB);
    renderTrucks();
  }

  if (e.target.dataset.delete) {
    deleteTruck(e.target.dataset.delete);
  }
});

/****************************************
 * SAVE
 ****************************************/
document.getElementById("truckForm").addEventListener("submit", async e => {
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
 * DELETE
 ****************************************/
async function deleteTruck(code) {
  if (!confirm("تأكيد الحذف؟")) return;
  delete DB.trucks[code];
  await saveDB(DB);
  renderTrucks();
}
