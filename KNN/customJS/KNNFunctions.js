const categories = ["sepal length", "sepal width", "petal length", "petal width"];
const flowerName = ["Iris-setosa", "Iris-versicolor", "Iris-virginica"];

class Flower {
    constructor(sepal_length, sepal_width, petal_length, petal_width, name) {
        this.data = {
            "sepal length" : sepal_length,
            "sepal width" : sepal_width,
            "petal length" : petal_length,
            "petal width" : petal_width,
            "name" : name
        };
    }

    get(dataName){
        return this.data[dataName];
    }
}

const trainingSet = [
    new Flower(5.1, 3.5, 1.4, 0.2, "Iris-setosa"),
    new Flower(4.9, 3.0, 1.4, 0.2, "Iris-setosa"),
    new Flower(4.7, 3.2, 1.3, 0.2, "Iris-setosa"),
    new Flower(4.6, 3.1, 1.5, 0.2, "Iris-setosa"),
    new Flower(5.0, 3.6, 1.4, 0.2, "Iris-setosa"),
    new Flower(5.4, 3.9, 1.7, 0.4, "Iris-setosa"),
    new Flower(4.6, 3.4, 1.4, 0.3, "Iris-setosa"),
    new Flower(5.0, 3.4, 1.5, 0.2, "Iris-setosa"),
    new Flower(4.4, 2.9, 1.4, 0.2, "Iris-setosa"),
    new Flower(4.9, 3.1, 1.5, 0.1, "Iris-setosa"),
    new Flower(5.4, 3.7, 1.5, 0.2, "Iris-setosa"),
    new Flower(4.8, 3.4, 1.6, 0.2, "Iris-setosa"),
    new Flower(4.8, 3.0, 1.4, 0.1, "Iris-setosa"),
    new Flower(4.3, 3.0, 1.1, 0.1, "Iris-setosa"),
    new Flower(5.8, 4.0, 1.2, 0.2, "Iris-setosa"),
    new Flower(5.7, 4.4, 1.5, 0.4, "Iris-setosa"),
    new Flower(5.4, 3.9, 1.3, 0.4, "Iris-setosa"),
    new Flower(5.1, 3.5, 1.4, 0.3, "Iris-setosa"),
    new Flower(5.7, 3.8, 1.7, 0.3, "Iris-setosa"),
    new Flower(5.1, 3.8, 1.5, 0.3, "Iris-setosa"),
    new Flower(5.4, 3.4, 1.7, 0.2, "Iris-setosa"),
    new Flower(5.1, 3.7, 1.5, 0.4, "Iris-setosa"),
    new Flower(4.6, 3.6, 1.0, 0.2, "Iris-setosa"),
    new Flower(5.1, 3.3, 1.7, 0.5, "Iris-setosa"),
    new Flower(4.8, 3.4, 1.9, 0.2, "Iris-setosa"),
    new Flower(5.0, 3.0, 1.6, 0.2, "Iris-setosa"),
    new Flower(5.0, 3.4, 1.6, 0.4, "Iris-setosa"),
    new Flower(5.2, 3.5, 1.5, 0.2, "Iris-setosa"),
    new Flower(5.2, 3.4, 1.4, 0.2, "Iris-setosa"),
    new Flower(4.7, 3.2, 1.6, 0.2, "Iris-setosa"),
    new Flower(4.8, 3.1, 1.6, 0.2, "Iris-setosa"),
    new Flower(5.4, 3.4, 1.5, 0.4, "Iris-setosa"),
    new Flower(5.2, 4.1, 1.5, 0.1, "Iris-setosa"),
    new Flower(5.5, 4.2, 1.4, 0.2, "Iris-setosa"),
    new Flower(4.9, 3.1, 1.5, 0.1, "Iris-setosa"),
    new Flower(5.0, 3.2, 1.2, 0.2, "Iris-setosa"),
    new Flower(5.5, 3.5, 1.3, 0.2, "Iris-setosa"),
    new Flower(4.9, 3.1, 1.5, 0.1, "Iris-setosa"),
    new Flower(4.4, 3.0, 1.3, 0.2, "Iris-setosa"),
    new Flower(5.1, 3.4, 1.5, 0.2, "Iris-setosa"),
    new Flower(7.0, 3.2, 4.7, 1.4, "Iris-versicolor"),
    new Flower(6.4, 3.2, 4.5, 1.5, "Iris-versicolor"),
    new Flower(6.9, 3.1, 4.9, 1.5, "Iris-versicolor"),
    new Flower(5.5, 2.3, 4.0, 1.3, "Iris-versicolor"),
    new Flower(6.5, 2.8, 4.6, 1.5, "Iris-versicolor"),
    new Flower(5.7, 2.8, 4.5, 1.3, "Iris-versicolor"),
    new Flower(6.3, 3.3, 4.7, 1.6, "Iris-versicolor"),
    new Flower(4.9, 2.4, 3.3, 1.0, "Iris-versicolor"),
    new Flower(6.6, 2.9, 4.6, 1.3, "Iris-versicolor"),
    new Flower(5.2, 2.7, 3.9, 1.4, "Iris-versicolor"),
    new Flower(5.0, 2.0, 3.5, 1.0, "Iris-versicolor"),
    new Flower(5.9, 3.0, 4.2, 1.5, "Iris-versicolor"),
    new Flower(6.0, 2.2, 4.0, 1.0, "Iris-versicolor"),
    new Flower(6.1, 2.9, 4.7, 1.4, "Iris-versicolor"),
    new Flower(5.6, 2.9, 3.6, 1.3, "Iris-versicolor"),
    new Flower(6.7, 3.1, 4.4, 1.4, "Iris-versicolor"),
    new Flower(5.6, 3.0, 4.5, 1.5, "Iris-versicolor"),
    new Flower(5.8, 2.7, 4.1, 1.0, "Iris-versicolor"),
    new Flower(6.2, 2.2, 4.5, 1.5, "Iris-versicolor"),
    new Flower(5.6, 2.5, 3.9, 1.1, "Iris-versicolor"),
    new Flower(5.9, 3.2, 4.8, 1.8, "Iris-versicolor"),
    new Flower(6.1, 2.8, 4.0, 1.3, "Iris-versicolor"),
    new Flower(6.3, 2.5, 4.9, 1.5, "Iris-versicolor"),
    new Flower(6.1, 2.8, 4.7, 1.2, "Iris-versicolor"),
    new Flower(6.4, 2.9, 4.3, 1.3, "Iris-versicolor"),
    new Flower(6.6, 3.0, 4.4, 1.4, "Iris-versicolor"),
    new Flower(6.8, 2.8, 4.8, 1.4, "Iris-versicolor"),
    new Flower(6.7, 3.0, 5.0, 1.7, "Iris-versicolor"),
    new Flower(6.0, 2.9, 4.5, 1.5, "Iris-versicolor"),
    new Flower(5.7, 2.6, 3.5, 1.0, "Iris-versicolor"),
    new Flower(5.5, 2.4, 3.8, 1.1, "Iris-versicolor"),
    new Flower(5.5, 2.4, 3.7, 1.0, "Iris-versicolor"),
    new Flower(5.8, 2.7, 3.9, 1.2, "Iris-versicolor"),
    new Flower(6.0, 2.7, 5.1, 1.6, "Iris-versicolor"),
    new Flower(5.4, 3.0, 4.5, 1.5, "Iris-versicolor"),
    new Flower(6.0, 3.4, 4.5, 1.6, "Iris-versicolor"),
    new Flower(6.7, 3.1, 4.7, 1.5, "Iris-versicolor"),
    new Flower(6.3, 2.3, 4.4, 1.3, "Iris-versicolor"),
    new Flower(5.6, 3.0, 4.1, 1.3, "Iris-versicolor"),
    new Flower(5.5, 2.5, 4.0, 1.3, "Iris-versicolor"),
    new Flower(6.3, 3.3, 6.0, 2.5, "Iris-virginica"),
    new Flower(5.8, 2.7, 5.1, 1.9, "Iris-virginica"),
    new Flower(7.1, 3.0, 5.9, 2.1, "Iris-virginica"),
    new Flower(6.3, 2.9, 5.6, 1.8, "Iris-virginica"),
    new Flower(6.5, 3.0, 5.8, 2.2, "Iris-virginica"),
    new Flower(7.6, 3.0, 6.6, 2.1, "Iris-virginica"),
    new Flower(4.9, 2.5, 4.5, 1.7, "Iris-virginica"),
    new Flower(7.3, 2.9, 6.3, 1.8, "Iris-virginica"),
    new Flower(6.7, 2.5, 5.8, 1.8, "Iris-virginica"),
    new Flower(7.2, 3.6, 6.1, 2.5, "Iris-virginica"),
    new Flower(6.5, 3.2, 5.1, 2.0, "Iris-virginica"),
    new Flower(6.4, 2.7, 5.3, 1.9, "Iris-virginica"),
    new Flower(6.8, 3.0, 5.5, 2.1, "Iris-virginica"),
    new Flower(5.7, 2.5, 5.0, 2.0, "Iris-virginica"),
    new Flower(5.8, 2.8, 5.1, 2.4, "Iris-virginica"),
    new Flower(6.4, 3.2, 5.3, 2.3, "Iris-virginica"),
    new Flower(6.5, 3.0, 5.5, 1.8, "Iris-virginica"),
    new Flower(7.7, 3.8, 6.7, 2.2, "Iris-virginica"),
    new Flower(7.7, 2.6, 6.9, 2.3, "Iris-virginica"),
    new Flower(6.0, 2.2, 5.0, 1.5, "Iris-virginica"),
    new Flower(6.9, 3.2, 5.7, 2.3, "Iris-virginica"),
    new Flower(5.6, 2.8, 4.9, 2.0, "Iris-virginica"),
    new Flower(7.7, 2.8, 6.7, 2.0, "Iris-virginica"),
    new Flower(6.3, 2.7, 4.9, 1.8, "Iris-virginica"),
    new Flower(6.7, 3.3, 5.7, 2.1, "Iris-virginica"),
    new Flower(7.2, 3.2, 6.0, 1.8, "Iris-virginica"),
    new Flower(6.2, 2.8, 4.8, 1.8, "Iris-virginica"),
    new Flower(6.1, 3.0, 4.9, 1.8, "Iris-virginica"),
    new Flower(6.4, 2.8, 5.6, 2.1, "Iris-virginica"),
    new Flower(7.2, 3.0, 5.8, 1.6, "Iris-virginica"),
    new Flower(7.4, 2.8, 6.1, 1.9, "Iris-virginica"),
    new Flower(7.9, 3.8, 6.4, 2.0, "Iris-virginica"),
    new Flower(6.4, 2.8, 5.6, 2.2, "Iris-virginica"),
    new Flower(6.3, 2.8, 5.1, 1.5, "Iris-virginica"),
    new Flower(6.1, 2.6, 5.6, 1.4, "Iris-virginica"),
    new Flower(7.7, 3.0, 6.1, 2.3, "Iris-virginica"),
    new Flower(6.3, 3.4, 5.6, 2.4, "Iris-virginica"),
    new Flower(6.4, 3.1, 5.5, 1.8, "Iris-virginica"),
    new Flower(6.0, 3.0, 4.8, 1.8, "Iris-virginica"),
    new Flower(6.9, 3.1, 5.4, 2.1, "Iris-virginica")
];
const predictionSet = [
    new Flower(5.0, 3.5, 1.3, 0.3, "Iris-setosa"),
    new Flower(4.5, 2.3, 1.3, 0.3, "Iris-setosa"),
    new Flower(4.4, 3.2, 1.3, 0.2, "Iris-setosa"),
    new Flower(5.0, 3.5, 1.6, 0.6, "Iris-setosa"),
    new Flower(5.1, 3.8, 1.9, 0.4, "Iris-setosa"),
    new Flower(4.8, 3.0, 1.4, 0.3, "Iris-setosa"),
    new Flower(5.1, 3.8, 1.6, 0.2, "Iris-setosa"),
    new Flower(4.6, 3.2, 1.4, 0.2, "Iris-setosa"),
    new Flower(5.3, 3.7, 1.5, 0.2, "Iris-setosa"),
    new Flower(5.0, 3.3, 1.4, 0.2, "Iris-setosa"),
    new Flower(5.5, 2.6, 4.4, 1.2, "Iris-versicolor"),
    new Flower(6.1, 3.0, 4.6, 1.4, "Iris-versicolor"),
    new Flower(5.8, 2.6, 4.0, 1.2, "Iris-versicolor"),
    new Flower(5.0, 2.3, 3.3, 1.0, "Iris-versicolor"),
    new Flower(5.6, 2.7, 4.2, 1.3, "Iris-versicolor"),
    new Flower(5.7, 3.0, 4.2, 1.2, "Iris-versicolor"),
    new Flower(5.7, 2.9, 4.2, 1.3, "Iris-versicolor"),
    new Flower(6.2, 2.9, 4.3, 1.3, "Iris-versicolor"),
    new Flower(5.1, 2.5, 3.0, 1.1, "Iris-versicolor"),
    new Flower(5.7, 2.8, 4.1, 1.3, "Iris-versicolor"),
    new Flower(6.7, 3.1, 5.6, 2.4, "Iris-virginica"),
    new Flower(6.9, 3.1, 5.1, 2.3, "Iris-virginica"),
    new Flower(5.8, 2.7, 5.1, 1.9, "Iris-virginica"),
    new Flower(6.8, 3.2, 5.9, 2.3, "Iris-virginica"),
    new Flower(6.7, 3.3, 5.7, 2.5, "Iris-virginica"),
    new Flower(6.7, 3.0, 5.2, 2.3, "Iris-virginica"),
    new Flower(6.3, 2.5, 5.0, 1.9, "Iris-virginica"),
    new Flower(6.5, 3.0, 5.2, 2.0, "Iris-virginica"),
    new Flower(6.2, 3.4, 5.4, 2.3, "Iris-virginica"),
    new Flower(5.9, 3.0, 5.1, 1.8, "Iris-virginica")
];

