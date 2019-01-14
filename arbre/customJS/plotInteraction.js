
function resetAllDatas() {
    for (let i = 0; i < 3; i++) {
        figure.data[i].x = [];
        figure.data[i].y = [];
    }
}

function resetPlotWithDefaultData() {
    resetAllDatas();
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 40; j++) {
            let correspondingFlower = trainingSet[i*40 + j];
            figure.data[i].x[j] = correspondingFlower.get("petal width");
            figure.data[i].y[j] = correspondingFlower.get("petal length");
        }
    }
    redrawPlot();
}

function drawPointsIndex(listOfMarkersIndex) {
    resetAllDatas();
    for (let i = 0; i < listOfMarkersIndex.length; i++) {
        let markerIdx = listOfMarkersIndex[i];
        let correspondingFlower = trainingSet[markerIdx];
        let correspondingDataIdx =  Math.floor(markerIdx / 40);
        figure.data[correspondingDataIdx].x.push(correspondingFlower.get("petal width"));
        figure.data[correspondingDataIdx].y.push(correspondingFlower.get("petal length"));
    }
    redrawPlot();
}

function highlightAllMarkers() {
    for (let i = 0; i < 3; i++) {
        figure.data[i].marker.line = {
            color: 'rgb(255, 255, 0)',
            width: 1
        };
    }
}

function unHighlightAllMarkers() {
    for (let i = 0; i < 3; i++) {
        figure.data[i].marker.line = {};
    }
}

function redrawPlot() {
    Plotly.redraw("graphContainer");
}