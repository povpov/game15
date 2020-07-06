let items = [];
let result = '123456789';
let empty = undefined;

class Mix {
    constructor(data) {
        this.arr = data.split("");
    }
    toMix() {
        return this.arr.sort(function () {
            return Math.random() - 0.5;
        });
    }

    //Проверить решаемость
    validate() {
        let k = 0;
        for (let i = 0; i < 8; i++) {

            if (this.arr[i] == '9') {
                k = Math.floor(i / 3) + 1;

            } else {
                for (let j = i; j < 8; j++) {
                    if (this.arr[i] * 1 > this.arr[j] * 1) {
                        k++;
                    }
                }
            }
        }

        if (k % 2 == 0) {
            return true;
        } else {
            return false;
        }

    }
}
class Move {
    constructor(data) {
        this.empty = data.indexOf('9');
    }

    get emptyUp() {
        return (this.empty < 3) ? -1 : this.empty - 3;
    }

    get emptyDown() {
        return (this.empty > 5) ? -1 : this.empty + 3;
    }

    get emptyLeft() {
        return ((this.empty % 3) == 0) ? -1 : this.empty - 1;
    }

    get emptyRight() {
        return ((this.empty % 3) == 2) ? -1 : this.empty + 1;
    }
}

let iMix = new Mix(result);
while (true) {
    iMix.toMix();
    if (iMix.validate()) {
        items = iMix.arr;
        break;
    }
}

let imove = new Move(items);

console.log("items=", items);

let up = imove.emptyUp;
let down = imove.emptyDown;
let left = imove.emptyLeft;
let right = imove.emptyRight;
empty = imove.empty;

let graph = [];
let itemsStr = [];

itemsStr = items.join("");
console.log("itemsStr=", itemsStr);
console.log("up=",up,"down=",down,"left=",left,"right=",right);

if ((up !== -1)) {

    itemsStr[empty] = itemsStr[up];
    itemsStr[up] = "9";
}
if (down !== -1) {
    itemsStr[empty] = itemsStr[down];
    itemsStr[down] = "9";
}
if (left !== -1) {
    itemsStr[empty] = itemsStr[left];
    itemsStr[left] = "9";
}
if (right !== -1) {
    itemsStr[empty] = itemsStr[right];
    itemsStr[right] = "9";
}

var arrrr = [up, down, left, right];
arrrr.forEach(function (entry) {
    if (entry !== -1) {
        let g = itemsStr.split("");
        g[empty] = g[entry];
        g[entry] = "9";
        graph[itemsStr] = g.join("");
        console.log("g=", g,`graph$(itemsStr)`,graph[itemsStr]);
    }
});
console.log("graph=", graph);