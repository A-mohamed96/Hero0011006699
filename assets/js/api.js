/****************************************
 *  API URL → Google Script Web App
 ****************************************/
const API_URL =
"https://script.google.com/macros/s/AKfycbyC5I2Tno9w-wy4XXx9Wx5ivh1pf3svWCgX8xZHpos9-tDIuvU50ZB8jKmMGncVjZ-1Eg/exec";

/****************************************
 *  LOAD DB FROM CLOUD
 ****************************************/
async function loadDB(){
    try{
        const res = await fetch(API_URL, {
            method: "POST",
            body: JSON.stringify({
                action: "list"   // فقط "list"
            })
        });

        const json = await res.json();
        console.log("CLOUD RESULT:", json);

        return json || null;
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
                action: "save", // فقط "save"
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
 *  MAKE FUNCTIONS AVAILABLE
 ****************************************/
window.loadDB = loadDB;
window.saveDB = saveDB;
