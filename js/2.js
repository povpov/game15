function toMix(data) {
    items.sort(function () {
        return Math.random() - 0.5;
    });
}

function validate(data) {
    items = data.split("");
    while (true) {
        toMix(items);
        let k = 0;
        for (let i = 0; i < 8; i++) {
            if (items[i] === 9) {
                k += Math.floor(i / 3) + 1;
            } else {
                for (let j = i; j < 8; j++) {
                    if (items[i] > items[j]) k++;
                }
            }
        }
        if (k % 2 === 0) break;
    }
    return items;
}

function itemsToString(data) {
    return data.join("");
}

//to get child nodes
function move(items) {
    let empty = items.indexOf("9");
    let arr = [];
    if (empty > 2) arr.push(empty - 3); // up
    if (empty < 6) arr.push(empty + 3); // down
    if (empty % 3 != 0) arr.push(empty - 1); // left
    if (empty % 3 != 2) arr.push(empty + 1); //right
    return arr;
}

function next(data, curent) {
    let first = curent;
    // if (isResult(first)){
    //     console.log("=delete last  from open==");
    //     delete open[first]; //delete last  from open
    //     return;
    // }
    let empty = first.indexOf("9");
    close[first] = open[first];
    data.map(value => {

            let tmp = first.split("");
            tmp[empty] = tmp[value];
            tmp[value] = "9";
            let second = itemsToString(tmp);
            let g = open[first].g + 1;
            // let h = weightH(second);
            let h = 0;
            let f = g + h;
            if (close[second]) {
                if (second !== begin) {
                    if (close[second].f > f) {
                        close[second] = {g: g, h: h, f: f, parrent: first};
                    }
                }
            } else {
                open[second] = {g: g, h: h, f: f, parrent: first};
            }
        }
    )
    delete open[first];
}

function isResult(data) {
    return data === result;
}

function weightH(data) {
    let k = 0;
    for (let i = 0; i < 9; i++) {
        if (+result[i] !== +data[i]) k++
    }
    return k;
}

let items;
let result = "123456789"; //финишный раклад
let begin = itemsToString(validate(result)); //первый расклад

let open = {};
let close = {};
open[begin] = {g: 0, h: 0, f: 0};
open[begin] = {g: 0, h: weightH(begin), f: weightH(begin)};
console.log("r=", result);
console.log("b=", begin);
let k = 0
let valitem = "";
while (Object.keys(open).length > 0) {
    for (let val in open) {
        valitem = val;
        break;
    }
    if (isResult(valitem)) {
        console.log("=delete last  from open==");
        close[valitem] = open[valitem];
        delete open[valitem]; //delete last  from open
        break;
    }
    next(move(valitem), valitem);
    k++
    // console.log("k:", k);
}
let optimal = [];
let ggg = result;
while (true) {

    if (ggg === begin) {
        break;
    }
    optimal.unshift(ggg);
    ggg = close[ggg].parrent;

}
console.log("optimal=", optimal);

document.getElementById("container").textContent="1122";
