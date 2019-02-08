// Graph
var currentXCat = categories[0];
var currentYCat = categories[1];

var options;

window.onload = function() {
    options = {
        animationEnabled: true,
        animationDuration: 200,
        title: {
            text: "default"
        },
        axisX: {
            title: currentXCat
        },
        axisY: {
            title: currentYCat
        },
        legend: {
            cursor: "pointer",
            itemclick: toggleDataSeries
        },
        toolTip: {
            contentFormatter: function (e) {
                var firstEntry = e.entries[0];
                var firstEntryPoint = firstEntry.dataPoint;
                var firstEntrySerie = firstEntry.dataSeries;
                var ret = "<span style='color: " + firstEntrySerie.color + ";'>" + firstEntrySerie.name + "</span><br>"
                    + currentXCat + " : " + firstEntryPoint.x + "<br>"
                    + currentYCat + " : " + firstEntryPoint.y;
                return ret;
            }
        },
        // datas will be initialise just after dynamically
        data: []
    };

    // Init all the datas
    var markersType = ["circle", "triangle", "square", "cross"];
    for (var i = 0; i < 4; i++) {
        var curData = {};
        curData.type = "scatter";

        curData.showInLegend = true;
        curData.markerType = markersType[i];
        curData.dataPoints = [];
        if (i !== 3) {
            curData.name = flowerName[i];
            for (var j = 0; j < 40; j++) {
                curData.dataPoints.push({x: 0, y: 0}); // We start by pushing 50 init points, they will be accurate afterward
            }
        } else {
            curData.name = "ajouté";
        }
        options.data.push(curData);
    }

    function toggleDataSeries(e) {
        if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
            e.dataSeries.visible = false;
        } else {
            e.dataSeries.visible = true;
        }
        e.chart.render();
    }


    $('#axisXChoice').change(function () {
        currentXCat = $(this).val();
        refreshGraph();
    });

    $('#axisYChoice').change(function () {
        currentYCat = $(this).val();
        refreshGraph();
    });
    addMarkersToCustomAdded()
    refreshGraph();
};

function refreshGraph() {
    refreshPlot();

    options.title.text = currentXCat + " vs " + currentYCat;
    options.axisX.title = currentXCat;
    options.axisY.title = currentYCat;

    let trainingSet = getTrainingSet();
    for (let i = 0; i < trainingSet.length; i++) {
        let currentFlower = trainingSet[i];
        let flowerIndex = flowerName.indexOf(currentFlower.get("name"));
        options.data[flowerIndex].dataPoints[i%40]["x"] = currentFlower.get(currentXCat);
        options.data[flowerIndex].dataPoints[i%40]["y"] = currentFlower.get(currentYCat);
    }
    // Refresh the 50 points values to their accurate axis
    // for (var i = 0; i < 3; i++) {
    //     for (var j = 0; j < 50; j++) {
    //         options.data[i].dataPoints[j]["x"] = dataJson[i][currentXCat][j];
    //         options.data[i].dataPoints[j]["y"] = dataJson[i][currentYCat][j];
    //     }
    // }
    $("#chartContainer").CanvasJSChart(options); // Refresh graph
}

function refreshPlot() {
    modifyTitle(currentXCat + " vs " + currentYCat);
    modifyXAxisName(currentXCat);
    modifyYAxisName(currentYCat);
    resetPlotWithXYData(currentXCat, currentYCat);
    redrawPlot();
}

function deleteAddedMarkers() {
    deletedAllAddedMarkers();
    if ( options.data[3].dataPoints.length !== 0) {
        options.data[3].dataPoints = [];
        refreshGraph();
    }
}