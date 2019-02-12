
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
    addCustomMarker(x, y);
    redrawPlot();
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

function getCounterToPrint() {
    let text = "";
    for (let i = 0; i < flowerName.length; i++) {
        text += " - " + flowerName[i] + " : " + flowerCounter[flowerName[i]] + "\n";
    }
    return text;
}