function getTrainingSet() {
    return trainingSet;
}

function getPredictionSet() {
    return predictionSet;
}

function getClassesName() {
    return flowerName;
}


/**
 * Calculate the euclidian distance between two flowers
 * @param flower1
 * @param flower2
 * @returns {number}
 */
function calculateEuclidianDistance(flower1, flower2) {
    let leftPart  = flower1.get(currentXCat) - flower2.get(currentXCat);
    let rightPart = flower1.get(currentYCat) - flower2.get(currentYCat);
    return Math.sqrt(
        leftPart*leftPart + rightPart*rightPart
    );
}

/**
 * Find the K nearest neighbours from the training set datas with <flowerToClassify>
 * @param trainingSet
 * @param flowerToClassify
 * @returns {Flower[]} K nearest flowers
 */
function findKNearestNeighbours(trainingSet, flowerToClassify) {
    const K = getK();
    let distances = new Array(trainingSet.length);
    for (let i = 0; i < trainingSet.length; i++) {
        distances[i] = {
            flower : trainingSet[i],
            dist : calculateEuclidianDistance(flowerToClassify, trainingSet[i])
        };
    }
    distances.sort(function (a, b) { // Sort by distance (smaller firsts)
        return a.dist - b.dist;
    });

    let neighbors = new Array(K);
    for (let i = 0; i < K; i++) {
        neighbors[i] = distances[i].flower;
    }
    return neighbors
}

