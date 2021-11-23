var canvas = document.getElementById('canvasSokoban');
var ctx = canvas.getContext('2d');
var keyBind = []; // массив клавиш, которые прожимает игрок
var startStorekeeperX; // начальная точка спавна игрока
var startStorekeeperY;
var storeKeeperRadius = 25; // радиус круга игрока
const cellSize = 60; // размер ячейки игрового поля
// инициализация матрицы для работы с информацией по мапе
var i = 0;
var matrix = [];
matrix[i] = [];
var indexPlayerI = 0; // индексы текущего положения игрока на мапе матрицы
var indexPlayerJ = 0;
const img = new Image(); // картинка стенки которая не работает :(:(:((:(
img.src = "images/copy.png";
var emptyseatsI = [];
var emptyseatsJ = [];
var gameOver = false;
let goNextMessage = "Перейти на следующий уровень?";
var currLevel = 0;
var WALL = "wall";
var CASE = "container";
var FP = "finishPlace";

var map = [];
map.push(`    XXXXX             
    X   X             
    X*  X             
  XXX  *XXX           
  X  *  * X           
XXX X XXX X     XXXXXX
X   X XXX XXXXXXX  ..X
X *  *             ..X
XXXXX XXXX X@XXXX  ..X
    X      XXX  XXXXXX
    XXXXXXXX          `);

map.push(`XXXXXXXXXXXX  
X..  X     XXX
X..  X *  *  X
X..  X*XXXX  X
X..    @ XX  X
X..  X X  * XX
XXXXXX XX* * X
  X *  * * * X
  X    X     X
  XXXXXXXXXXXX`);

map.push(`        XXXXXXXX 
        X     @X 
        X *X* XX 
        X *  *X  
        XX* * X  
XXXXXXXXX * X XXX
X....  XX *  *  X
XX...    *  *   X
X....  XXXXXXXXXX
XXXXXXXX         `);

document.addEventListener('keydown', function (e) {
    // if (e.repeat == false) { // чтобы не улетал шарик
    keyBind.push(e.code);
    // }
})

function ClearMatrix() {
    i = 0;
    matrix = [];
    matrix[i] = [];
    emptyseatsI = [];
    emptyseatsJ = [];
}

function CheckMove(direction) {
    // console.log(indexPlayerI + " " + indexPlayerJ);
    if (direction == 'u' && matrix[indexPlayerI - 1][indexPlayerJ] != "X") {
        if (matrix[indexPlayerI - 1][indexPlayerJ] == "*") {
            if (matrix[indexPlayerI - 1 - 1][indexPlayerJ] != "X" && matrix[indexPlayerI - 1 - 1][indexPlayerJ] != "*") {
                this.case = new Container(indexPlayerI - 1, indexPlayerJ, indexPlayerI - 1 - 1, indexPlayerJ);
                this.case.reDraw();
            } else {
                return false;
            }
        }
        indexPlayerI--;
        return true;
    }
    if (direction == 'd' && matrix[indexPlayerI + 1][indexPlayerJ] != "X") {
        if (matrix[indexPlayerI + 1][indexPlayerJ] == "*") {
            if (matrix[indexPlayerI + 1 + 1][indexPlayerJ] != "X" && matrix[indexPlayerI + 1 + 1][indexPlayerJ] != "*") {
                this.case = new Container(indexPlayerI + 1, indexPlayerJ, indexPlayerI + 1 + 1, indexPlayerJ);
                this.case.reDraw();
            } else {
                return false;
            }
        }
        indexPlayerI++;
        return true;
    }
    if (direction == 'l' && matrix[indexPlayerI][indexPlayerJ - 1] != "X") {
        if (matrix[indexPlayerI][indexPlayerJ - 1] == "*") {
            if (matrix[indexPlayerI][indexPlayerJ - 1 - 1] != "X" && matrix[indexPlayerI][indexPlayerJ - 1 - 1] != "*") {
                this.case = new Container(indexPlayerI, indexPlayerJ - 1, indexPlayerI, indexPlayerJ - 1 - 1);
                this.case.reDraw();
            } else {
                return false;
            }
        }
        indexPlayerJ--;
        return true;
    }
    if (direction == 'r' && matrix[indexPlayerI][indexPlayerJ + 1] != "X") {
        if (matrix[indexPlayerI][indexPlayerJ + 1] == "*") {
            if (matrix[indexPlayerI][indexPlayerJ + 1 + 1] != "X" && matrix[indexPlayerI][indexPlayerJ + 1 + 1] != "*") {
                this.case = new Container(indexPlayerI, indexPlayerJ + 1, indexPlayerI, indexPlayerJ + 1 + 1);
                this.case.reDraw();
            } else {
                return false;
            }
        }
        indexPlayerJ++;
        return true;
    }
    return false;
}

