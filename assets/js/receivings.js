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

  DB.farms = DB.farms || {};
  DB.trucks = DB.trucks || {};
  DB.receivings = DB.receivings || {};

  fillFarmsSelect();
  fillTrucksSelect();
  renderReceivings();
});

/****************************************
 * FILL FARMS SELECT
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
 * FILL TRUCKS SELECT
 ****************************************/
function fillTrucksSelect() {
  const select = document.getElementById("recv_truck");
  if (!select) return;

  select.innerHTML = `<option value="">اختر براد</option>`;

  Object.values(DB.trucks).forEach(truck => {
    // ملاحظة: غيّر القيمة حسب اللي مستخدمها عندك
    if (truck.status === "ready" || truck.status === "متاح") {
      const opt = document.createElement("option");
      opt.value = truck.code;
      opt.textContent = `${truck.code} (${truck.plate || ""})`;
      select.appendChild(opt);
    }
  });
}

/****************************************
 * RENDER RECEIVINGS TABLE
 ****************************************/
function renderReceivings() {
  const tbody = document.querySelector("#receivingsTable tbody");
  if (!tbody) return;

  tbody.innerHTML = "";

  const receivingsArr = Object.values(DB.receivings);

  receivingsArr.forEach((r, index) => {
    const farm = DB.farms[r.farmCode];
    const truck = DB.trucks[r.truckCode];

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${index + 1}</td>
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

  tbody.querySelectorAll("button[data-id]").forEach(btn => {
    btn.onclick = () => deleteReceiving(btn.dataset.id);
  });
}

/****************************************
 * SAVE RECEIVING
 ****************************************/
const receiveForm = document.getElementById("receiveForm");

if (receiveForm) {
  receiveForm.addEventListener("submit", async e => {
    e.preventDefault();

    const farmCode = document.getElementById("recv_farm").value;
    const truckCode = document.getElementById("recv_truck").value;
    const qty = Number(document.getElementById("recv_qty").value);

    if (!farmCode || !truckCode || !qty) {
      alert("المزرعة + البراد + الكمية إجباري");
      return;
    }

    const receiving = {
      id: Date.now().toString(),
      date: new Date().toISOString().split("T")[0],
      farmCode,
      product: document.getElementById("recv_product").value.trim() || "غير محدد",
      qty,
      quality: document.getElementById("recv_quality").value,
      truckCode
    };

    DB.receivings[receiving.id] = receiving;

    await saveDB(DB);

    receiveForm.reset();
    bootstrap.Modal.getInstance(
      document.getElementById("receiveModal")
    ).hide();

    renderReceivings();
  });
}

/****************************************
 * DELETE RECEIVING
 ****************************************/
async function deleteReceiving(id) {
  if (!confirm("تأكيد الحذف؟")) return;

  delete DB.receivings[id];
  await saveDB(DB);
  renderReceivings();
}
