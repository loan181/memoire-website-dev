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
        this.treeDepth = 1;
        this.treeIndex = 1;

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
        }).mouseup(function(e) {
            BT.leafClicked(this);
        });
        this.drawText = paper.text(0, 0, "+");

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

    modify(axis, operation, value) {

        this.parameter = axis;
        this.operator = operation;
        this.valueToCompare = value;
        // I am no longer a leaf, i become a node !
        this.left = new Node();
        this.left.treeDepth = this.treeDepth + 1;
        this.left.treeIndex = this.treeIndex * 2 - 1;
        this.right = new Node();
        this.right.treeDepth = this.treeDepth + 1;
        this.right.treeIndex = this.treeIndex * 2;

        this.drawShape.remove();
        this.drawText.remove();
        this.drawShape = paper.rect(-20, -20, 40, 40, 2).attr({
            fill: "#FFF",
            stroke: "#000",
            "stroke-width": 1
        }).mouseup(function(e) {
            BT.nodeClicked(this);
        });
        this.drawText = paper.text(0, 0, axis + " " + operationChar[operation] + " " + value);

    }
}

class BinaryTree {
    constructor() {
        this.totalDepth = 1;
        this.root = new Node();
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

            if (current.drawShape == drawShape) {
                return current;
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