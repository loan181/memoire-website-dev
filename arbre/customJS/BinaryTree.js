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
            this.displayProportionOfEachFlower,
            this.unDisplayProportionOfEachFlower,
            this,
            this
        );

        this.draw.mouseup(function(e) {
            BT.leafClicked(this);
        });

        // Leaf have no left and right child
        if (this.left != null) {
            this.left.delete();
            this.right.delete();
        }
        this.left = null;
        this.right = null;

        this.parameter = null;
        this.operator = operationType.NONE;
        this.valueToCompare = null;
    }

    setFlowersIndex(flowersIndexList) {
        this.associatedFlower = flowersIndexList;
    }

    displayProportionOfEachFlower() {
        // Count the proportion of the flower of the leaf
        let flowerProportions = {};
        for (let i = 0; i < this.associatedFlower.length; i++) {
            let flowerInd = this.associatedFlower[i];
            let flowerIndName = trainingSet[flowerInd].get("name");
            flowerProportions[flowerIndName] = (flowerProportions[flowerIndName] || 0) + 1;
        }
        for (var key in flowerProportions){
            // TODO : corriger, on veut la proportion par rapport au training set
            //  il y à 40 de chaque fleur
            flowerProportions[key] /= 40; //this.associatedFlower.length;
            flowerProportions[key] *= 100;
        }
        // TODO : meilleur représentation (dans une boite de texte en bas ?)
        console.log(flowerProportions);
        var text = "";
        for (var key in flowerProportions){
            text += key + " : " + flowerProportions[key] +"%\n"
        }
        if (text === "") {
            text = "(vide)";
        }
        this.infoText = paper.text(this.x, this.y+45, text);
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

    updateChildCorrespondingFlower() {
        var trueFlowerIndex = [];
        var falseFlowerIndex = [];
        for (let i = 0; i < this.associatedFlower.length; i++) {
            let flowerInd = this.associatedFlower[i];
            let correspondingFlower = trainingSet[flowerInd];
            let correspondingFlowerValue = correspondingFlower.get(this.parameter);
            let value = this.valueToCompare;
            switch (parseInt(this.operator)) {
                case operationType.EQUAL:
                    if (correspondingFlowerValue === value) {trueFlowerIndex.push(flowerInd);}
                    else {falseFlowerIndex.push(flowerInd);}
                    break;
                case operationType.NOT_EQUAL:
                    if (correspondingFlowerValue !== value) {trueFlowerIndex.push(flowerInd);}
                    else {falseFlowerIndex.push(flowerInd);}
                    break;
                case operationType.GRATER:
                    if (correspondingFlowerValue > value) {trueFlowerIndex.push(flowerInd);}
                    else {falseFlowerIndex.push(flowerInd);}
                    break;
                case operationType.GRATER_EQ:
                    if (correspondingFlowerValue >= value) {trueFlowerIndex.push(flowerInd);}
                    else {falseFlowerIndex.push(flowerInd);}
                    break;
                case operationType.LOWER:
                    if (correspondingFlowerValue < value) {trueFlowerIndex.push(flowerInd);}
                    else {falseFlowerIndex.push(flowerInd);}
                    break;
                case operationType.LOWER_EQ:
                    if (correspondingFlowerValue <= value) {trueFlowerIndex.push(flowerInd);}
                    else {falseFlowerIndex.push(flowerInd);}
                    break;
                default:
                    console.warn("Unknown operation selected");
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
        this.operator = operation;
        this.valueToCompare = value;

        // Create a new node if I am a leaf (leaf -> node)
        if (this.left == null) { // if I am a leaf;
            this.left = new Node();
            this.left.treeDepth = this.treeDepth + 1;
            this.left.treeIndex = this.treeIndex * 2 - 1;
            this.right = new Node();
            this.right.treeDepth = this.treeDepth + 1;
            this.right.treeIndex = this.treeIndex * 2;
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
        this.draw.mouseup(function(e) {
            BT.nodeClicked(this);
        })
    }
}

class BinaryTree {
    constructor() {
        this.totalDepth = 1;
        this.root = new Node();
        let allFlowersIndex = Array.apply(null, {length: trainingSet.length}).map(Number.call, Number);
        this.root.setFlowersIndex(allFlowersIndex);
        this.refreshTreeDraw();
    }

    refreshTreeDraw() {
        var stackedNode = [this.root];
        while (stackedNode.length != 0) {
            var current = stackedNode.pop();
            var x = current.treeIndex * 640 / (Math.pow(2, (current.treeDepth-1))+1);
            var y = current.treeDepth * 480 / (this.totalDepth+1);
            current.move(x, y);

            if (current.left != null) {
                stackedNode.push(current.left);
            }
            if (current.right != null) {
                stackedNode.push(current.right);
            }
        }
    }

    findLeafFromdrawShape(drawShape) {
        var stackedNode = [this.root];
        while (stackedNode.length != 0) {
            var current = stackedNode.pop();

            // Iterate on all items in the set of the draw
            for (let i = 0; i < current.draw.items.length; i++) {
                if (current.draw.items[i] === drawShape) {
                    return current;
                }
            }

            if (current.left != null) {
                stackedNode.push(current.left);
            }
            if (current.right != null) {
                stackedNode.push(current.right);
            }
        }
        return null;
    }

    /**
     * Show the modal when a leaf is clicked.
     * As it is asynchronous, we will kindly wait for its call back
     * @param drawShape
     */
    leafClicked(drawShape) {
        lastClickedLeaf = this.findLeafFromdrawShape(drawShape);
        document.getElementById("deleteButton").classList.add("invisible");
        document.getElementById("modalParametersTitle").textContent = "Ajouter un noeud";
        $('#askParameters').modal("show");
    }

    /**
     * Show the modal when a node is clicked.
     * As it is asynchronous, we will kindly wait for its call back
     * @param drawShape
     */
    nodeClicked(drawShape) {
        lastClickedLeaf = this.findLeafFromdrawShape(drawShape);
        document.getElementById("deleteButton").classList.remove("invisible");
        document.getElementById("modalParametersTitle").textContent = "Modifier un noeud";
        $('#askParameters').modal("show");
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

    /**
     * Action to do when the designated flower is hovered
     * @param drawShape
     */
    // leafHover(drawShape) {
    //     var clickedLeaf = this.findLeafFromdrawShape(drawShape);
    //     clickedLeaf.displayProportionOfEachFlower();
    // }

    refreshTotalDepth() {
        var deepestDepth = 0;
        var stackedNode = [this.root];
        while (stackedNode.length != 0) {
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
}
let lastClickedLeaf = null;
let paper = Raphael("container", 640, 480);
var background = paper.rect(0, 0, 640, 480).attr({
    fill: 'gray'
});
let BT = new BinaryTree();