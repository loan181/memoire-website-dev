//Source : http://myselph.de/neuralNet.html


// some of the code below was taken from a stackoverflow flag I cannot find anymore, and adapted to my needs.
// Thanks a ton to the original author!
var canvasDraw;
var canvasDrawCtx;

var prevX = 0;
var currX = 0;
var prevY = 0;
var currY = 0;
var paths = []; // recording paths
var paintFlag = false;
var color = "black";
var lineWidth = 20;

var clearBeforeDraw = false; // controls whether canvas will be cleared on next mousedown event. Set to true after digit recognition

var nnInput;
var w12;
var w23;
var data;
var out2;
var out3;
var output;

function resetNNInput() {
    nnInput = Array(784).fill(null);
}
resetNNInput();

function resetW12() {
    w12 = JSON.parse(JSON.stringify(w12Orig));
}

function resetW23() {
    w23 = JSON.parse(JSON.stringify(w23Orig));
}
resetW12();
resetW23();

//neural net with one hidden layer; sigmoid for hidden, softmax for output
function nn(dataPic, w12, bias2, w23, bias3) {
    data = dataPic;
    // just some incomplete sanity checks to find the most obvious errors
    if (!Array.isArray(data) || data.length === 0 ||
        !Array.isArray(w12) || w12.length === 0 || !Array.isArray(w12[0]) || data.length !== w12[0].length || !Array.isArray(bias2) || bias2.length !== w12.length ||
        !Array.isArray(w23) || w23.length === 0 || !Array.isArray(w23[0]) || w12.length !== w23[0].length || !Array.isArray(bias3) || bias3.length !== w23.length) {
        console.error('nn(): invalid parameters');
        console.log('d: '+data.length+', w12: '+w12.length+', w12[0]: '+w12[0].length+', bias2: '+bias2.length+
            ', w23: '+w23.length+', w23[0]: '+w23[0].length+', bias3: '+bias3.length);
        return undefined;
    }

    // Check if all entry neurons values are defined
    for (let i = 0; i < dataPic.length; i++) {
        if (dataPic[i] === null) {
            throw `Impossible de calculer la valeur des neurones de la couche cachée. Le neurone de la couche d'entrée n°${i+1} n'a pas de valeur !`;
        }
    }
    var t1 = new Date();

    // compute layer2 output
    out2 = [];
    for (var i=0; i<w12.length; i++) {
        out2[i] = bias2[i];
        for (var j=0; j<w12[i].length; j++) {
            out2[i] += data[j] * w12[i][j];
        }
        out2[i] = 1 / (1 + Math.exp(-out2[i]));
    }
    //compute layer3 activation
    out3 = [];
    for (var i=0; i<w23.length; i++) {
        out3[i] = bias3[i];
        for (var j=0; j<w23[i].length; j++) {
            out3[i] += out2[j] * w23[i][j];
        }
    }
    // compute layer3 output (softmax)
    var max3 = out3.reduce(function(p,c) { return p>c ? p : c; });
    var nominators = out3.map(function(e) { return Math.exp(e - max3); });
    var denominator = nominators.reduce(function (p, c) { return p + c; });
    output = nominators.map(function(e) { return e / denominator; });

    // timing measurement
    var dt = new Date() - t1; console.log('NN time: '+dt+'ms');

    return output;
}

// computes center of mass of digit, for centering
// note 1 stands for black (0 white) so we have to invert.
function centerImage(img) {
    var meanX = 0;
    var meanY = 0;
    var rows = img.length;
    var columns = img[0].length;
    var sumPixels = 0;
    for (var y = 0; y < rows; y++) {
        for (var x = 0; x < columns; x++) {
            var pixel = (1 - img[y][x]);
            sumPixels += pixel;
            meanY += y * pixel;
            meanX += x * pixel;
        }
    }
    meanX /= sumPixels;
    meanY /= sumPixels;

    var dY = Math.round(rows/2 - meanY);
    var dX = Math.round(columns/2 - meanX);
    return {transX: dX, transY: dY};
}

// given grayscale image, find bounding rectangle of digit defined
// by above-threshold surrounding
function getBoundingRectangle(img, threshold) {
    var rows = img.length;
    var columns = img[0].length;
    var minX=columns;
    var minY=rows;
    var maxX=-1;
    var maxY=-1;
    for (var y = 0; y < rows; y++) {
        for (var x = 0; x < columns; x++) {
            if (img[y][x] < threshold) {
                if (minX > x) minX = x;
                if (maxX < x) maxX = x;
                if (minY > y) minY = y;
                if (maxY < y) maxY = y;
            }
        }
    }
    return { minY: minY, minX: minX, maxY: maxY, maxX: maxX};
}

