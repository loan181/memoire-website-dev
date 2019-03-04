


class Neuron {
    constructor(number, layer) {
        this.number = number;
        this.layer = layer;
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
        let neuronLayer = this.layerArray;
        if (this.layer === 1) {
            let neuronValue = neuronLayer[this.number];
            // [-1, 1] = [blanc, noir]
            neuronValue += 1;
            neuronValue /= 2;
            return neuronValue;
        }
        else {
            return neuronLayer[this.number];
        }
    }

    get lightVal() {
        return this.value*100;
    }
}

class Weight {
    constructor(neuronNumber1, neuronNumber2, layer) {
        this.n1 = neuronNumber1;
        this.n2 = neuronNumber2;
        this.layer = layer;
    }

    get layerArray() {
        if (this.layer === 1) {
            return w12;
        } else if (this.layer === 2) {
            return w23;
        } 
    }

    get neuron1() {
        return Neuron(this.n1, this.layer);
    }

    get neuron2() {
        return Neuron(this.n2, this.layer+1);
    }

    get weight() {
        return this.layerArray[this.n2][this.n1];
    }

    set weight(newWeight) {
        this.layerArray[this.n2][this.n1] = newWeight;
    }
}