var operationType = {
    NONE : 0,
    EQUAL : 1,
    NOT_EQUAL : 2,
    GRATER : 3,
    GRATER_EQ : 4,
    LOWER : 5,
    LOWER_EQ : 6,
};

class Node {
    constructor() {
        this.drawShape = paper.circle(0, 0, 20).attr({
            fill: "#FFF",
            stroke: "#000",
            "stroke-width": 1
        }).mouseup(function(e) {
            BT.leafClicked(this);
        });
        this.drawText = paper.text(0, 0, "+");

        this.treeDepth = 1;
        this.treeIndex = 1

        // Leaf have no left and right child
        this.left = null;
        this.right = null;

        this.parameter = null;
        this.operator = operationType.NONE;
        this.valueToCompare = null;
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

    replaceTextWithDepthIndex() {
        this.drawText.attr("text", "("+this.treeDepth+", "+this.treeIndex+")");
    }

    modify(value) {
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
        });
        this.drawText = paper.text(0, 0, value);
        this.valueToCompare = value;
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
            current.replaceTextWithDepthIndex();

            console.log(x, y);

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

    leafClicked(drawShape) {
        var clickedLeaf = this.findLeafFromdrawShape(drawShape);
        // TODO : faire une modale avec les vraie valeur
        var valStr = prompt("Enter a Value", "0");
        var val = parseInt(valStr);

        clickedLeaf.modify(val);
        if (clickedLeaf.treeDepth + 1 > this.totalDepth) {
            this.totalDepth = clickedLeaf.treeDepth + 1;
        }
        this.refreshTreeDraw();
    }
}

let paper = Raphael("container", 640, 480);
var background = paper.rect(0, 0, 640, 480).attr({
    fill: 'gray'
});
let BT = new BinaryTree();