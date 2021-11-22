var canvas = document.getElementById('canvasSokoban');
var ctx = canvas.getContext('2d');

var keyBind = []; // массив клавиш, которые прожимает игрок

var startStorekeeperX; // начальная точка спавна игрока
var startStorekeeperY;
var storeKeeperRadius = 25; // радиус круга игрока

const cellSize = 60; // размер ячейки игрового поля

var map =
    `XXXXXXXXXXXXXXXXXXXXXX
XXXXX   XXXXXXXXXXXXXX
XXXXX*  XXXXXXXXXXXXXX
XXX  *XXXXXXXXXXXXXXXX
X  *  * XXXXXXXXXXXXXX
XXX X XXX XXXXXXXXXXXX
X   X XXX XXXXXXX  ..X
X *  *             ..X
XXXXX XXXX X@XXXX  ..X
XXXXX      XXXXXXXXXXX
XXXXXXXXXXXXXXXXXXXXXX`

// Create 2mernie massive test
/*var matrix = [];
for (var i = 0; i < 10; i++) {
    matrix[i] = [];
    for (var j = 0; j < 10; j++) {
        matrix[i][j] = Math.random() * 5 + 2;
        console.log(matrix[i][j]);
    }
}*/

var mapLengthX = 22; // нужно изменить !!!
var mapLengthY = 11;


document.addEventListener('keydown', function (e) {
    if (e.repeat == false) { // чтобы не улетал шарик
        keyBind.push(e.code);
    }
})

function checkMove(direction) {
    console.log(indexPlayerI + " " + indexPlayerJ);
    if (direction == 'u') {
        if (matrix[indexPlayerI - 1][indexPlayerJ] != "X") {
            indexPlayerI--;
            return true;
        }
    }
    if (direction == 'd') {
        if (matrix[indexPlayerI + 1][indexPlayerJ] != "X") {
            indexPlayerI++;
            return true;
        }
    }
    if (direction == 'l') {
        if (matrix[indexPlayerI][indexPlayerJ - 1] != "X") {
            indexPlayerJ--;
            return true;
        }
    }
    if (direction == 'r') {
        if (matrix[indexPlayerI][indexPlayerJ + 1] != "X") {
            indexPlayerJ++;
            return true;
        }
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
        if (checkMove('u')) {
            this.y -= cellSize;
        }
    }

    Down() {
        if (checkMove('d')) {
            this.y += cellSize;
        }
    }

    Left() {
        if (checkMove('l')) {
            this.x -= cellSize;
        }
    }

    Right() {
        if (checkMove('r')) {
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

}

var i = 0;
var matrix = [];
matrix[i] = [];
var indexPlayerI = 0;
var indexPlayerJ = 0;
const img = new Image();
img.src = "images/copy.png";

class Storage {
    constructor(width, height) {
        this.w = width;
        this.h = height;
    }

    initStartGameField() {
        ctx.drawImage(img, mapLengthX * cellSize + 120, 0);
        ctx.strokeStyle = "grey";
        for (let dx = 0; dx <= this.w; dx += cellSize) ctx.strokeRect(dx, 0, 0, this.h);
        for (let dy = 0; dy <= this.h; dy += cellSize) ctx.strokeRect(0, dy, this.w, 0);
        var x = 0;
        var y = 0;
        for (let elem of map) {
            if (elem == "X") {
                matrix[i].push(elem);

                ctx.beginPath();
                ctx.fillStyle = "black";
                ctx.fillRect(x, y, cellSize, cellSize);
                ctx.closePath();

                /*ctx.drawImage(img, x, y, cellSize, cellSize);
                console.log("Image!");*/
            } else if (elem == "@") {
                matrix[i].push(elem);
                startStorekeeperX = x + cellSize / 2;
                startStorekeeperY = y + cellSize / 2;
                indexPlayerI = i;
                indexPlayerJ = matrix[i].indexOf(elem, indexPlayerI);
                // console.log(indexPlayerI + " " + indexPlayerJ);
            } else if (elem == "\n") {
                i++;
                matrix[i] = [];
                x = 0 - cellSize;
                y += cellSize;
            } else if (elem == " ") {
                matrix[i].push(elem);
            } else if (elem == "*") {
                matrix[i].push(elem);
                ctx.beginPath();
                ctx.fillStyle = "blue";
                ctx.fillRect(x, y, cellSize, cellSize);
                ctx.closePath();
            } else if (elem == ".") {
                matrix[i].push(elem);
                ctx.beginPath();
                ctx.fillStyle = "red";
                ctx.fillRect(x, y, cellSize, cellSize);
                ctx.closePath();
            }
            x += cellSize;
        }
    }

    Draw() {

    }
}

function StartGame() {
    canvas.width = window.innerWidth - cellSize / 2;
    canvas.height = window.innerHeight - cellSize / 2;

    storage = new Storage(mapLengthX * cellSize, mapLengthY * cellSize);
    storage.initStartGameField();

    player = new Player(startStorekeeperX, startStorekeeperY);
    player.Draw();
    requestAnimationFrame(Update);

    // for (let i = 0; i < mapLengthY; i++) {
    //     for (let j = 0; j < mapLengthX; j++) {
    //         console.log(matrix[i][j]);
    //     }
    // }
}

function Update() {
    ctx.clearRect(player.x - cellSize / 2 + 1, player.y - cellSize / 2 + 1, cellSize - 2, cellSize - 2);
    // storage.initStartGameField();
    player.Animate();
    requestAnimationFrame(Update);
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