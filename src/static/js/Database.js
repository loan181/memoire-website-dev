
// Config is initialised into _include/end.html
let db = firebase.database();

function isLocalHost() {
    return window.location.hostname === "127.0.0.1" || window.location.hostname.includes("localhost");
}

function writeToDb(dicoInfo) {
    if (!isLocalHost()) {
        forceWriteToDb(dicoInfo)
    }
}

function forceWriteToDb(dicoInfo) {
    let logRef = db.ref('logs');
    dicoInfo["TS"] = firebase.database.ServerValue.TIMESTAMP; // Add the timestamp
    logRef.push(dicoInfo);
}