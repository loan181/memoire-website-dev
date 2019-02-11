// See : https://sefiks.com/2017/11/20/a-step-by-step-id3-decision-tree-example/

class Tennis {
    constructor(Day, Outlook ,Temp, Humidity, Wind, Decision) {
        this.info = {};
        this.info.Day = Day;
        this.info.Outlook = Outlook;
        this.info.Temperature = Temp;
        this.info.Humidity = Humidity;
        this.info.Wind = Wind;
        this.info.Decision = Decision;
    }
}

function findOccurence(information, dataSetIndex) {
    let ret = {};
    for (let i = 0; i < dataSetIndex.length; i++) {
        let currentInfo = datas[dataSetIndex[i]].info[information];
        ret[currentInfo] = (ret[currentInfo] || []); // create list for this key if it does not exists yet
        ret[currentInfo].push(dataSetIndex[i]);
    }
    return ret
}

function entropy(S, dataSetIndex) {
    let occurences = findOccurence(S, dataSetIndex);
    let ret = 0;
    for (let key in occurences) {
        let frac = occurences[key].length / dataSetIndex.length;
        ret -= frac * Math.log2(frac)
    }
    return ret;
}


function gain(S, A, dataSetIndex) {
    let ret = entropy(S, dataSetIndex);
    let occurenceA = findOccurence(A, dataSetIndex);
    for (let key in occurenceA) {
        let occurenceSSachantA = occurenceA[key];
        let leftPartFrac = occurenceSSachantA.length / dataSetIndex.length;
        let sum = entropy(S, occurenceSSachantA);
        ret -= leftPartFrac * sum
    }
    return ret;
}


data = `1	Sunny	Hot	High	Weak	No
2	Sunny	Hot	High	Strong	No
3	Overcast	Hot	High	Weak	Yes
4	Rain	Mild	High	Weak	Yes
5	Rain	Cool	Normal	Weak	Yes
6	Rain	Cool	Normal	Strong	No
7	Overcast	Cool	Normal	Strong	Yes
8	Sunny	Mild	High	Weak	No
9	Sunny	Cool	Normal	Weak	Yes
10	Rain	Mild	Normal	Weak	Yes
11	Sunny	Mild	Normal	Strong	Yes
12	Overcast	Mild	High	Strong	Yes
13	Overcast	Hot	Normal	Weak	Yes
14	Rain	Mild	High	Strong	No`;

dataSplitted = data.split("\n");
datas = [];
datasIndex = [];

for (let i=0; i < dataSplitted.length; i++) {
    let ts = dataSplitted[i].split("\t");
    datas.push(new Tennis(ts[0], ts[1], ts[2], ts[3], ts[4], ts[5]));
    datasIndex.push(i);
}
