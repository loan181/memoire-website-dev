// Graph
var currentXCat = categories[0];
var currentYCat = categories[1];

window.onload = function() {
    $('#axisXChoice').change(function () {
        currentXCat = $(this).val();
        refreshPlotInformation();
    });

    $('#axisYChoice').change(function () {
        currentYCat = $(this).val();
        refreshPlotInformation();
    });
    addMarkersToCustomAdded();
    refreshPlotInformation();
};

function refreshPlotInformation() {
    modifyTitle(currentXCat + " vs " + currentYCat);
    modifyXAxisName(currentXCat);
    modifyYAxisName(currentYCat);
    resetPlotWithXYData(currentXCat, currentYCat);
    redrawPlot();
}