// take canvas image and convert to grayscale. Mainly because my
// own functions operate easier on grayscale, but some stuff like
// resizing and translating is better done with the canvas functions
function imageDataToGrayscale(imgData) {
    var grayscaleImg = [];
    for (var y = 0; y < imgData.height; y++) {
        grayscaleImg[y]=[];
        for (var x = 0; x < imgData.width; x++) {
            var offset = y * 4 * imgData.width + 4 * x;
            var alpha = imgData.data[offset+3];
            // weird: when painting with stroke, alpha == 0 means white;
            // alpha > 0 is a grayscale value; in that case I simply take the R value
            if (alpha == 0) {
                imgData.data[offset] = 255;
                imgData.data[offset+1] = 255;
                imgData.data[offset+2] = 255;
            }
            imgData.data[offset+3] = 255;
            // simply take red channel value. Not correct, but works for
            // black or white images.
            grayscaleImg[y][x] = imgData.data[y*4*imgData.width + x*4 + 0] / 255;
        }
    }
    return grayscaleImg;
}

function getCanvaPictureToArray() {
    // convert RGBA image to a grayscale array, then compute bounding rectangle and center of mass
    var imgData = canvasDrawCtx.getImageData(0, 0, 280, 280);
    grayscaleImg = imageDataToGrayscale(imgData);
    var boundingRectangle = getBoundingRectangle(grayscaleImg, 0.01);
    var trans = centerImage(grayscaleImg); // [dX, dY] to center of mass

    // copy image to hidden canvas, translate to center-of-mass, then
    // scale to fit into a 200x200 box (see MNIST calibration notes on
    // Yann LeCun's website)
    var canvasCopy = document.createElement("canvas");
    canvasCopy.width = imgData.width;
    canvasCopy.height = imgData.height;
    var copyCtx = canvasCopy.getContext("2d");
    var brW = boundingRectangle.maxX+1-boundingRectangle.minX;
    var brH = boundingRectangle.maxY+1-boundingRectangle.minY;
    var scaling = 190 / (brW>brH?brW:brH);
    // scale
    copyCtx.translate(canvasDraw.width/2, canvasDraw.height/2);
    copyCtx.scale(scaling, scaling);
    copyCtx.translate(-canvasDraw.width/2, -canvasDraw.height/2);
    // translate to center of mass
    copyCtx.translate(trans.transX, trans.transY);

    if (document.getElementById('scaleStrokeWidth').checked == true) {
        // redraw the image with a scaled lineWidth first.
        // not this is a bit buggy; the bounding box we computed above (which contributed to "scaling") is not valid anymore because
        // the line width has changed. This is mostly a problem for extreme cases (very small digits) where the rescaled digit will
        // be smaller than the bounding box. I could change this but it'd screw up the code.
        for (var p = 0; p < paths.length; p++) {
            for (var i = 0; i < paths[p][0].length - 1; i++) {
                var x1 = paths[p][0][i];
                var y1 = paths[p][1][i];
                var x2 = paths[p][0][i+1];
                var y2 = paths[p][1][i+1];
                draw(copyCtx, color, lineWidth / scaling, x1, y1, x2, y2);
            }
        }
    } else {
        // default take image from original canvas
        copyCtx.drawImage(canvasDrawCtx.canvas, 0, 0);
    }



    // now bin image into 10x10 blocks (giving a 28x28 image)
    let ret = processPicture(copyCtx).flat();

    // for visualization/debugging: paint the input to the neural net.
    if (document.getElementById('preprocessing').checked === true) {
        canvasDrawCtx.clearRect(0, 0, canvasDraw.width, canvasDraw.height);
        canvasDrawCtx.drawImage(copyCtx.canvas, 0, 0);
        for (var y = 0; y < 28; y++) {
            for (var x = 0; x < 28; x++) {
                var block = canvasDrawCtx.getImageData(x * 10, y * 10, 10, 10);
                var newVal = 255 * (0.5 - ret[x*28+y]/2);
                for (var i = 0; i < 4 * 10 * 10; i+=4) {
                    block.data[i] = newVal;
                    block.data[i+1] = newVal;
                    block.data[i+2] = newVal;
                    block.data[i+3] = 255;
                }
                canvasDrawCtx.putImageData(block, x * 10, y * 10);
            }
        }
    }

    return ret;
}

