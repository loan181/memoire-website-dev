// All this functions will be call by blockly blocks

/**
 * Return the maximum/minimum value of the last layer neuron values
 *
 * @param minOrMax either 'min' or 'max'
 * @param nnOutputNeurons
 */
function nnSelectOutputLayer(minOrMax, nnOutputNeurons) {
    let minIndex = 0;
    let maxIndex = 0;
    for (let i = 1; i < nnOutputNeurons.length; i++) {
        let value = nnOutputNeurons[i];
        if (value < nnOutputNeurons[minIndex]) {
            minIndex = i;
        }
        if (value > nnOutputNeurons[minIndex]) {
            maxIndex = i;
        }
    }

    if (minOrMax === 'min')
        return minIndex;
    else
        return maxIndex;
}


/**
 * Return the width of a picture.
 * Return the width if picture is a 2D array
 * Return the lenght if 1D
 * @param picture the picture to return the width for
 */
function getPictureW(picture) {
    if (typeof picture[0][0] != 'undefined') {// if it is a 2D array
        return picture[0].length;
    } else { // 1 D array
        return picture.length;
    }
}

/**
 * Will flatten a picture.
 * 2D picture is flatten into a 1D one
 * @param pictureToFlatten 2D array
 */
function flattenPicture(pictureToFlatten) {
    return pictureToFlatten.flat();
}

/**
 * Set the value of the given neuron number with the given value
 * @param value_neuron_ind
 * @param value_picture_pixel
 */
function setValueOfNeuron(value_neuron_ind, value_picture_pixel) {
    nnInput[value_neuron_ind] = value_picture_pixel;
}

/**
 * Return the value of the pixelNumber of picture
 * @param pixelNumber
 * @param picture a 1D picture (array)
 */
function getValueOfImgPixel(pixelNumber, picture) {
    return picture[pixelNumber];
}