function findKNearestNeighboursNames(flowerToClassify) {
    let neighbors = findKNearestNeighbours(getTrainingSet(), flowerToClassify);
    let ret = new Array(neighbors.length);
    for (let i = 0; i < neighbors.length; i++) {
        ret[i] = neighbors[i].get("name");
    }
    return ret;
}

/**
 * Shuffles array in place. source : https://stackoverflow.com/a/6274381/7173166
 * @param {Array} a items An array containing the items.
 */
function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

/**
 * Calculate the prediction Ratio.
 * We shuffle the array to make sure it does not cheat by precomputing values
 *
 * @param classifyFunction Petit bricolage ici pour tester la prédiction, on peut pas appeller classify depuis ici (vu qu'il est dans son scope) du coup on le reçoit ici en paramètre.
 * @returns {number}
 */
function calculatePrediction(classifyFunction) {
    let testingSet = getPredictionSet();
    let repeatShuffle = 2;
    let accuratePrediction = 0;
    let totalGuessNumber = repeatShuffle * testingSet.length;

    for (let i = 0; i < repeatShuffle; i++) {
        shuffle(testingSet);

        for(let flowerToPredictInd in testingSet) {
            let curFlower = testingSet[flowerToPredictInd];

            let expectedClass = curFlower.get("name");
            let actualClass;
            actualClass = classifyFunction(curFlower); // Call the function made in blockly

            if (expectedClass === actualClass) {
                accuratePrediction += 1;
            }
        }
    }
    let predictionRatio = accuratePrediction/totalGuessNumber;
    updateHTMLRatioText((predictionRatio*100).toFixed(2));
    return predictionRatio;
}

