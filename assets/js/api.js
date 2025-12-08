/****************************************
 *  API URL → Google Script Web App
 ****************************************/
const API_URL = "https://script.google.com/macros/s/AKfycbwfG-HcUV-yl3-aAUmZouwJ8zLlz96d61K7LWOc6CCOwjC6ExX-8mk3CyzXdKgVEV5Eqg/exec";


/****************************************
 *  LOAD DATA FROM GOOGLE DRIVE
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
        console.log("CLOUD LOAD:", json);

        // الملف يحتوي على الداتا داخل array
        return json.length > 0 ? json[0] : null;

    } catch(e){
        console.error("Cloud Load Error:", e);
        return null;
    }
}


/****************************************
 *  SAVE DATA TO GOOGLE DRIVE
 ****************************************/
async function saveToCloud(DB){
    try {
        const res = await fetch(API_URL, {
            method: "POST",
            body: JSON.stringify({
                action: "save",
                type: "SupplySys_DB",
                data: DB
            })
        });

        console.log("CLOUD SAVE:", await res.text());

    } catch(e){
        console.error("Cloud Save Error:", e);
    }
}
