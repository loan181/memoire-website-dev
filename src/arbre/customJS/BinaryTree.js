var operationType = {
    NONE : 0,
    EQUAL : 1,
    NOT_EQUAL : 2,
    GRATER : 3,
    GRATER_EQ : 4,
    LOWER : 5,
    LOWER_EQ : 6,
};
var operationChar = ["NONE", '=', '≠', '>', '⩾', '<', '⩽'];

class Node {
    constructor() {
        this.associatedFlower = [];
        this.treeDepth = 1;
        this.treeIndex = 1;
        this.draw = paper.set();

        this.infoText = null;

        this.reset();
    }

    reset() {
        if (this.drawShape != null) {
            this.draw.remove();
        }

        this.proportionOfEachFlower = this.refreshProportionOfEachFlower();
        this.refreshLeafDraw();

        // Leaf have no left and right child
        if (this.left != null) {
            this.left.delete();
            this.right.delete();
        }
        this.left = null;
        this.right = null;

        if (this.leftBranch != null) {
            this.leftBranch.delete();
            this.rightBranch.delete();
        }
        this.leftBranch = null;
        this.rightBranch = null;

        this.parameter = null;
        this.parameterAxis = null;
        this.operator = operationType.NONE;
        this.valueToCompare = null;
    }

    refreshLeafDraw() {
        if (this.drawShape != null) {
            this.draw.remove();
        }

        let pieCcolors = {"Iris-setosa":"#4f81bc", "Iris-versicolor":"#c0504e", "Iris-virginica":"#9bbb58"};
        let circleR = 20;

        this.draw.clear();
        paper.setStart();

        this.drawShape = paper.circle(0, 0, circleR).attr({
            fill: "#FFF",
            stroke: "#000",
            "stroke-width": 1
        });

        let accumulatedAngle = 0;
        for (let flower in this.proportionOfEachFlower) {
            let currentProportion = this.proportionOfEachFlower[flower];
            let angleEnd = accumulatedAngle + (360*currentProportion/100);
            let pieColor = pieCcolors[flower];

            if (flower === this.maxProportionKey) {
                this.drawShape.attr({
                    stroke: pieColor,
                    "stroke-width": 3,
                    "stroke-opacity":1
                });
            }

            sector(0, 0, circleR, accumulatedAngle, angleEnd,{"fill": pieColor, "fill-opacity":0.4, "stroke-opacity":0.2});

            accumulatedAngle = angleEnd;
        }

        this.drawText = paper.text(0, 0, "+").attr({"font-weight": "bold", "font-size":24});

        this.draw = paper.setFinish();

        this.draw.attr({
            cursor:"pointer"
        });

        this.draw.hover(
            this.hover,
            this.unHover,
            this,
            this
        );

        this.draw.mouseup(
            (e) =>{this.leafClicked();}
        );
    }

    isLeaf() {
        return this.leftBranch === null;
    }

    setFlowersIndex(flowersIndexList) {
        this.associatedFlower = flowersIndexList;
        this.proportionOfEachFlower = this.refreshProportionOfEachFlower();
    }

    hover() {
        if (this.isLeaf()) {
            this.displayProportionOfEachFlower();
            highlightAllMarkers();
            drawPointsIndex(this.associatedFlower);
            redrawPlot();
        } else {
            highlightCondition(this.parameterAxis, this.operator, this.valueToCompare);
            highlightMarkerCondition(this.left.associatedFlower, this.right.associatedFlower);
            redrawPlot();
        }

    }

    unHover() {
        if (this.isLeaf()) {
            this.unDisplayProportionOfEachFlower();
        } else {
            unhighlightCondition();
            unhighlightMarkerCondition();
        }
        unHighlightAllMarkers(); // Yellow if leaf, and red/green if node
        resetPlotWithDefaultData();
        redrawPlot();
    }

    get flowerCounter() {
        let flowerCounter = {};
        for (let i = 0; i < this.associatedFlower.length; i++) {
            let flowerInd = this.associatedFlower[i];
            let flowerIndName = trainingSet[flowerInd].get("name");
            flowerCounter[flowerIndName] = (flowerCounter[flowerIndName] || 0) + 1;
        }
        return flowerCounter
    }

    refreshProportionOfEachFlower() {
        // Count the proportion of the flower of the leaf
        let flowerCounter = this.flowerCounter
        let flowerProportions = {};

        // Compute the maximum at the same time
        this.maxProportionKey = null;
        for (var key in flowerCounter){
            if (this.maxProportionKey === null || flowerCounter[key] > flowerCounter[this.maxProportionKey]) {
                this.maxProportionKey = key;
            }
            flowerProportions[key] = flowerCounter[key];
            flowerProportions[key] /= this.associatedFlower.length;
            flowerProportions[key] *= 100;
        }
        this.proportionOfEachFlower = flowerProportions;
        this.refreshLeafDraw();
        return flowerProportions;
    }

