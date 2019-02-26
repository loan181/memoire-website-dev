
// Config is initialised into _include/end.html
let db = firebase.database();

function isLocalHost() {
    return window.location.hostname === "127.0.0.1" || window.location.hostname.includes("localhost");
}

function getGoogleAnalyticsClientID() {
    try {
        return ga.getAll()[0].get('clientId');
    }
    catch (e) {
        // May happen when the browser block cookies for instance
        console.warn("Error while retrieving Client ID");
        return -1;
    }
}

function writeToDb(dicoInfo) {
    if (!isLocalHost()) {
        forceWriteToDb(dicoInfo)
    }
}

function addExtraInformation(dicoInfo) {
    dicoInfo["TS"] = firebase.database.ServerValue.TIMESTAMP; // Add the timestamp
    dicoInfo["userID"] = getGoogleAnalyticsClientID(); // Add the user id
}

function forceWriteToDb(dicoInfo) {
    let logRef = db.ref('logs');
    addExtraInformation(dicoInfo);
    logRef.push(dicoInfo);
}

function logExercice(algo, exercice, answers, feedbacks, value) {
    if (!isLocalHost()) {
        let dicoInfo = {"algo":algo, "exercice":exercice, "answers":answers, "answers_feedbacks":feedbacks};
        let logRef = db.ref('exercices');
        addExtraInformation(dicoInfo);
        logRef.push(dicoInfo);

        gtag('event', 'attempt exercice', {
            'event_category': algo,
            'event_label': exercice,
            'value': value});
    }
}

function logActivityProgression(activity, value) {
    if (!isLocalHost()) {
        let dicoInfo = {"algo":activity, "value":value};
        let logRef = db.ref('activity');
        addExtraInformation(dicoInfo);
        logRef.push(dicoInfo);

        gtag('event', 'attempt', {
            'event_category': "Activity",
            'event_label': activity,
            'value': value});
    }
}