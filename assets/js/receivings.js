/****************************************
 *  IMPORT FIREBASE API
 ****************************************/
import { loadDB, saveDB } from "./api.js";

/****************************************
 *  GLOBAL DB
 ****************************************/
let DB = { farms:{}, receivings:{} };

/****************************************
 *  ON LOAD
 ****************************************/
document.addEventListener("DOMContentLoaded", async () => {
  DB = await loadDB();

  if (!DB.farms) DB.farms = {};
  if (!DB.receivings) DB.receivings = {};

  fillFarmsSelect();
  renderReceivings();
});

/****************************************
 *  FILL FARMS DROPDOWN
 ****************************************/
function fillFarmsSelect(){
  const select = document.getElementById("farmCode");
  if(!select) return;

  select.innerHTML = `<option value="">اختر مزرعة</option>`;

  Object.values(DB.farms).forEach(f => {
    const opt = document.createElement("option");
    opt.value = f.code;
    opt.textContent = `${f.code} - ${f.name}`;
    select.appendChild(opt);
  });
}

/****************************************
 *  RENDER RECEIVINGS
 ****************************************/
function renderReceivings(){
  const tbody = document.querySelector("#receivingsTable tbody");
  if(!tbody) return;

  tbody.innerHTML = "";

  Object.values(DB.receivings).forEach(r => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${r.id}</td>
      <td>${r.date}</td>
      <td>${r.farmName}</td>
      <td>${r.quantity}</td>
      <td>${r.emptyOut}</td>
      <td>${r.palletsOut}</td>
      <td>
        <button class="btn btn-sm btn-danger" data-id="${r.id}">حذف</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  document.querySelectorAll("button[data-id]").forEach(btn=>{
    btn.onclick = ()=> deleteReceiving(btn.dataset.id);
  });
}

/****************************************
 *  SAVE RECEIVING
 ****************************************/
const form = document.getElementById("receivingForm");

if(form){
  form.addEventListener("submit", async e=>{
    e.preventDefault();

    const farm = DB.farms[farmCode.value];

    if(!farm){
      alert("اختر مزرعة صحيحة");
      return;
    }

    const receiving = {
      id: receiving_id.value.trim(),
      date: receiving_date.value,
      farmCode: farm.code,
      farmName: farm.name,
      quantity: Number(quantity.value || 0),
      emptyOut: Number(emptyOut.value || 0),
      palletsOut: Number(palletsOut.value || 0),
      notes: notes.value.trim()
    };

    if(!receiving.id || !receiving.date){
      alert("الكود والتاريخ إجباري");
      return;
    }

    DB.receivings[receiving.id] = receiving;
    await saveDB(DB);

    form.reset();
    bootstrap.Modal.getInstance(
      document.getElementById("receivingModal")
    ).hide();

    renderReceivings();
  });
}

/****************************************
 *  DELETE
 ****************************************/
async function deleteReceiving(id){
  if(!confirm("تأكيد الحذف؟")) return;
  delete DB.receivings[id];
  await saveDB(DB);
  renderReceivings();
}