    displayProportionOfEachFlower() {
        // Count the proportion of the flower of the leaf
        let flowerProportions = this.proportionOfEachFlower;

        var text = "";
        var hightlightText = "";
        for (var key in flowerProportions){
            if (key === this.maxProportionKey) {
                hightlightText += key + " : " + flowerProportions[key].toFixed(2) +"%\n";
            }
            else {
                text += key + " : " + flowerProportions[key].toFixed(2) + "%\n"
            }
        }

        if (hightlightText === "") {
            hightlightText = "(vide)";
        }
        this.infoText = paper.set();
        this.infoText.push(
            paper.text(this.x, this.y+30, hightlightText).attr({"font-weight": "bold"}),
            paper.text(this.x, this.y+34, "\n"+text)
        );
        this.infoText.attr({"font-size":12})
    }

    /**
     * Show the modal when a leaf is clicked.
     * As it is asynchronous, we will kindly wait for its call back
     */
    leafClicked() {
        lastClickedLeaf = this;
        document.getElementById("deleteButton").classList.add("invisible");
        document.getElementById("modalParametersTitle").textContent = "Ajouter un noeud";
        $('#askParameters').modal("show");
    }

    /**
     * Show the modal when a node is clicked.
     * As it is asynchronous, we will kindly wait for its call back
     */
    nodeClicked() {
        lastClickedLeaf = this;
        document.getElementById("deleteButton").classList.remove("invisible");
        document.getElementById("modalParametersTitle").textContent = "Modifier un noeud";
        $('#askParameters').modal("show");
    }

    unDisplayProportionOfEachFlower() {
        this.infoText.remove();
    }

    delete() {
        if (this.drawShape != null) {
            this.draw.remove();
        }

        // Recursively delete all downward child
        if (this.left != null) {
            this.left.delete();
            this.right.delete();
        }

        this.left = null;
        this.right = null;

        // Remove my 2 branches
        if (this.leftBranch != null) {
            this.leftBranch.delete();
            this.rightBranch.delete();
        }
    }

    get x() {
        return this.drawShape.matrix.e;
    }

    get y() {
        return this.drawShape.matrix.f;
    }

    move(x, y) {
        this.draw.translate(x-this.x, y-this.y);
        //this.drawText.translate(x-this.x, y-this.y);
        //this.drawShape.translate(x-this.x, y-this.y);
    }

    evaluate(parameter, operation, value) {
        switch (operation) {
            case operationType.EQUAL:
                return parameter === value;
            case operationType.NOT_EQUAL:
                return parameter !== value;
            case operationType.GRATER:
                return parameter > value;
            case operationType.GRATER_EQ:
                return parameter >= value;
            case operationType.LOWER:
                return parameter < value;
            case operationType.LOWER_EQ:
                return parameter <= value;
            default:
                console.warn("Unknown operation selected : " + operation);
        }
    }

    updateChildCorrespondingFlower() {
        let trueFlowerIndex = [];
        let falseFlowerIndex = [];
        for (let i = 0; i < this.associatedFlower.length; i++) {
            let flowerInd = this.associatedFlower[i];
            let correspondingFlower = trainingSet[flowerInd];
            let correspondingFlowerValue = correspondingFlower.get(this.parameter);
            let value = this.valueToCompare;

            if (this.evaluate(correspondingFlowerValue, this.operator, value)) {
                trueFlowerIndex.push(flowerInd);
            } else {
                falseFlowerIndex.push(flowerInd);
            }
        }
        this.right.setFlowersIndex(trueFlowerIndex);
        this.left.setFlowersIndex(falseFlowerIndex);

        // If my child have child, they must recursively update too
        if (this.left.left != null) {
            this.left.updateChildCorrespondingFlower();
        }
        if (this.right.left != null) {
            this.right.updateChildCorrespondingFlower();
        }

    }

    refreshBranchDraw() {
        if (this.leftBranch != null) {
            this.leftBranch.refreshDraw();
            this.rightBranch.refreshDraw();
        }
    }

    get majorityClass() {
        return this.maxProportionKey;
    }