// takes the image in the canvas, centers & resizes it, then puts into 10x10 px bins
// to give a 28x28 grayscale image; then, computes class probability via neural network
function recognize() {
    var t1 = new Date();

    nnInput = getCanvaPictureToArray();

    //for copy & pasting the digit into matlab
    //document.getElementById('nnInput').innerHTML=JSON.stringify(nnInput)+';<br><br><br><br>';
    var maxIndex = 0;
    var nnOutput = nn(nnInput, w12, bias2, w23, bias3);
    console.log(nnOutput);
    nnOutput.reduce(function(p,c,i){if(p<c) {maxIndex=i; return c;} else return p;});
    console.log('maxIndex: '+maxIndex);
    refreshNetworkRepresentation(maxIndex);
    // Update bar to reflect each percentage
    for (let i = 0; i < 10; i++) {
        let curBar = document.getElementById("percentBar"+i);
        let estimation = nnOutput[i]*100;
        let val = estimation.toFixed(2)+"%";
        curBar.style.height = val;
        curBar.textContent = val;
        if (i === maxIndex) {
            curBar.className = "progress-bar progress-bar-striped progress-bar-animated bg-success";
        } else {
            curBar.className = "progress-bar";
        }
    }
    // Update text of site
    document.getElementById('nnOut').innerHTML=maxIndex;
    clearBeforeDraw = true;
    var dt = new Date() - t1;
    console.log('recognize time: '+dt+'ms');
}

function processPicture(imgcontext) {
    let imgData = imgcontext.getImageData(0, 0, 280, 280);
    let grayscaleImg = imageDataToGrayscale(imgData);
    let imgArray = new Array(28); // 2D array of 28*28
    for (let y = 0; y < 28; y++) {
        imgArray[y] = new Array(28);
    }
    for (let y = 0; y < 28; y++) {
        for (let x = 0; x < 28; x++) {
            let mean = 0;
            for (let v = 0; v < 10; v++) {
                for (let h = 0; h < 10; h++) {
                    mean += grayscaleImg[y*10 + v][x*10 + h];
                }
            }
            mean = (1 - mean / 100); // average and invert
            imgArray[x][y] = (mean - .5) / .5;
        }
    }
    return imgArray;
}

function initCanvaDraw() {
    canvasDraw = document.getElementById('can');
    canvasDrawCtx = canvasDraw.getContext("2d");

    canvasDraw.addEventListener("mousemove", function (e) {
        findxy('move', e)
    }, false);
    canvasDraw.addEventListener("mousedown", function (e) {
        findxy('down', e)
    }, false);
    canvasDraw.addEventListener("mouseup", function (e) {
        findxy('up', e)
    }, false);
    canvasDraw.addEventListener("mouseout", function (e) {
        findxy('out', e)
    }, false);

    // Add support for touch screen
    canvasDraw.addEventListener("touchmove", function (e) {
      findxy('move', e)
    }, false);
    canvasDraw.addEventListener("touchstart", function (e) {
      findxy('down', e)
    }, false);
    canvasDraw.addEventListener("touchend", function (e) {
       findxy('up', e)
    }, false);
    canvasDraw.addEventListener("touchleave", function (e) {
        findxy('out', e)
    }, false);
}

// draws a line from (x1, y1) to (x2, y2) with nice rounded caps
function draw(ctx, color, lineWidth, x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.closePath();
}

function erase() {
    canvasDrawCtx.clearRect(0, 0, canvasDraw.width, canvasDraw.height);
    document.getElementById('nnOut').innerHTML = '';
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    if (evt.touches === undefined) {
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    } else {
        return {
            x: evt.touches[0].clientX - rect.left,
            y: evt.touches[0].clientY - rect.top
        };
    }
}

function findxy(res, e) {
    if (res == 'down') {
        if (clearBeforeDraw == true) {
            canvasDrawCtx.clearRect(0,0,canvasDraw.width,canvasDraw.height);
            document.getElementById('nnInput').innerHTML='';
            document.getElementById('nnOut').innerHTML='';
            paths = [];
            clearBeforeDraw = false;
        }

        let xyPos = getMousePos(canvasDraw, e);
        currX = xyPos["x"];
        currY = xyPos["y"];

        //draw a circle
        canvasDrawCtx.beginPath();
        canvasDrawCtx.lineWidth = 1;
        canvasDrawCtx.arc(currX,currY,lineWidth/2,0,2*Math.PI);
        canvasDrawCtx.stroke();
        canvasDrawCtx.closePath();
        canvasDrawCtx.fill();

        paths.push([[currX], [currY]]);
        paintFlag = true;
    }
    if (res == 'up' || res == "out") {
        paintFlag = false;
        //console.log(paths);
    }

    if (res == 'move') {
        if (paintFlag) {
            // draw a line to previous point
            prevX = currX;
            prevY = currY;
            let xyPos = getMousePos(canvasDraw, e);
            currX = xyPos["x"];
            currY = xyPos["y"];
            currPath = paths[paths.length-1];
            currPath[0].push(currX);
            currPath[1].push(currY);
            paths[paths.length-1] = currPath;
            draw(canvasDrawCtx, color, lineWidth, prevX, prevY, currX, currY);
        }
    }
}

document.addEventListener("DOMContentLoaded", function(event) {
    initCanvaDraw();
});
