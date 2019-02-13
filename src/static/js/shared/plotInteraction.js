
function resetAllDatas() {
    for (let i = 0; i < 3; i++) {
        figure.data[i].x = [];
        figure.data[i].y = [];
    }
}

function resetPlotWithDefaultData() {
    resetPlotWithXYData(currentXCat, currentYCat);
    redrawPlot();
}

function resetPlotWithXYData(axisX, axisY) {
    resetAllDatas();
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 40; j++) {
            let correspondingFlower = trainingSet[i*40 + j];
            figure.data[i].x[j] = correspondingFlower.get(axisX);
            figure.data[i].y[j] = correspondingFlower.get(axisY);
        }
    }
    redrawPlot();
}

function modifyTitle(newName) {
    // figure.layout.title.text = newName // Ne fonctionne pas :(
    Plotly.relayout(graphContainer, {title:newName})
}

function modifyXAxisName(newName) {
    figure.layout.xaxis.title.text = newName
}

function modifyYAxisName(newName) {
    figure.layout.yaxis.title.text = newName
}


// TODO : need BIG global refactoring, cald too often in intermediate function.
//  En gros ça serait cool de l'appeler explicitement à la fin des gros changements sur figure, au lieu de l'appeller à la fin des fonctions intermédiaire
//  Par exemple dans BinaryTree.Node.hover ou on devrait appeller le redraw explicitement à la fin au lieu de redraw 14x avec les fonctions intermédiaire
function redrawPlot() {
    Plotly.redraw("graphContainer");
}
/*
// KNN specific function
function addMarkersToCustomAdded() {
    figure.data.push(
        {
            "marker": {
                "color": "#23beaa",
                "line": {
                    "color": "#187c6f",
                    "width": 0.5
                },
                "size": 12,
                "symbol" : "x"
            },
            "mode": "markers",
            "y": [],
            "x": [],
            "type": "scatter",
            "name": "ajouté"
        }
    );
}

function deletedAllAddedMarkers() {
    figure.data[3].x = [];
    figure.data[3].y = [];
}

function addCustomMarker(x, y) {
    figure.data[3].x.push(x);
    figure.data[3].y.push(y);
}

// Decision Tree specific function
function drawPointsIndex(listOfMarkersIndex) {
    resetAllDatas();
    for (let i = 0; i < listOfMarkersIndex.length; i++) {
        let markerIdx = listOfMarkersIndex[i];
        let correspondingFlower = trainingSet[markerIdx];
        let correspondingDataIdx = Math.floor(markerIdx / 40);
        figure.data[correspondingDataIdx].x.push(correspondingFlower.get("petal width"));
        figure.data[correspondingDataIdx].y.push(correspondingFlower.get("petal length"));
    }
    redrawPlot();
}

function highlightCondition(axis, operation, value) {
    let line = {"type":'line'};
    let rectangleIn =  {"type":'rect', "fillcolor": 'rgb(0, 255, 0)', "opacity" : 0.1, 'line': {'width': 0}};
    let rectangleOut =  {"type":'rect', "fillcolor": 'rgb(255, 0, 0)', "opacity" : 0.1, 'line': {'width': 0}};

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

function highlightMarkerCondition(indexesOut, indexesIn) {

    // Need to add *2 more datas to stored (car on risque d'avoir à la fois les in et les out), ils ont chacun leur ligne de contour de couleur différent
    resetAllDatas(); // reset before duplicate
    for (let i = 0; i < 3; i++) {
        figure.data[i+3] = jQuery.extend(true, {}, figure.data[i]); // deepcopy
        figure.data[i+3].uid += "2";
    }
    for (let i = 0; i < 3; i++) {
        figure.data[i].name += " out";
        figure.data[i].marker.line = {
            color: 'rgb(255, 0, 0)',
            width: 1
        };

        figure.data[i+3].name += " in";
        figure.data[i+3].marker.line = {
            color: 'rgb(0, 255, 0)',
            width: 1
        };

    }

    for (let i = 0; i < indexesOut.length; i++) {
        let markerIdx = indexesOut[i];
        let correspondingFlower = trainingSet[markerIdx];
        let correspondingDataIdx =  Math.floor(markerIdx / 40);
        figure.data[correspondingDataIdx].x.push(correspondingFlower.get("petal width"));
        figure.data[correspondingDataIdx].y.push(correspondingFlower.get("petal length"));
    }

    for (let i = 0; i < indexesIn.length; i++) {
        let markerIdx = indexesIn[i];
        let correspondingFlower = trainingSet[markerIdx];
        let correspondingDataIdx =  Math.floor(markerIdx / 40);
        figure.data[correspondingDataIdx+3].x.push(correspondingFlower.get("petal width"));
        figure.data[correspondingDataIdx+3].y.push(correspondingFlower.get("petal length"));
    }

    redrawPlot();
}

function unhighlightMarkerCondition() {
    for (let i = 0; i < 3; i++) {
        figure.data.pop();
        figure.data[i].name = figure.data[i].name.slice(0, figure.data[i].name.length -4); // Get rid of " out"
    }
}

function unHighlightAllMarkers() {
    for (let i = 0; i < 3; i++) {
        figure.data[i].marker.line = {};
    }
}
*/