    /**
     * Call whenever a node is modify
     * Either it was already a node and its value updated
     * or it is a leaf that became a node
     * @param axis
     * @param operation
     * @param value
     */
    modify(axis, operation, value) {
        this.parameterAxis = axis;
        if (this.parameterAxis === "x") {
            this.parameter = currentXCat;
        }
        else if (this.parameterAxis === "y") {
            this.parameter = currentYCat;
        }
        else {
            console.error("Unkwnon parameter as axis : " + this.parameterAxis);
        }
        this.operator = parseInt(operation);
        this.valueToCompare = value;

        // Create a new node if I am a leaf (leaf -> node)
        if (this.left == null) { // if I am a leaf;
            this.left = new Node();
            this.left.treeDepth = this.treeDepth + 1;
            this.left.treeIndex = this.treeIndex * 2 - 1;
            this.leftBranch = new Branch(this, this.left);

            this.right = new Node();
            this.right.treeDepth = this.treeDepth + 1;
            this.right.treeIndex = this.treeIndex * 2;
            this.rightBranch = new Branch(this, this.right);
        }
        this.updateChildCorrespondingFlower();

        this.draw.remove();
        this.drawShape = paper.rect(-100, -20, 200, 40, 2).attr({
            fill: "#FFF",
            stroke: "#000",
            "stroke-width": 1
        });
        this.drawText = paper.text(0, 0, frenchTranslationCat(this.parameter )+ " " + operationChar[this.operator] + " " + this.valueToCompare).attr({
            "font-size": 14
        });

        this.draw.clear();
        this.draw.push(
            this.drawShape,
            this.drawText
        );

        this.draw.attr({
            cursor:"pointer"
        });

        this.draw.hover(
            this.hover,
            this.unHover,
            this,
            this
        );
        this.draw.mouseup(
            (e) => {this.nodeClicked();}
        );
    }

    moveInFront() {
        this.draw.toFront();
    }
}

class Branch {
    constructor(nodeParent, nodeChild) {
        this.nodeParent = nodeParent;
        this.nodeChild = nodeChild;
        this.draw = null;
    }

    refreshDraw() {
        let node1X = this.nodeParent.x;
        let node1Y = this.nodeParent.y;
        let node2X = this.nodeChild.x;
        let node2Y = this.nodeChild.y;

        let yesBranch = node1X < node2X;
        let branchColor = "#ff0400";
        if (yesBranch) {
            branchColor = "#25ff58"
        }

        // See : http://dmitrybaranovskiy.github.io/raphael/reference.html#Paper.path
        let pathString = "M" + node1X + "," + node1Y + "L" + node2X + "," + node2Y;

        if (this.draw != null) {
            this.draw.remove();
        }
        this.draw = paper.path(pathString).attr({"stroke":branchColor});
    }

    delete() {
        if (this.draw != null) {
            this.draw.remove();
        }
        this.draw = null;
        this.nodeParent = null;
        this.nodeChild = null;
    }
}


class BinaryTree {
    constructor() {
       this.reset();
    }

    reset() {
        this.totalDepth = 1;
        if (this.root !== undefined)
            this.root.reset();
        else
            this.root = new Node();
        let allFlowersIndex = Array.apply(null, {length: trainingSet.length}).map(Number.call, Number);
        this.root.setFlowersIndex(allFlowersIndex);
        this.refreshTreeDraw();
    }

    refreshTreeDraw() {
        var stackedNode = [this.root];
        while (stackedNode.length !== 0) {
            var current = stackedNode.pop();
            var x = current.treeIndex * paper.width / (Math.pow(2, (current.treeDepth-1))+1);
            var y = current.treeDepth * paper.height / (this.totalDepth+1);
            current.move(x, y);

            if (current.left != null) {
                stackedNode.push(current.left);
            }
            if (current.right != null) {
                stackedNode.push(current.right);
            }
        }
        // We need to wait until a child is moved to update the branch
        stackedNode = [this.root];
        while (stackedNode.length !== 0) {
            var current = stackedNode.pop();
            current.refreshBranchDraw();
            current.moveInFront();

            if (current.left != null) {
                stackedNode.push(current.left);
            }
            if (current.right != null) {
                stackedNode.push(current.right);
            }
        }
    }

    /**
     * Activated by the mocal feedback
     */
    parseAskParametersValues() {
       var axisObj = document.getElementById("axisChoice");
       var axis = axisObj.options[axisObj.selectedIndex ].value;
       var operationObj = document.getElementById('operationChoice');
       var operation = operationObj.options[operationObj.selectedIndex ].value;
       var value = document.getElementById('valueChoice').value;
       this.askParameterFeedback(axis, operation, value);
    }

    askParameterFeedback(axis, operation, value) {
        lastClickedLeaf.modify(axis, operation, value);

        if (lastClickedLeaf.treeDepth + 1 > this.totalDepth) {
            this.totalDepth = lastClickedLeaf.treeDepth + 1;
        }
        this.refreshTreeDraw();
    }

    refreshTotalDepth() {
        var deepestDepth = 0;
        var stackedNode = [this.root];
        while (stackedNode.length !== 0) {
            var current = stackedNode.pop();

            if (current.treeDepth > deepestDepth) {
                deepestDepth = current.treeDepth;
            }

            if (current.left != null) {
                stackedNode.push(current.left);
            }
            if (current.right != null) {
                stackedNode.push(current.right);
            }
        }
        this.totalDepth = deepestDepth;
    }

