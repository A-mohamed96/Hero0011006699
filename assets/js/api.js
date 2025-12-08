/****************************************
 *  API URL → Google Script Web App
 ****************************************/
const API_URL =
"https://script.google.com/macros/s/AKfycbxr5WUrR7SlDoGU076usU73fIWd3EIH5GN6wwl3Cs2rCVCC4qfpqfTlH8uhXPilSCwgeQ/exec";

/****************************************
 *  LOAD DB FROM CLOUD (Supports array or object)
 ****************************************/
async function loadDB(){
    try{
        const res = await fetch(API_URL, {
            method: "POST",
            body: JSON.stringify({
                action: "list",
                type: "SupplySys_DB"
            })
        });

        const json = await res.json();

        console.log("CLOUD RESULT:", json);

        if(Array.isArray(json)){
            return json.length ? json[0] : null;
        }
        return json;
    }
    catch(err){
        console.error("LOAD ERROR:", err);
        return null;
    }
}

/****************************************
 *  SAVE DB TO CLOUD
 ****************************************/
async function saveDB(DB){
    try{
        await fetch(API_URL, {
            method: "POST",
            body: JSON.stringify({
                action: "save",
                type: "SupplySys_DB",
                data: DB
            })
        });

        console.log("CLOUD SAVED");
    }
    catch(err){
        console.error("SAVE ERROR:", err);
    }
}

/****************************************
 *  MAKE FUNCTIONS AVAILABLE TO app.js
 ****************************************/
window.loadDB = loadDB;
window.saveDB = saveDB;
