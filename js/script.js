'use strict';

const sizeCell = 70;
const interval = 4;

let button = document.querySelector(".buttons");
let empty = undefined;
let score = undefined;
let mixItems = [];

button.addEventListener('click', function (event) {
    switch (event.target.id) {
        case "new-game":
            newGame();
            break;
        case "load-game":
            loadGame();
            break;
        case "save-game":
            saveGame();
            break;
        case "repeat-game":
            repeatGame();
            break;
        default:
            break;
    }
    iSessionStorage.setSessionStorage();
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
    addComment('clear');
    //Обновление поля 
    drawField();
    if (gameOver()) {
        //Если расклад совпал с финальным
        addComment('over');
        score = 0;
    } else {
        setlocalStorage('currentItems');
        setScorelocalStorage('currentScore');
    }
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
    setScore("0");
}

function toMix() {
    mixItems = getItems();
    mixItems.sort(function () {
        return Math.random() - 0.5;
    });
}
function addComment(data) {
    let message = {
        new: "Новая игра начинается!",
        over: "Вы выuграли! Игра закончена!",
        repeat: "Повторяем игру!",
        norepeat: "Сохраненный расклад уже загружен!",
        nosave: "Нет сохраненных раскладов! Начните новую игру.",
        save: "Игра сохранена!",
        load: "Игра загружена!",
        nosavegame: "Нет сохраненных игр! Начните новую игру.",
        clear: "",
    };
    document.getElementById("comment").textContent = message[data];
}

function gameOver() {
    if (mixItems.join(":") == getItems().join(":")) {
        return true;
    }
    return false;
}

function newGame() {
    addComment('new');
    //Очистить счет
    score = 0;
    clearScore();
    //Сохранить счет
    setScorelocalStorage('currentScore');
    //Подбор валидного решения
    validate();
    //Сохранить расклад для повтора
    setlocalStorage('first');
    //Сохранить текущий расклад
    setlocalStorage('currentItems');
    //поле
    drawField();
}

function loadGame() {
    let data = getlocalStorage('saveItems');

    //Наличие сохраненной мгры
    if (!data) {
        addComment('nosavegame');
        return;
    }

    //Получить сохраненную игру
    mixItems = data;
    //Получить сохраненный счет
    score = getScorelocalStorage('saveScore');
    setScore(score);

    //Записать текуший расклад, счет и начальный расклад
    setlocalStorage('currentItems');
    setlocalStorage('first');
    setScorelocalStorage('currentScore');

    addComment('load');
    //Поле
    drawField();
}

function saveGame() {
    //Записать в localStorage счет 
    setScorelocalStorage('saveScore');
    //Записать в localStorage текущую позицию
    setlocalStorage('saveItems');
    setlocalStorage('savefirst');
    addComment('save');
}

function repeatGame() {
    let data = getlocalStorage('first');

    //Наличие сохраненной раскладки
    if (!data) {
        addComment('nosave');
        return;
    }

    //Совпадает текущий расклад с сохраненным
    if (mixItems.join(":") == data.join(":")) {
        addComment('norepeat');
        return;
    }
    addComment('repeat');
    mixItems = data;
    score = 0;
    clearScore();
    //поле
    drawField();
}

function uploadGame() {
    let data = getlocalStorage('currentItems');

    //Наличие текущей мгры
    if (!data) {
        newGame();
        return;
    }
    //Получить  игру
    mixItems = data;
    //Получить  счет
    score = getScorelocalStorage('currentScore');
    setScore(score);
    //Поле
    drawField();
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

//**********localStorage************ */
// currentItems - текущий расклад костяшек
// currentScore - текущий cчет
// first - начальный расклад (для кнопки повторить)
// saveItems - сохраненный пользователем текущий расклад костяшек
// saveScore - сохраненный пользователем текущий счет
// savefirst - сохраненный начальный расклад (для кнопки повторить)

//Записать в localStorage расклад или счет
function setlocalStorage(name) {
    localStorage.setItem(name, mixItems);
}

//Записать в localStorage расклад или счет
function setScorelocalStorage(name) {
    localStorage.setItem(name, score);
}

//Получить  из localStorage расклад 
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

//Получить  из localStorage счет 
function getScorelocalStorage(name) {
    return localStorage.getItem(name) * 1;
}

//Удалить из localStorage 
function dellocalStorage(name) {
    localStorage.removeItem(name);
}

class SessionStorage {   
    //Записать в SessionStorage признак перезагрузки 
    setSessionStorage() {
        sessionStorage.setItem("is_reloaded", true);
    }

    //Получить из SessionStorage признак перезагрузки 
    getSessionStorage() {
        return sessionStorage.getItem("is_reloaded");
    }
}
//Получить финишный расклад 
function getItems() {
    return [1, 2, 3, 4, 5, 6, 7, 6, 7, 10, 11, 12, 13, 14, 15, 16];
}

/**********Запуск********/
let iSessionStorage = new SessionStorage();
if (iSessionStorage.getSessionStorage()) {
    //При перезагрузке страницы
    uploadGame();
} else {
    //При загрузке новой страницы
    empty = 16;
    score = 0;
    mixItems = getItems();
    //поле
    drawField();
    iSessionStorage.setSessionStorage();
}