/****************************************
 *  API URL → Google Script Web App
 ****************************************/
const API_URL = "https://script.google.com/macros/s/AKfycbwEzBEhgp2C9ZdFEL2oCqZYCm4v1wOlLg2c7vMMSy_b7N9FBWY_8K_C0onnGYBvf8WKAA/exec";

/****************************************
 *  CLOUD: LOAD DATA
 ****************************************/
async function loadFromCloud(){
    try {
        const res = await fetch(API_URL, {
            method: "POST",
            body: JSON.stringify({
                action: "list",
                type: "SupplySys_DB"
            })
        });

        const json = await res.json();
        console.log("CLOUD LOADED:", json);

        return json.length ? json[0] : null;

    } catch(e){
        console.error("Cloud Load Error:", e);
        return null;
    }
}

/****************************************
 *  CLOUD: SAVE DATA
 ****************************************/
async function saveToCloud(DB){
    try {
        await fetch(API_URL, {
            method: "POST",
            body: JSON.stringify({
                action: "save",
                type: "SupplySys_DB",
                data: DB
            })
        });
        console.log("CLOUD SAVED");
    } catch(e){
        console.error("Cloud Save Error:", e);
    }
}

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
 *  ALWAYS LOAD FROM CLOUD FIRST
 ****************************************/
async function load(){
    const cloudData = await loadFromCloud();

    if(cloudData){
        Object.assign(DB, cloudData);
        console.log("DB Loaded From Cloud");
    } else {
        console.warn("NO CLOUD DATA FOUND");
    }
}

function save(){
    saveToCloud(DB);
}

/****************************************
 *  LOGIN FUNCTION
 ****************************************/
async function login(username, password){
    await load(); // ensure DB is loaded

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
 *  UTILITY
 ****************************************/
function $qs(s){ return document.querySelector(s); }

/****************************************
 *  INIT
 ****************************************/
async function init(){
    await load();

    const path = location.pathname.split("/").pop();

    /* ------------------ LOGIN PAGE ------------------ */
    if(path === "index.html"){
        const loginForm = $qs("#loginForm");

        if(loginForm){
            loginForm.addEventListener("submit", async e=>{
                e.preventDefault();

                const user = $qs("#username").value.trim();
                const pass = $qs("#password").value.trim();

                const ok = await login(user, pass);

                if(ok){
                    location.href = "dashboard.html";
                } else {
                    alert("خطأ في اسم المستخدم أو كلمة المرور");
                }
            });
        }

        return;
    }

    /* ------------------ PROTECTED PAGES ------------------ */
    if(!localStorage.getItem("supply_logged_in")){
        location.href = "index.html";
        return;
    }

    /* LOGOUT */
    const logout = $qs("#logoutBtn");
    if(logout){
        logout.addEventListener("click", ()=>{
            localStorage.removeItem("supply_logged_in");
        });
    }

    /* PAGE ROUTING */
    if(path === "dashboard.html") renderDashboard();
}

document.addEventListener("DOMContentLoaded", init);
