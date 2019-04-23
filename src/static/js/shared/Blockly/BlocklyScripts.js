// var blocklyArea = document.getElementById('blocklyArea');
// var blocklyDiv = document.getElementById('blocklyDiv');
// /*
// var workspace = Blockly.inject(blocklyDiv,
//     {
//         toolbox: document.getElementById('toolbox'),
//         zoom:
//             {controls: true,
//                 wheel: true,
//                 startScale: 1.0,
//                 maxScale: 3,
//                 minScale: 0.3,
//                 scaleSpeed: 1.2},
//         trashcan: true,
//         oneBasedIndex: false // Indice commence à 0 (pas à 1)
//     });
//     */
//
// var onresize = function(e) {
//     // Compute the absolute coordinates and dimensions of blocklyArea.
//     var element = blocklyArea;
//     var boundingBox = element.getBoundingClientRect();
//     blocklyDiv.style.left = boundingBox.left + 'px';
//     blocklyDiv.style.top = boundingBox.top + 'px';
//     blocklyDiv.style.width = boundingBox.width + 'px';
//     blocklyDiv.style.height = boundingBox.height + 'px';
//     /*
//     var x = 0;
//     var y = 0;
//     do {
//         x += element.offsetLeft;
//         y += element.offsetTop;
//         element = element.offsetParent;
//     } while (element);
//     // Position blocklyDiv over blocklyArea.
//     blocklyDiv.style.left = x + 'px';
//     blocklyDiv.style.top = y + 'px';
//     blocklyDiv.style.width = blocklyArea.offsetWidth + 'px';
//     blocklyDiv.style.height = blocklyArea.offsetHeight + 'px';
//     */
//     Blockly.svgResize(workspace);
// };

// var workspace = LanguageCode.workspace;

function getWorkspace() {
    return LanguageCode.workspace;
}

function getPredictionCode() {
    var code = "";
    code += getCode();
    // Delete all "print()" call in prediction code
    code = code.replace(/window.alert(.*);/g, "");
    try {
        code += getActivityPredictionCode(); // The activity must override this function
    } catch (e) {
        console.warn("No prediction code have been defined by this activity.\nPlease define the getActivityPredictionCode() function for this activity.");
        console.warn(e);
    }

    return code;
}

function getCode() {
    try {
        getActivityInitCode();
    } catch (e) {
        console.log("No initialisation functions defined for this activity");
    }
    return Blockly.JavaScript.workspaceToCode(getWorkspace());
}


function showCode() {
    // Generate JavaScript code and display it.
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    var code = getCode();
    console.log(code);
    alert(code);
}

function runCode(f) {
    LanguageCode.runJS(f())
}

function runBlocklyCode() {
    runCode(getCode);
}

function runPredictionCode() {
    runCode(getPredictionCode);
}

function exportProject() {
    var xml = Blockly.Xml.workspaceToDom(getWorkspace());
    return Blockly.Xml.domToText(xml);
}

// Function to download data to a file
function download(data, filename, type) {
    var file = new Blob([data], {type: type});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
            url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }
}

function downloadProject() {
    download(exportProject(), "blocklyProject.xml", ".xml")
}

function importProject(xml_text) {
    var xml = Blockly.Xml.textToDom(xml_text);
    Blockly.Xml.domToWorkspace(xml, getWorkspace());
}

function handleFileSelect(evt) {
    var files = evt.target.files; // FileList object

    // use the 1st file from the list
    var f = files[0];

    var reader = new FileReader();

    // Closure to capture the file information.
    reader.onload = (function(theFile) {
        return function(e) {
            try {
                importProject(e.target.result);
            }
            catch (err) {
                alert("Une erreur innatendu est survenue au chargement du projet :\n" + err.message);
            }
        };
    })(f);

    // Read in the file as a data URL.
    reader.readAsText(f);
}
document.getElementById("upload_project").addEventListener('change', handleFileSelect, false);

