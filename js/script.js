'use strict';

const sizeCell = 70;
const interval = 4;

let button = document.querySelector(".buttons");
let empty = undefined;
let score = undefined;
let mixItems = getItems();


button.addEventListener('click', function (event) {
    console.log("repeat-game", event.target.id);
    switch (event.target.id) {
        case "new-game":
            addComment(0);
            newGame();
            break;
        case "continue-game":
            continueGame();
            break;
        case "repeat-game":
            addComment(2);
            repeatGame();
            break;
        default:
            break;
    }
    setSessionStorage();
});

document.addEventListener('keydown', function (event) {
    move(event.key);
});


function move(data) {
    empty = mixItems.indexOf(16);
    switch (data) {
        case "s":
        case "ы":
            keyDown();
            break;
        case "w":
        case "ц":
            keyUp();
            break;
        case "a":
        case "ф":
            keyLeft();
            break;
        case "d":
        case "в":
            keyRight();
            break;
        default:
            return;
            break;
    }
    addComment(4);
    //Конец игры
    gameOver();
    //Обновление поля 
    drawField();
    //Сохранение текущей раскладки в localStorage
    setlocalStorage('mixItems');
    //Сохранить счет
    setScorelocalStorage();
}

function keyDown() {
    if (empty < 4) return;
    //Изменение массива
    mixItems[empty] = mixItems[empty - 4];
    mixItems[empty - 4] = 16;
    getScore();

}
function keyUp() {
    if (empty > 11) return;
    //Изменение массива
    mixItems[empty] = mixItems[empty + 4];
    mixItems[empty + 4] = 16;
    getScore();
}
function keyLeft() {
    if ((empty % 4) == 3) return;
    //Изменение массива
    mixItems[empty] = mixItems[empty + 1];
    mixItems[empty + 1] = 16;
    getScore();
}
function keyRight() {
    if (empty % 4 == 0) return;
    //Изменение массива
    mixItems[empty] = mixItems[empty - 1];
    mixItems[empty - 1] = 16;
    getScore();
}

function setScore(data) {
    document.getElementById("score").textContent = data;
}

function getScore() {
    score = score + 1;
    setScore(score);
}

function clearScore() {
    score = 0;
    setScore(score);
}

function toMix() {
    mixItems = getItems();
    mixItems.sort(function () {
        return Math.random() - 0.5;
    });
}
function addComment(data) {
    let text = [
        "Новая игра начинается!",
        "Вы выuграли! Игра закончена!",
        "Повторяем игру!",
        ""
    ];
    document.getElementById("comment").textContent = text[data];


}

function gameOver() {
    if (mixItems.join(":") == getItems().join(":")) {
        addComment(1);
        dellocalStorage();
        return true;
    }
    return false;
}

function newGame() {
    hidecontinueGame();
    //Очистить количество ходов
    clearScore();
    //Подбор валидного решения
    validate();
    //Сохранение текущей раскладки в localStorage
    setlocalStorage('mixItems');
    //Сохранить расклад для повтора
    setlocalStorage('newMixItems');
    //Сохранить счет
    setScorelocalStorage();
    //поле
    drawField();

}

function continueGame() {
    hidecontinueGame();
    mixItems = getlocalStorage('mixItems');
    getScorelocalStorage();
    setScore(score);
    //поле
    drawField();
}

function repeatGame() {
    console.log("ghjfdfdf");
    hidecontinueGame();
    mixItems = getlocalStorage('newMixItems');
    console.log(mixItems);
    clearScore();
    //поле
    drawField();
}

//спрятать кнопку Продолжить
function hidecontinueGame() {
    document.getElementById("continue-game").style.display = "none";
}

//нарисовать поле с костяшками 
function drawField() {
    let canvas = document.getElementById("canvas");
    let ctx = canvas.getContext('2d');
    //поле
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    //формат текста на костяшках
    ctx.font = 'bold 30px Verdana ';
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    let k = 0;
    while (k < 16) {
        //костяшки
        let x = k % 4 * (sizeCell + interval) + interval;
        let y = Math.floor(k / 4) * (sizeCell + interval) + interval;
        ctx.fillStyle = "#8FBC8F";
        ctx.fillRect(x, y, sizeCell, sizeCell);
        //текст на костяшках
        ctx.fillStyle = '#556B2F';
        //змаенить 16 на пусто
        ctx.fillText(mixItems[k] == 16 ? "" : mixItems[k], x + sizeCell / 2, y + sizeCell / 2);
        k++;
    }
}

//Проверить решаемость
function validate() {
    let k;
    while (true) {
        toMix();
        k = 0;
        for (let i = 0; i < 15; i++) {
            if (mixItems[i] == 16) {
                k = Math.floor(i / 4) + 1;
            } else {
                for (let j = i; j < 15; j++) {
                    if (mixItems[i] > mixItems[j]) {
                        k++;
                    }
                }
            }
        }
        if (k % 2 == 0) break;
    }
}

//Записать в localStorage расклад и количество ходов 
function setlocalStorage(data) {
    localStorage.setItem('score', score);
    localStorage.setItem(data, mixItems);
}
//Записать в localStorage счет 
function setScorelocalStorage() {
    localStorage.setItem('score', score);
}

//Получить  из localStorage расклад и количество ходов 
function getlocalStorage(name) {
    let data = localStorage.getItem(name);
    if (data) {
        //загрузка сохраненной игры
        data = data.split(",");
        data.forEach(function (item, i, data) {
            data[i] = +item;
        });
        return data;
    }
    return false;
}

//Получить  из localStorage количество ходов 
function getScorelocalStorage() {
    score = localStorage.getItem('score') * 1;
}

//Удалить из localStorage расклад и количество ходов 
function dellocalStorage() {
    localStorage.removeItem('mixItems');
    localStorage.removeItem('score');
}

//Записать в SessionStorage признак перезагрузки 
function setSessionStorage() {
    sessionStorage.setItem("is_reloaded", true)
}

//Получить  из SessionStorage признак перезагрузки 
function getSessionStorage() {
    return sessionStorage.getItem("is_reloaded");
}

//Получить финишный расклад 
function getItems() {
    let data = [];
    for (let i = 1; i < 17; i++) {
        data.push(i);
    }
    return data;
}



if (getSessionStorage()) {
    continueGame();
} else {
    drawField();
}