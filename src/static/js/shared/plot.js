
window.PLOTLYENV={'BASE_URL': 'https://plot.ly'};

let graphContainer = document.getElementById('graphContainer');

let resizeDebounce = null;

function resizePlot() {
    let bb = graphContainer.getBoundingClientRect();
    Plotly.relayout(graphContainer, {
        width: bb.width,
        height: bb.height
    });
}


$(window).ready(function () {
    resizePlot();
});

$(window).resize(function() {
    if (resizeDebounce) {
        window.clearTimeout(resizeDebounce);
    }
    resizeDebounce = window.setTimeout(resizePlot, 100);
});

Plotly.plot(graphContainer,  {
    data: figure.data,
    layout: figure.layout,
    frames: figure.frames,
    config: {
        "mapboxAccessToken": "pk.eyJ1IjoiY2hyaWRkeXAiLCJhIjoiY2lxMnVvdm5iMDA4dnhsbTQ5aHJzcGs0MyJ9.X9o_rzNLNesDxdra4neC_A",
        "linkText": "Export to plot.ly",
        "showLink": false,
        "locale" : 'fr'
    }
});
resetPlotWithDefaultData();
redrawPlot();