function getSvgOfCanva() { // Source : https://gist.github.com/thomasdenney/aa76acb36d47120ee338b3bd96459556
    /*
    I've only tested this with http://codethemicrobit.com in Chrome, but it should work in other browsers
    Paste the JS below into the Chrome Developer Tools Console and hit enter
    It will then open the generated PNG file in a new tab, from where it can be copied/saved
    Based on https://gist.github.com/acbart/dcda677555e97b59c1c91554270dc80b, with adaptations for styling
    and output format
    */

    //Any modifications are executed on a deep copy of the element
    var cp = Blockly.mainWorkspace.svgBlockCanvas_.cloneNode(true);
    cp.removeAttribute("width");
    cp.removeAttribute("height");
    cp.removeAttribute("transform");

    //It is important to create this element in the SVG namespace rather than the XHTML namespace
    var styleElem = document.createElementNS("http://www.w3.org/2000/svg", "style");
    //I've manually pasted codethemicrobit.com's CSS for blocks in here, but that can be removed as necessary
    styleElem.textContent = Blockly.Css.CONTENT.join('') + ".blocklyPathLight { fill: none;stroke-linecap: round;stroke-width: 1;}.blocklyText { cursor:default;fill: #fff;font-family: sans-serif;font-size: 11pt;}.blocklyNonEditableText>text {pointer-events: none;}.blocklyNonEditableText>rect,.blocklyEditableText>rect {fill: #fff;fill-opacity: .6;}.blocklyNonEditableText>text,.blocklyEditableText>text {fill: #000;}.blocklyIconGroup,.blocklyIconGroupReadonly {opacity: .6;}.blocklyIconShape {fill: #00f;stroke: #fff;stroke-width: 1px;}.blocklyIconSymbol {fill: #fff;}";//".blocklyToolboxDiv {background: rgba(0, 0, 0, 0.05);}.blocklyMainBackground {stroke:none !important;}.blocklyTreeLabel, .blocklyText, .blocklyHtmlInput {font-family:'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace !important;}.blocklyText { font-size:1rem !important;}.rtl .blocklyText {text-align:right;} .blocklyTreeLabel { font-size:1.25rem !important;} .blocklyCheckbox {fill: #ff3030 !important;text-shadow: 0px 0px 6px #f00;font-size: 17pt !important;}";
    cp.insertBefore(styleElem, cp.firstChild);

    //Creates a complete SVG document with the correct bounds (it is necessary to get the viewbox right, in the case of negative offsets)
    var xml = new XMLSerializer().serializeToString(cp);
    var bbox = Blockly.mainWorkspace.svgBlockCanvas_.getBBox();
    xml = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="' + bbox.width + '" height="' + bbox.height + '" viewBox="' + bbox.x + ' ' + bbox.y + ' ' + bbox.width + ' ' + bbox.height + '"><rect width="100%" height="100%" fill="white"></rect>' + xml + '</svg>';
    //If you just want the SVG then do console.log(xml)
    //Otherwise we render as an image and export to PNG
    return xml;
}

function downloadSvg() {
    download(getSvgOfCanva(), "blocklyProjectImg.svg", ".svg");
}

function convertSvgToPng() {
    //By default the image will be rendered at the same resolution as your display, but if you increase
    //this value you can render a much higher resolution image, which looks better on high density displays
    var scaleFactor = 1;

    var xml = getSvgOfCanva();
    var bbox = Blockly.mainWorkspace.svgBlockCanvas_.getBBox();
    var svgBase64 = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(xml)));
    var img = document.createElement('img');
    img.src = svgBase64;

    var canvas = document.createElement("canvas");
    canvas.width = Math.ceil(bbox.width) * scaleFactor;
    canvas.height = Math.ceil(bbox.height) * scaleFactor;
    var ctx = canvas.getContext('2d');
    ctx.scale(scaleFactor, scaleFactor);

    //Might need to be in img.onload(function() {...}) in other browsers
    img.onload = function() {
        ctx.drawImage( img, 0, 0 );

        var image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");

        var dl = document.createElement("a");
        dl.download = "blocklyProjectImg.png";
        dl.href = image;
        dl.click();
    };


    //Opens the PNG image in a new tab for copying/saving
    //console.log(canvas.toDataURL());
    //download(canvas.toDataURL(), "pic.png", ".png");

    //download(image, "blocklyProjectImg.png", ".png");
    //var newTab = window.open();//(canvas.toDataURL(), '_blank');
    //newTab.document.body.innerHTML = '<img src="' + canvas.toDataURL() + '">';
}