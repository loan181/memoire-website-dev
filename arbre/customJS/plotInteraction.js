
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

function highlightCondition(axis, operation, value) {
    let line = {"type":'line'};
    let rectangleIn =  {"type":'rect', "fillcolor": 'rgb(0, 255, 0)', "opacity" : 0.2, 'line': {'width': 0}};
    let rectangleOut =  {"type":'rect', "fillcolor": 'rgb(255, 0, 0)', "opacity" : 0.2, 'line': {'width': 0}};

    // Green line if inclusive operator ( ==, <= and >= ), red otherwise
    line['line'] = {};
    if (operation === operationType.EQUAL || operation === operationType.GRATER_EQ || operation === operationType.LOWER_EQ) {
        line['line']["color"] = 'rgb(0, 255, 0)';
    } else {
        line['line']["color"] = 'rgb(255, 0, 0)';
    }

    // Determine coordinate of the line
    if (axis === "x") {
        line["x0"] = value; line["x1"] = value;
        line["y0"] = figure.layout.yaxis.range[0];
        line["y1"] = figure.layout.yaxis.range[1];
    } else {
        line["y0"] = value; line["y1"] = value;
        line["x0"] = figure.layout.xaxis.range[0];
        line["x1"] = figure.layout.xaxis.range[1];
    }

    // Determine square coordinate
    // By default they both cover all the graph space
    rectangleIn["x0"] = figure.layout.xaxis.range[0];
    rectangleIn["x1"] = figure.layout.xaxis.range[1];
    rectangleIn["y0"] = figure.layout.yaxis.range[0];
    rectangleIn["y1"] = figure.layout.yaxis.range[1];
    rectangleOut["x0"] = figure.layout.xaxis.range[0];
    rectangleOut["x1"] = figure.layout.xaxis.range[1];
    rectangleOut["y0"] = figure.layout.yaxis.range[0];
    rectangleOut["y1"] = figure.layout.yaxis.range[1];

    // Only inequality operators need to modify with special coordinates
    switch (operation) {
        case operationType.GRATER :
        case operationType.GRATER_EQ:
            if (axis === "x") {
                rectangleIn["x0"] = value;
                rectangleOut["x1"] = value;
            } else {
                rectangleIn["y0"] = value;
                rectangleOut["y1"] = value;
            }
            break;
        case operationType.LOWER :
        case operationType.LOWER_EQ:
            if (axis === "x") {
                rectangleOut["x0"] = value;
                rectangleIn["x1"] = value;
            } else {
                rectangleOut["y0"] = value;
                rectangleIn["y1"] = value;
            }
            break;
    }

    if (operation !== operationType.EQUAL) {
        figure.layout.shapes.push(rectangleIn);
    }
    if (operation !== operationType.NOT_EQUAL) {
        figure.layout.shapes.push(rectangleOut);
    }
    figure.layout.shapes.push(line);
    redrawPlot(); // TODO : regarder si on peut pas juste ajouter avec 'restyle'
}

function unhighlightCondition() {
    figure.layout.shapes = []; // TODO : enlever les figures ajoutés au lieu de tout supprimer
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