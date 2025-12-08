/****************************************
 *  API URL → Google Script Web App
 ****************************************/
const API_URL = "https://script.google.com/macros/s/AKfycbwfG-HcUV-yl3-aAUmZouwJ8zLlz96d61K7LWOc6CCOwjC6ExX-8mk3CyzXdKgVEV5Eqg/exec";

/************************************
 *  LOAD DB FROM CLOUD
 ************************************/
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

        console.log("CLOUD DB LOADED:", json);

        return json;
    }
    catch(err){
        console.error("LOAD ERROR:", err);
        return null;
    }
}

/************************************
 *  SAVE DB TO CLOUD
 ************************************/
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

        console.log("CLOUD DB SAVED");
    }
    catch(err){
        console.error("SAVE ERROR:", err);
    }
}
