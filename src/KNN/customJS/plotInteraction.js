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

function deleteAddedMarkers() {
    deletedAllAddedMarkers();
    redrawPlot();
}