function updateHTMLRatioText(text) {
    try {
        let progressPredictionBar = document.getElementById("predictionProgressBar");
        let val = text+"%";
        progressPredictionBar.style.width = val;
        progressPredictionBar.textContent = val;
        if (text >= 99.9) {
            progressPredictionBar.className = "progress-bar progress-bar-striped progress-bar-animated bg-success";
        } else if (text >= 49.9) {
            progressPredictionBar.className = "progress-bar progress-bar-striped progress-bar-animated bg-warning";
        } else {
            progressPredictionBar.className = "progress-bar progress-bar-striped progress-bar-animated bg-danger";
        }
    }
     catch (e) {
        console.warn("Erreur pour l'update de la progress bar de prédiction ");
        console.log(e);
    }
}

function getK() {
    return Number(document.getElementById("KChoice").value);
}


/**
 * Used by Blockly to create an artificial flower
 *
 * @param x
 * @param y
 * @returns {Flower}
 */
function createFlower(x, y) {
    let args = Array(4);
    for (let i = 0; i < categories.length; i++) {
        if (currentXCat === categories[i]) {
            args[i] = x;
        } else if (currentYCat === categories[i]) {
            args[i] = y;
        } else {
            args[i] = null;
        }
    }
    options.data[3].dataPoints.push({x: x, y: y});
    refreshGraph();
    return new Flower(args[0], args[1], args[2], args[3], "");
}


function getRandomFlower() {
    return getClassesName()[Math.floor(Math.random() * getClassesName().length)];
}

let flowerCounter = {};
let cacheNN = null;
let needRefreshCache = true;
function resetCounters() {
    flowerCounter = {};
    for (let i = 0; i < flowerName.length; i++) {
        flowerCounter[flowerName[i]] = 0;
    }
    needRefreshCache = true;
}

function increaseCounters(XthFlower, increaseAmount, irisToCompare) {
    if (needRefreshCache) {
        cacheNN = findKNearestNeighboursNames(irisToCompare);
        needRefreshCache = false;
    }
    flowerCounter[cacheNN[XthFlower-1]] += increaseAmount; // -1 car la 1ere est celle d'indice 0
}

function retrievecounterflower(maxOrMin) {
    let minFlower = flowerName[0];
    let maxFlower = flowerName[0];

    for (var key in flowerCounter) {
        let currentValue = flowerCounter[key];

        if (currentValue < flowerCounter[minFlower]) {
            minFlower = key;
        }
        if (currentValue > flowerCounter[maxFlower]) {
            maxFlower = key;
        }
    }


    if (maxOrMin === 'min') {
        return minFlower;
    }
    else {
        return maxFlower;
    }
}
