var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var _cellGrid, _visitedCells, _cellPath, _width, _height, _displayWidth, _displayHeight, _generated, _hasWatched;
const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 600;
const MAZE_WIDTH = 15;
const MAZE_HEIGHT = 15;
const STEP_DELAY = 1;
;
const cellDisplayWidth = CANVAS_WIDTH / MAZE_WIDTH;
const cellDisplayHeight = CANVAS_HEIGHT / MAZE_HEIGHT;
function arrayContainsPair(array, pair) {
    for (const item of array) {
        if (item[0] === pair[0] && item[1] === pair[1]) {
            return true;
        }
    }
    return false;
}
function randInt(low, high) {
    if (high === undefined) {
        high = low;
        low = 0;
    }
    return floor(random(low, high));
}
let resetButton;
let pauseButton;
let stepButton;
let watchButton;
class Maze {
    constructor(mazeWidth, mazeHeight, displayWidth, displayHeight) {
        _cellGrid.set(this, void 0);
        _visitedCells.set(this, []);
        _cellPath.set(this, []);
        _width.set(this, void 0);
        _height.set(this, void 0);
        _displayWidth.set(this, void 0);
        _displayHeight.set(this, void 0);
        _generated.set(this, void 0);
        _hasWatched.set(this, false);
        this.paused = true;
        this.watchMode = false;
        __classPrivateFieldSet(this, _width, mazeWidth);
        __classPrivateFieldSet(this, _height, mazeHeight);
        __classPrivateFieldSet(this, _displayWidth, displayWidth);
        __classPrivateFieldSet(this, _displayHeight, displayHeight);
        this.reset();
    }
    reset() {
        __classPrivateFieldSet(this, _generated, false);
        __classPrivateFieldSet(this, _cellGrid, []);
        __classPrivateFieldSet(this, _visitedCells, []);
        __classPrivateFieldSet(this, _cellPath, []);
        __classPrivateFieldSet(this, _hasWatched, false);
        for (let x = 0; x < __classPrivateFieldGet(this, _width); ++x) {
            let column = [];
            for (let y = 0; y < __classPrivateFieldGet(this, _height); ++y) {
                column.push({
                    up: false,
                    down: false,
                    left: false,
                    right: false
                });
            }
            __classPrivateFieldGet(this, _cellGrid).push(column);
        }
        const startCell = [randInt(__classPrivateFieldGet(this, _width)), randInt(__classPrivateFieldGet(this, _height))];
        __classPrivateFieldGet(this, _cellPath).push(startCell);
        __classPrivateFieldGet(this, _visitedCells).push(startCell);
    }
    stepGenerator(ignorePause = false) {
        if (__classPrivateFieldGet(this, _generated) || (this.paused && !ignorePause)) {
            return;
        }
        const currentHead = __classPrivateFieldGet(this, _cellPath)[__classPrivateFieldGet(this, _cellPath).length - 1];
        const x = currentHead[0], y = currentHead[1];
        const adjacentCoords = [
            [x - 1, y],
            [x + 1, y],
            [x, y - 1],
            [x, y + 1]
        ];
        const adjacentCells = [];
        for (const cell of adjacentCoords) {
            if (cell[0] >= 0 && cell[0] < __classPrivateFieldGet(this, _width) && cell[1] >= 0 && cell[1] < __classPrivateFieldGet(this, _height) &&
                !arrayContainsPair(__classPrivateFieldGet(this, _visitedCells), cell)) {
                adjacentCells.push(cell);
            }
        }
        if (adjacentCells.length === 0) {
            if (this.watchMode && !__classPrivateFieldGet(this, _hasWatched)) {
                this.paused = true;
                pauseButton.html("Unpause");
                __classPrivateFieldSet(this, _hasWatched, true);
                return;
            }
            __classPrivateFieldGet(this, _cellPath).pop();
            if (__classPrivateFieldGet(this, _cellPath).length === 0) {
                __classPrivateFieldSet(this, _generated, true);
            }
        }
        else {
            __classPrivateFieldSet(this, _hasWatched, false);
            const newHead = adjacentCells[randInt(adjacentCells.length)];
            __classPrivateFieldGet(this, _visitedCells).push(newHead);
            __classPrivateFieldGet(this, _cellPath).push(newHead);
            const currentHeadDisplay = __classPrivateFieldGet(this, _cellGrid)[currentHead[0]][currentHead[1]];
            const newHeadDisplay = __classPrivateFieldGet(this, _cellGrid)[newHead[0]][newHead[1]];
            if (newHead[1] < currentHead[1]) {
                currentHeadDisplay.up = true;
                newHeadDisplay.down = true;
            }
            else if (newHead[1] > currentHead[1]) {
                currentHeadDisplay.down = true;
                newHeadDisplay.up = true;
            }
            else if (newHead[0] < currentHead[0]) {
                currentHeadDisplay.left = true;
                newHeadDisplay.right = true;
            }
            else {
                currentHeadDisplay.right = true;
                newHeadDisplay.left = true;
            }
        }
    }
    render() {
        push();
        translate(2, 2);
        for (let x = 0; x < __classPrivateFieldGet(this, _cellGrid).length; ++x) {
            for (let y = 0; y < __classPrivateFieldGet(this, _cellGrid)[x].length; ++y) {
                const cell = __classPrivateFieldGet(this, _cellGrid)[x][y];
                const top = y * __classPrivateFieldGet(this, _displayHeight);
                const bottom = (y + 1) * __classPrivateFieldGet(this, _displayHeight);
                const left = x * __classPrivateFieldGet(this, _displayWidth);
                const right = (x + 1) * __classPrivateFieldGet(this, _displayWidth);
                let fillColor;
                let coords = [x, y];
                if (arrayContainsPair(__classPrivateFieldGet(this, _cellPath), coords)) {
                    const head = __classPrivateFieldGet(this, _cellPath)[__classPrivateFieldGet(this, _cellPath).length - 1];
                    if (head[0] === x && head[1] === y) {
                        fillColor = "#52f75d";
                    }
                    else {
                        fillColor = "#ed4545";
                    }
                }
                else if (arrayContainsPair(__classPrivateFieldGet(this, _visitedCells), coords)) {
                    fillColor = "#ffffff";
                }
                else {
                    fillColor = "#a0a0a0";
                }
                noStroke();
                fill(fillColor);
                rect(left, top, __classPrivateFieldGet(this, _displayWidth), __classPrivateFieldGet(this, _displayHeight));
                stroke("#000000");
                strokeWeight(4);
                if (!cell.up) {
                    line(left, top, right, top);
                }
                if (!cell.down) {
                    line(left, bottom, right, bottom);
                }
                if (!cell.left) {
                    line(left, top, left, bottom);
                }
                if (!cell.right) {
                    line(right, top, right, bottom);
                }
            }
        }
        pop();
    }
    get width() { return __classPrivateFieldGet(this, _width); }
    get height() { return __classPrivateFieldGet(this, _height); }
    get displayWidth() { return __classPrivateFieldGet(this, _displayWidth); }
    get displayHeight() { return __classPrivateFieldGet(this, _displayHeight); }
    get generated() { return __classPrivateFieldGet(this, _generated); }
}
_cellGrid = new WeakMap(), _visitedCells = new WeakMap(), _cellPath = new WeakMap(), _width = new WeakMap(), _height = new WeakMap(), _displayWidth = new WeakMap(), _displayHeight = new WeakMap(), _generated = new WeakMap(), _hasWatched = new WeakMap();
let maze;
let canvasHovered = true;
function setup() {
    const canvas = createCanvas(CANVAS_WIDTH + 4, CANVAS_HEIGHT + 4);
    maze = new Maze(MAZE_WIDTH, MAZE_HEIGHT, cellDisplayWidth, cellDisplayHeight);
    resetButton = createButton("reset")
        .html("Reset")
        .size(100, 50)
        .style("text-align", "center")
        .style("font-size", "20px")
        .parent("buttonContainer");
    resetButton.mouseClicked(() => {
        maze.reset();
        maze.paused = true;
        pauseButton.html("Unpause");
    });
    pauseButton = createButton("toggle pause")
        .html("Unpause")
        .size(100, 50)
        .style("text-align", "center")
        .style("font-size", "20px")
        .parent("buttonContainer");
    pauseButton.mouseClicked(() => {
        maze.paused = !maze.paused;
        if (maze.paused) {
            pauseButton.html("Unpause");
        }
        else {
            pauseButton.html("Pause");
        }
    });
    stepButton = createButton("step")
        .html("Step")
        .size(100, 50)
        .style("text-align", "center")
        .style("font-size", "20px")
        .parent("buttonContainer");
    stepButton.mouseClicked(() => {
        if (maze.paused) {
            maze.stepGenerator(true);
        }
    });
    watchButton = createButton("toggle watch")
        .html("Watch Mode Disabled")
        .size(225, 50)
        .style("text-align", "center")
        .style("font-size", "20px")
        .parent("buttonContainer");
    watchButton.mouseClicked(() => {
        maze.watchMode = !maze.watchMode;
        if (maze.watchMode) {
            watchButton.html("Watch Mode Enabled");
        }
        else {
            watchButton.html("Watch Mode Disabled");
        }
    });
    canvas.mouseOver(() => {
        canvasHovered = true;
    });
    canvas.mouseOut(() => {
        canvasHovered = false;
    });
    canvas.mousePressed(_mousePressed);
    canvas.mouseReleased(_mouseReleased);
    document.querySelector("canvas").addEventListener("contextmenu", e => e.preventDefault());
    canvas.parent("sketchContainer");
}
function draw() {
    maze.stepGenerator();
    background("#808080");
    maze.render();
}
function _mousePressed() {
}
function _mouseReleased() {
}
function keyPressed(event) {
    if (canvasHovered && event.key !== "F12") {
        console.log(`pressed ${event.key}`);
        return false;
    }
}
function keyReleased(event) {
    if (canvasHovered && event.key !== "F12") {
        console.log(`released ${event.key}`);
        return false;
    }
}
//# sourceMappingURL=build.js.map