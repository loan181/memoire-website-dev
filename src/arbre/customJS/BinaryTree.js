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
            this.drawShape.remove();
            this.drawText.remove();
        }

        this.drawShape = paper.circle(0, 0, 20).attr({
            fill: "#FFF",
            stroke: "#000",
            "stroke-width": 1
        });
        this.drawText = paper.text(0, 0, "+");

        this.draw.clear();
        this.draw.push(
            this.drawShape,
            this.drawText
        );

        this.draw.hover(
            this.hover,
            this.unHover,
            this,
            this
        );

        this.draw.mouseup(
            (e) =>{this.leafClicked();}
        );

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
        this.operator = operationType.NONE;
        this.valueToCompare = null;
    }

    isLeaf() {
        return this.leftBranch === null;
    }

    setFlowersIndex(flowersIndexList) {
        this.associatedFlower = flowersIndexList;
    }

    hover() {
        if (this.isLeaf()) {
            this.displayProportionOfEachFlower();
            highlightAllMarkers();
            drawPointsIndex(this.associatedFlower);
        } else {
            let axis = null;
            if (this.parameter === currentXCat) {
                axis = "x";
            }
            else if (this.parameter === currentYCat) {
                axis = "y";
            }
            else {
                console.error("Unkwnon parameter as axis : " + this.parameter);
            }
            highlightCondition(axis, this.operator, this.valueToCompare);
            highlightMarkerCondition(this.left.associatedFlower, this.right.associatedFlower);
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

    displayProportionOfEachFlower() {
        // Count the proportion of the flower of the leaf
        let flowerProportions = this.flowerCounter;

        // TODO : trouver le maximum (qui déterminera la fleur)
        for (var key in flowerProportions){
            flowerProportions[key] /= this.associatedFlower.length;
            flowerProportions[key] *= 100;
        }
        console.log(flowerProportions);
        var text = "";
        for (var key in flowerProportions){
            text += key + " : " + flowerProportions[key].toFixed(2) +"%\n"
        }
        if (text === "") {
            text = "(vide)";
        }
        this.infoText = paper.text(this.x, this.y+45, text);
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
            this.drawShape.remove();
            this.drawText.remove();
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
        this.drawText.translate(x-this.x, y-this.y);
        this.drawShape.translate(x-this.x, y-this.y);
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
        var trueFlowerIndex = [];
        var falseFlowerIndex = [];
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

    // TODO : peut être precompute
    get majorityClass() {
        let ret = null;
        let countClassesDictionary = this.flowerCounter;

        let curMaxValue = -1;
        for (var className in countClassesDictionary) {
            if (countClassesDictionary[className] > curMaxValue) {
                ret = className;
                curMaxValue = countClassesDictionary[className];
            }
        }
        return ret;
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
        this.parameter = axis;
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

        this.drawShape.remove();
        this.drawText.remove();
        this.drawShape = paper.rect(-100, -20, 200, 40, 2).attr({
            fill: "#FFF",
            stroke: "#000",
            "stroke-width": 1
        });
        this.drawText = paper.text(0, 0, axis + " " + operationChar[operation] + " " + value).attr({
            "font-size": 14
        });

        this.draw.clear();
        this.draw.push(
            this.drawShape,
            this.drawText
        );
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

        // See : http://dmitrybaranovskiy.github.io/raphael/reference.html#Paper.path
        let pathString = "M" + node1X + "," + node1Y + "L" + node2X + "," + node2Y;

        if (this.draw != null) {
            this.draw.remove();
        }
        this.draw = paper.path(pathString);
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
            // TODO : CORRIGER !! visiblement on ne vas pas dans le bon Node :(
            let correctBranch = currentNode.evaluate(currentNode.parameter, currentNode.operator, myValue);
            if (correctBranch) {
                currentNode = currentNode.right;
            } else {
                currentNode = currentNode.left;
            }
        }
        return currentNode.majorityClass;
    }
}

function canvaSizeChange(newW, newH) {
    paper.setSize(newW, newH);

    BT.refreshTreeDraw();
}

let lastClickedLeaf = null;
let paper = Raphael("treeContainer", 640, 480);
// Big background (not need to resize it as it is huge)
paper.rect(-1, -1, 5000, 5000).attr({
    fill: "#b4b4b4"
}).toBack();
let BT = new BinaryTree();