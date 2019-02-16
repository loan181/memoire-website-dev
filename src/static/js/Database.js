
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

function logExercice(algo, exercice, answers, feedbacks) {
    if (!isLocalHost()) {
        let dicoInfo = {"algo":algo, "exercice":exercice, "answers":answers, "answers_feedbacks":feedbacks};
        let logRef = db.ref('exercices');
        dicoInfo["TS"] = firebase.database.ServerValue.TIMESTAMP; // Add the timestamp
        logRef.push(dicoInfo);
    }
}