    deleteNode() {
        lastClickedLeaf.reset();
        this.refreshTotalDepth(); // We can't guess the new depth when a node was deleted
        this.refreshTreeDraw();
    }

    classify(xValue, yValue) {
        let currentNode = this.root;
        while(!currentNode.isLeaf()) {
            let myValue = yValue;
            if (currentNode.parameter === currentXCat) {
                myValue = xValue;
            }
            let correctBranch = currentNode.evaluate(myValue, currentNode.operator, currentNode.valueToCompare);
            if (correctBranch) {
                currentNode = currentNode.right;
            } else {
                currentNode = currentNode.left;
            }
        }
        return currentNode.majorityClass;
    }

    getTreeJson() {
        let ret = {};
        this.extendTree(this.root, ret);
        return ret;
    }

    extendTree(currentNode, dictionary) {
        if (!currentNode.isLeaf() && currentNode !== null) {
            dictionary["parameter"] = currentNode.parameterAxis;
            dictionary["operator"] = currentNode.operator;
            dictionary["value"] = currentNode.valueToCompare;

            dictionary["child"] = [];
            if (currentNode.left != null) {
                let leftDict = {};
                this.extendTree(currentNode.left, leftDict);
                dictionary["child"][0] = leftDict;
            }
            if (currentNode.right != null) {
                let rightDict = {};
                this.extendTree(currentNode.right, rightDict);
                dictionary["child"][1] = rightDict;
            }
        }
    }

    loadTree(jsonTree) {
        this.reset();
        console.log("JSON tree : ", jsonTree);

        this.refreshNode(this.root, jsonTree);

    }

    refreshNode(node, dict) {
        if (Object.keys(dict).length !== 0) { // Empty dictionary = leaf -> no computation needed
            node.modify(dict["parameter"], dict["operator"], dict["value"]);
            let child = dict["child"];
            this.refreshNode(node.left, child[0]);
            this.refreshNode(node.right, child[1]);
        }
    }
}

function testClassify() {
    let correctGuess = 0;
    for (let i = 0; i < predictionSet.length; i++) {
        let currentFlower = predictionSet[i];
        if (BT.classify(currentFlower.get(currentXCat), currentFlower.get(currentYCat)) === currentFlower.get("name"))
            correctGuess += 1;
    }
    let ratio = correctGuess / predictionSet.length;
    pb.value = ratio*100;
    return ratio;
}

// Source : https://stackoverflow.com/a/7711684
// Allow to draw pie chart into nodes circle
function sector(cx, cy, r, startAngle, endAngle, params) {
    let rad = Math.PI / 180;
    let x1 = cx + r * Math.cos(-startAngle * rad),
        x2 = cx + r * Math.cos(-endAngle * rad),
        y1 = cy + r * Math.sin(-startAngle * rad),
        y2 = cy + r * Math.sin(-endAngle * rad);
    return paper.path(["M", cx, cy, "L", x1, y1, "A", r, r, 0, +(endAngle - startAngle > 180), 0, x2, y2, "z"]).attr(params);
}

function canvaSizeChange(newW, newH) {
    paper.setSize(newW, newH);

    BT.refreshTreeDraw();
}

function getCurrentDatasetName() {
    return "Iris";
}

function downloadExerciceFile() {
    let dictData = {};
    dictData["dataset"] = getCurrentDatasetName();
    dictData["x_axis"] = currentXCat;
    dictData["y_axis"] = currentYCat;
    dictData["tree"] = BT.getTreeJson();

    let filename = "DecisionTree";
    let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dictData));
    let downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", filename + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

function uploadExerciceFile(fileContent) {
    let dictData = JSON.parse(fileContent);

    // dataset saved value have no impact by now
    // TODO : check si les valeurs sont dans le select avant de les asigner (si c'est pas le cas, le fichier de sauvegarde est corrompu ou incompatible)
    currentXCat = dictData["x_axis"];
    currentYCat = dictData["y_axis"];
    document.getElementById('axisXChoice').value = currentXCat;
    document.getElementById('axisYChoice').value = currentYCat;
    BT.loadTree(dictData["tree"]);
    BT.refreshTotalDepth();
    redrawPlot();
    BT.refreshTreeDraw();
}

let lastClickedLeaf = null;
let paper = Raphael("treeContainer", 640, 480);
// Big background (not need to resize it as it is huge)
paper.rect(-1, -1, 5000, 5000).attr({
    fill: "#b4b4b4"
}).toBack();
let BT = new BinaryTree();

function handleFileSelect(evt) {
    var files = evt.target.files; // FileList object

    // use the 1st file from the list
    var f = files[0];

    var reader = new FileReader();

    // Closure to capture the file information.
    reader.onload = (function(theFile) {
        return function(e) {
            try {
                uploadExerciceFile(e.target.result);
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