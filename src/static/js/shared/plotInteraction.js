
function resetAllDatas() {
    for (let i = 0; i < 3; i++) {
        figure.data[i].x = [];
        figure.data[i].y = [];
    }
}

function resetPlotWithDefaultData() {
    resetPlotWithXYData(currentXCat, currentYCat);
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