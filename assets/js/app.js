
const API_URL = "https://script.google.com/macros/s/AKfycbwfG-HcUV-yl3-aAUmZouwJ8zLlz96d61K7LWOc6CCOwjC6ExX-8mk3CyzXdKgVEV5Eqg/exec";

async function loadFromCloud(){
    try {
        const res = await fetch(API_URL, {
            method: "POST",
            body: JSON.stringify({ action:"list", type:"SupplySys_DB" })
        });
        const json = await res.json();
        return json.length ? json[0] : null;
    } catch(e){ console.error(e); return null; }
}

async function saveToCloud(DB){
    try {
        await fetch(API_URL,{
            method:"POST",
            body: JSON.stringify({ action:"save", type:"SupplySys_DB", data:DB })
        });
    } catch(e){ console.error(e); }
}

const DB = {
    farms:[], receivings:[], trucks:[], shipments:[],
    suppliers:[], empty_items:[
        {id:'branik',name:'برانيك'},
        {id:'karton',name:'كرتون'},
        {id:'bant',name:'بانت'},
        {id:'pallet',name:'بلتات خشب'}
    ],
    empty_receivings:[], empty_issues:[],
    pallet_receivings:[], pallet_returns:[],
    users:[]
};

async function load(){
    const cloud = await loadFromCloud();
    if(cloud) Object.assign(DB, cloud);
}

function save(){ saveToCloud(DB); }

function $qs(s){ return document.querySelector(s); }

async function init(){
    await load();
    const path = location.pathname.split('/').pop();
    if(path==="index.html"){
        const login=$qs("#loginForm");
        if(login){
            login.addEventListener("submit",e=>{
                e.preventDefault();
                localStorage.setItem("supply_logged_in","1");
                location.href="dashboard.html";
            });
        }
        return;
    }
    if(!localStorage.getItem("supply_logged_in")){ location.href="index.html"; return; }

    const logout=$qs("#logoutBtn");
    if(logout){ logout.addEventListener("click",()=>localStorage.removeItem("supply_logged_in")); }

    if(path==="dashboard.html") renderDashboard();
}

document.addEventListener("DOMContentLoaded",init);