class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.r = storeKeeperRadius;
    }

    Up() {
        if (CheckMove('u')) {
            this.y -= cellSize;
        }
    }

    Down() {
        if (CheckMove('d')) {
            this.y += cellSize;
        }
    }

    Left() {
        if (CheckMove('l')) {
            this.x -= cellSize;
        }
    }

    Right() {
        if (CheckMove('r')) {
            this.x += cellSize;
        }
    }

    Draw() {
        ctx.beginPath();
        ctx.lineWidth = 4;
        ctx.strokeStyle = "black";
        ctx.fillStyle = "purple";
        ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fill();
        ctx.closePath();
    }

    Animate() {
        if (keyBind.includes("KeyW")) {
            this.Up();
            keyBind.pop("keyW");
        } else if (keyBind.includes("KeyA")) {
            this.Left();
            keyBind.pop("keyA");
        } else if (keyBind.includes("KeyS")) {
            this.Down();
            keyBind.pop("keyS");
        } else if (keyBind.includes("KeyD")) {
            this.Right();
            keyBind.pop("keyD");
        }
        this.Draw();
    }
}

class Container {
    constructor(i, j, nextI, nextJ) {
        this.i = i; // текущее положение контейнера в мапе матрицы
        this.j = j;
        this.nextI = nextI; // положение когда мы двигаем контейнер
        this.nextJ = nextJ;
    }

    reDraw() {
        matrix[this.nextI][this.nextJ] = "*"; // след ячейке мапы мы даем понять что теперь там наш контейнер
        matrix[this.i][this.j] = " "; // а пред положению показываем что там контейнера уже нет
        ctx.clearRect(this.j * 60 + 1, this.i * 60 + 1, cellSize - 2, cellSize - 2); // очищаем ячейку с пред положением
        ctx.beginPath();
        ctx.fillStyle = "blue"; // рисуем контейнер на новом положении
        ctx.fillRect(this.nextJ * 60 + 1, this.nextI * 60 + 1, cellSize - 2, cellSize - 2);
        ctx.closePath();
        gameOver = CheckContainerPositions();
    }
}

class Storage {
    constructor(width, height) {
        this.w = width;
        this.h = height;
    }

    initStartGameField() {
        // ctx.strokeStyle = "grey";
        // for (let dx = 0; dx <= this.w; dx += cellSize) ctx.strokeRect(dx, 0, 0, this.h);
        // for (let dy = 0; dy <= this.h; dy += cellSize) ctx.strokeRect(0, dy, this.w, 0);
        var x = 0;
        var y = 0;
        for (let elem of map[currLevel]) {
            if (elem == "X") {
                matrix[i].push(elem);

                DrawThisItem(WALL, x, y);

                /*ctx.drawImage(img, x, y, cellSize, cellSize);
                console.log("Image!");*/
            } else if (elem == "@") {
                matrix[i].push(elem);

                startStorekeeperX = x + cellSize / 2;
                startStorekeeperY = y + cellSize / 2;
                indexPlayerI = i;
                indexPlayerJ = matrix[i].indexOf(elem, i);
            } else if (elem == "\n") {
                i++;
                matrix[i] = [];
                x = 0 - cellSize;
                y += cellSize;
            } else if (elem == " ") {
                matrix[i].push(elem);
            } else if (elem == "*") {
                matrix[i].push(elem);

                DrawThisItem(CASE, x, y);
            } else if (elem == ".") {
                matrix[i].push(elem);

                emptyseatsI.push(i);
                emptyseatsJ.push(matrix[i].length - 1);

                DrawThisItem(FP, x, y);
            }
            x += cellSize;
        }
    }
}

