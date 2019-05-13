// Graph
var currentXCat = categories[0];
var currentYCat = categories[1];

window.onload = function() {
    $('#axisXChoice').change(function () {
        currentXCat = $(this).val();
        try {
            afterXChange();
        } catch(e) {}
        refreshPlotInformation();
    });

    $('#axisYChoice').change(function () {
        currentYCat = $(this).val();
        try {
            afterYChange();
        } catch(e) {}
        refreshPlotInformation();
    });
    refreshPlotInformation();
    try {
        afterPlotFirstDraw();
    } catch(e) {}
};

function translation(originalList, translationList, word) {
    return translationList[originalList.indexOf(word)];
}

function frenchTranslationCat(word) {
    return translation(categories, categoriesFR, word);
}

function refreshPlotInformation() {
    modifyTitle(frenchTranslationCat(currentXCat) + " vs " + frenchTranslationCat(currentYCat));
    modifyXAxisName(frenchTranslationCat(currentXCat));
    modifyYAxisName(frenchTranslationCat(currentYCat));
    resetPlotWithXYData(currentXCat, currentYCat);
    redrawPlot();
}