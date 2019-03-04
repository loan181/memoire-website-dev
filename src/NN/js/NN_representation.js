

class Neuron {
    constructor(number, layer, paper) {
        this.number = number;
        this.layer = layer;

        this.paper = paper;
        this.shape = null;
    }

    get layerArray() {
        if (this.layer === 1) {
            return data;
        } else if (this.layer === 2) {
            return out2;
        } else if (this.layer === 3) {
            return out3;
        }
    }

    get value() {
        try {
            let neuronLayer = this.layerArray;
            if (this.layer === 1) {
                let neuronValue = neuronLayer[this.number];
                // [-1, 1] = [blanc, noir]
                neuronValue += 1;
                neuronValue /= 2;
                return neuronValue;
            } else {
                return neuronLayer[this.number];
            }
        }
        catch (e) {
            return null;
        }
    }

    get lightVal() {
        if (this.value === null)
            return null;
        return this.value*100;
    }

    clear() {
        if (this.shape != null)
            this.shape.remove();
    }

    draw(x, y) {
        this.x = x;
        this.y = y;
        this.redraw();
    }

    redraw() {
        this.clear();
        this.paper.setStart();
        this.shapeCircle = this.paper.circle(this.x, this.y, neuronSize);
        this.shapeText = this.paper.text(this.x, this.y, this.number);
        this.shape = this.paper.setFinish();

        this.redrawColors();
    }

    redrawColors() {
        let lightVal = this.lightVal;
        if (lightVal !== null) {
            let color = "hsl(0,0%," + lightVal + "%)";
            this.shapeCircle.attr("fill", color);

            if (lightVal <= 50) {
                this.shapeText.attr("fill", "#fff");
            } else {
                this.shapeText.attr("fill", "#000");
            }
        }
    }
}

class Weight {
    constructor(neuron1, neuron2, layer, paper) {
        this.n1 = neuron1;
        this.n2 = neuron2;
        this.layer = layer;

        this.paper = paper;
        this.shape = null;
        this.shapeOpacity = 1;

        this.redraw();
    }

    get layerArray() {
        if (this.layer === 1) {
            return w12;
        } else if (this.layer === 2) {
            return w23;
        }
    }

    get weight() {
        return this.layerArray[this.n2.number][this.n1.number];
    }

    set weight(newWeight) {
        this.layerArray[this.n2.number][this.n1.number] = newWeight;
    }

    get x1() {
        return this.n1.x;
    }
    get y1() {
        return this.n1.y;
    }
    get x2() {
        return this.n2.x;
    }
    get y2() {
        return this.n2.y;
    }

    setShapeTransparency(minValueLayer, maxValueLayer) {
        if (this.weight <= minValueLayer) {
            this.shapeOpacity = 0;
        } else if (this.weight >= maxValueLayer) {
            this.shapeOpacity = 1;
        } else {
            this.shapeOpacity = (this.weight - minValueLayer)/(maxValueLayer-minValueLayer);
        }
        this.shape.attr("opacity", this.shapeOpacity);
    }

    clear() {
        if (this.shape != null)
            this.shape.remove();
    }

    redraw() {
        this.clear();

        this.paper.setStart();
        this.shapeLine = this.paper.path(`M${this.x1} ${this.y1}L${this.x2} ${this.y2}`);
        this.shape = this.paper.setFinish();
    }
}



let w = 1000;
let h = 1000;
let paper = Raphael("neuralNetworkContainer", w, h);
// Big background (not need to resize it as it is huge)
paper.rect(-1, -1, w+1, h+1).attr({
    fill: "#b4b4b4"
}).toBack();

let neuronSize = 16;

let horizontalOffset = 450;

// First layer
let firstLayerSize = 16;
let firstLayerNeuron = new Array(firstLayerSize);
let offset1 = h/firstLayerSize;
for (let i = 0; i < firstLayerSize; i++) {
    firstLayerNeuron[i] = new Neuron(i, 1, paper, i);
    firstLayerNeuron[i].draw(32, neuronSize +  i*offset1);
}

// Second layer
let secondLayerSize = 20;
let secondLayerNeuron = new Array(secondLayerSize);
let offset2 = h/secondLayerSize;
for (let i = 0; i < secondLayerSize; i++) {
    secondLayerNeuron[i] = new Neuron(i, 2, paper, i);
    secondLayerNeuron[i].draw(32+horizontalOffset, neuronSize +  i*offset2);
    //secondLayerNeuron[i] = paper.circle(32+horizontalOffset, neuronSize +  i*offset2, neuronSize);
}

// Third layer
let thirdLayerSize = 10;
let thirdLayerNeuron = new Array(thirdLayerSize);
let offset3 = h/thirdLayerSize;
for (let i = 0; i < thirdLayerSize; i++) {
    thirdLayerNeuron[i] = new Neuron(i, 3, paper, i);
    thirdLayerNeuron[i].draw(32+2*horizontalOffset, neuronSize +  i*offset3);
    //thirdLayerNeuron[i] = paper.circle(32+2*horizontalOffset, neuronSize +  i*offset3, neuronSize);
}


// Link between layers
let linkLayer12 = [];
for (let i = 0; i < firstLayerNeuron.length; i++) {
    let currFirstLayerNeuron = firstLayerNeuron[i];
    linkLayer12[i] = [];
    for (let j = 0; j < secondLayerNeuron.length; j++) {
        let currSecondLayerNeuron = secondLayerNeuron[j];;
        linkLayer12[i][j] = new Weight(currFirstLayerNeuron, currSecondLayerNeuron, 1, paper)
        linkLayer12[i][j].redraw();
        //linkLayer12[i][j] = paper.path(`M${x1} ${y1}L${x2} ${y2}`);
    }
}

let linkLayer23 = [];
for (let i = 0; i < secondLayerNeuron.length; i++) {
    let currFirstLayerNeuron = secondLayerNeuron[i];
    linkLayer23[i] = [];
    for (let j = 0; j < thirdLayerNeuron.length; j++) {
        let currSecondLayerNeuron = thirdLayerNeuron[j];
        linkLayer23[i][j] = new Weight(currFirstLayerNeuron, currSecondLayerNeuron, 2, paper);
        linkLayer23[i][j].redraw();
        //linkLayer23[i][j] = paper.path(`M${x1} ${y1}L${x2} ${y2}`);
    }
}


// src : https://stackoverflow.com/a/3730579/7173166
// e.g :
// sortWithIndeces([4, 2, 3, 1]);
// (4) [0, 2, 1, 3]
function sortWithIndeces(toSort) {
    var indices = new Array(toSort.length);
    for (var i = 0; i < toSort.length; ++i) indices[i] = i;
    indices.sort(function (a, b) { return toSort[a] > toSort[b] ? -1 : toSort[a] < toSort[b] ? 1 : 0; });
    return indices;
}


function refreshNetworkRepresentation(guessedNumber) {
    let bestWArrayLayer2 = w23[guessedNumber];
    let bestIndices = sortWithIndeces(bestWArrayLayer2);

    for (let i = 0; i < secondLayerSize; i++) {
        secondLayerNeuron[i].number = bestIndices[i];
        secondLayerNeuron[i].redraw();
    }
    let maxValueLayer = bestWArrayLayer2[bestIndices[0]];
    let minValueLayer = bestWArrayLayer2[bestIndices[secondLayerSize-1]];

    for (let i = 0; i < secondLayerNeuron.length; i++) {
        for (let j = 0; j < thirdLayerNeuron.length; j++) {
            linkLayer23[i][j].setShapeTransparency(minValueLayer, maxValueLayer);
        }
    }
}