function DrawThisItem(item, x, y) {
    if (item == "container") {
        ctx.beginPath();
        ctx.fillStyle = "blue";
        ctx.fillRect(x + 1, y + 1, cellSize - 2, cellSize - 2);
        ctx.closePath();
    }
    if (item == "wall") {
        ctx.beginPath();
        ctx.fillStyle = "black";
        ctx.fillRect(x, y, cellSize, cellSize);
        ctx.closePath();
    }
    if (item == "finishPlace") {
        ctx.beginPath();
        ctx.strokeStyle = "red";
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, cellSize, cellSize);
        // ctx.fillStyle = "red";
        // ctx.fillRect(x + 1, y + 1, cellSize - 2, cellSize - 2);
        ctx.closePath();
    }
}

function CheckContainerPositions() {
    let yourWin = false;
    for (let i = 0; i < numOfContainers; i++) {
        if (matrix[emptyseatsI[i]][emptyseatsJ[i]] != "*") {
            return yourWin;
        }
    }
    yourWin = true;
    return yourWin;
}

function StartGame() {
    canvas.width = window.innerWidth - cellSize / 2;
    canvas.height = window.innerHeight - cellSize / 2;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let mapLengthX = map[currLevel].indexOf("\n");
    let mapLengthY = map[currLevel].split("\n").length;

    storage = new Storage(mapLengthX * cellSize, mapLengthY * cellSize);
    storage.initStartGameField();

    var numOfContainers = map[currLevel]
        .replaceAll("X", "")
        .replaceAll("*", "")
        .replaceAll("@", "")
        .replaceAll(" ", "")
        .replaceAll("\n", "").length;

    player = new Player(startStorekeeperX, startStorekeeperY);
    player.Draw();
    requestAnimationFrame(Update);

    // console.log("x = " + mapLengthX + " y = " + mapLengthY); // easy search size of map[currLevel] ;];];]
    //
    // console.log(map[currLevel].replaceAll("X", "")
    //                 .replaceAll("*", "")
    //                 .replaceAll("@", "")
    //                 .replaceAll(" ", "")
    //                 .replaceAll("\n", "").length);
    //
    // console.log(matrix[i].includes("."));
    //
    // console.log(emptyseatsI);
    // console.log(emptyseatsJ);
}

function Update() {
    if (!gameOver) {
        requestAnimationFrame(Update);
    } else if (confirm(goNextMessage)) {
        currLevel++;
        ClearMatrix();
        StartGame();
    } else {
        window.close();
    }
    // console.log(CheckContainerPositions());
    ctx.clearRect(player.x - cellSize / 2 + 1, player.y - cellSize / 2 + 1, cellSize - 2, cellSize - 2);
    // storage.initStartGameField();
    player.Animate();
    // requestAnimationFrame(Update);
}

StartGame();

// For searching bag with img = wall image
// canvas.width = window.innerWidth - cellSize / 2;
// canvas.height = window.innerHeight - cellSize / 2;
//
// storage = new Storage(mapLengthX * cellSize, mapLengthY * cellSize);
// storage.initStartGameField();

//resize bag fix
let canvasPosition = canvas.getBoundingClientRect();
window.addEventListener('resize', function () {
    canvasPosition = canvas.getBoundingClientRect();
});