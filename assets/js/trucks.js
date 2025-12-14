import { loadDB, saveDB, requireAdmin } from "./api.js";

requireAdmin();

let DB = { trucks: {} };

document.addEventListener("DOMContentLoaded", async () => {
  DB = await loadDB() || {};
  DB.trucks ||= {};
  renderTrucks();
});

/****************************************
 * RENDER TABLE
 ****************************************/
function renderTrucks() {
  const tbody = document.querySelector("#trucksTable tbody");
  if (!tbody) return;

  tbody.innerHTML = "";

  Object.entries(DB.trucks).forEach(([code, truck]) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${code}</td>
      <td>${truck.plate || ""}</td>
      <td>${truck.capacity || 0}</td>
      <td>${truck.status}</td>
      <td>
        ${
          truck.status === "مشغول"
            ? `<button class="btn btn-sm btn-success" data-open="${code}">فتح</button>`
            : ""
        }
        <button class="btn btn-sm btn-danger" data-delete="${code}">
          حذف
        </button>
      </td>
    `;

    tbody.appendChild(tr);
  });
}

/****************************************
 * ACTIONS
 ****************************************/
document.addEventListener("click", async e => {
  if (e.target.dataset.open) {
    const code = e.target.dataset.open;

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

  const code = document.getElementById("truck_code").value.trim();
  const plate = document.getElementById("truck_plate").value.trim();
  const capacity = Number(document.getElementById("truck_capacity").value || 0);
  const status = document.getElementById("truck_status").value;

  if (!code) {
    alert("كود البراد إجباري");
    return;
  }

  DB.trucks[code] = {
    plate,
    capacity,
    status
  };

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
