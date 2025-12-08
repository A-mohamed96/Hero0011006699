/****************************************
 *  LOCAL DB OBJECT
 ****************************************/
const DB = {
    farms: [],
    receivings: [],
    trucks: [],
    shipments: [],
    suppliers: [],
    empty_items: [
        { id: "branik", name: "برانيك" },
        { id: "karton", name: "كرتون" },
        { id: "bant", name: "بانت" },
        { id: "pallet", name: "بلتات خشب" }
    ],
    empty_receivings: [],
    empty_issues: [],
    pallet_receivings: [],
    pallet_returns: [],
    users: []
};

/****************************************
 *  LOAD ALWAYS FROM CLOUD FIRST
 ****************************************/
async function load(){
    const cloud = await window.loadDB();

    if(cloud){
        Object.assign(DB, cloud);
        console.log("DB LOADED FROM CLOUD:", DB);
    } else {
        console.warn("NO CLOUD DATA — starting with empty DB");
    }
}

/****************************************
 *  SAVE TO CLOUD ALWAYS
 ****************************************/
function save(){
    window.saveDB(DB);
}

/****************************************
 *  LOGIN FUNCTION
 ****************************************/
async function login(username, password){
    await load();   // تحميل آخر نسخة من السحابة

    const user = DB.users.find(
        u => u.username === username && u.password === password
    );

    if(user){
        localStorage.setItem("supply_logged_in", "1");
        return true;
    }

    return false;
}

/****************************************
 *  UTIL
 ****************************************/
function $qs(s){ return document.querySelector(s); }

/****************************************
 *  INIT
 ****************************************/
async function init(){

    const path = location.pathname.split("/").pop();

    /************** LOGIN PAGE **************/
    if(path === "index.html" || path === ""){
        const loginForm = $qs("#loginForm");

        if(loginForm){
            loginForm.addEventListener("submit", async e=>{
                e.preventDefault();

                const username = $qs("#username").value.trim();
                const password = $qs("#password").value.trim();

                const ok = await login(username, password);

                if(ok){
                    location.href = "dashboard.html";
                } else {
                    alert("خطأ في اسم المستخدم أو كلمة المرور");
                }
            });
        }

        return;
    }

    /************** PROTECT PAGES **************/
    if(!localStorage.getItem("supply_logged_in")){
        location.href = "index.html";
        return;
    }

    await load(); // تحميل البيانات للصفحات الأخرى

    /************** LOGOUT **************/
    const logout = $qs("#logoutBtn");
    if(logout){
        logout.addEventListener("click", ()=>{
            localStorage.removeItem("supply_logged_in");
            location.href = "index.html";
        });
    }

    /************** PAGE ROUTING **************/
    if(path === "dashboard.html") renderDashboard();
    if(path === "farms.html"){ renderFarms(); setupFarmForm(); }
    if(path === "receivings.html"){ renderReceivings(); setupReceiveForm(); }
    if(path === "trucks.html"){ renderTrucks(); setupTruckForm(); }
    if(path === "shipments.html"){ renderShipments(); setupShipForm(); }
    if(path === "empty.html"){ renderEmptyStock(); setupEmptyForms(); }
    if(path === "pallets.html"){ renderPallets(); setupPalletForms(); }
    if(path === "suppliers.html"){ renderSuppliers(); setupSupplierForm(); }
    if(path === "users.html"){ renderUsers(); setupUserForm(); }
    if(path === "reports.html"){ renderReports(); }
}

document.addEventListener("DOMContentLoaded", init);
