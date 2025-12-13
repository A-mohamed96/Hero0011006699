/****************************************
 *  FIREBASE CONFIG
 ****************************************/
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getDatabase,
  ref,
  get,
  set
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

/****************************************
 *  🔴 عدّل القيم دي من Firebase Console
 ****************************************/
const firebaseConfig = {
  apiKey: "API_KEY",
  authDomain: "PROJECT_ID.firebaseapp.com",
  databaseURL: "https://PROJECT_ID-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "PROJECT_ID",
  storageBucket: "PROJECT_ID.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID"
};

/****************************************
 *  INIT
 ****************************************/
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const DB_REF = ref(db, "SupplySys_DB");

/****************************************
 *  LOAD DB
 ****************************************/
async function loadDB(){
  try{
    const snap = await get(DB_REF);
    if(snap.exists()){
      console.log("DB LOADED", snap.val());
      return snap.val();
    }
    return null;
  }catch(e){
    console.error("LOAD ERROR", e);
    return null;
  }
}

/****************************************
 *  SAVE DB
 ****************************************/
async function saveDB(DB){
  try{
    await set(DB_REF, DB);
    console.log("DB SAVED");
  }catch(e){
    console.error("SAVE ERROR", e);
  }
}

/****************************************
 *  EXPOSE
 ****************************************/
window.loadDB = loadDB;
window.saveDB = saveDB;
