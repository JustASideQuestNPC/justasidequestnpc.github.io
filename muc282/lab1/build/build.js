var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Maze_cellGrid, _Maze_visitedCells, _Maze_cellPath, _Maze_width, _Maze_height, _Maze_displayWidth, _Maze_displayHeight, _Maze_generated, _Maze_hasWatched;
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
        _Maze_cellGrid.set(this, void 0);
        _Maze_visitedCells.set(this, []);
        _Maze_cellPath.set(this, []);
        _Maze_width.set(this, void 0);
        _Maze_height.set(this, void 0);
        _Maze_displayWidth.set(this, void 0);
        _Maze_displayHeight.set(this, void 0);
        _Maze_generated.set(this, void 0);
        _Maze_hasWatched.set(this, false);
        this.paused = true;
        this.watchMode = false;
        __classPrivateFieldSet(this, _Maze_width, mazeWidth, "f");
        __classPrivateFieldSet(this, _Maze_height, mazeHeight, "f");
        __classPrivateFieldSet(this, _Maze_displayWidth, displayWidth, "f");
        __classPrivateFieldSet(this, _Maze_displayHeight, displayHeight, "f");
        this.reset();
    }
    reset() {
        __classPrivateFieldSet(this, _Maze_generated, false, "f");
        __classPrivateFieldSet(this, _Maze_cellGrid, [], "f");
        __classPrivateFieldSet(this, _Maze_visitedCells, [], "f");
        __classPrivateFieldSet(this, _Maze_cellPath, [], "f");
        __classPrivateFieldSet(this, _Maze_hasWatched, false, "f");
        for (let x = 0; x < __classPrivateFieldGet(this, _Maze_width, "f"); ++x) {
            let column = [];
            for (let y = 0; y < __classPrivateFieldGet(this, _Maze_height, "f"); ++y) {
                column.push({
                    up: false,
                    down: false,
                    left: false,
                    right: false
                });
            }
            __classPrivateFieldGet(this, _Maze_cellGrid, "f").push(column);
        }
        const startCell = [randInt(__classPrivateFieldGet(this, _Maze_width, "f")), randInt(__classPrivateFieldGet(this, _Maze_height, "f"))];
        __classPrivateFieldGet(this, _Maze_cellPath, "f").push(startCell);
        __classPrivateFieldGet(this, _Maze_visitedCells, "f").push(startCell);
    }
    stepGenerator(ignorePause = false) {
        if (__classPrivateFieldGet(this, _Maze_generated, "f") || (this.paused && !ignorePause)) {
            return;
        }
        const currentHead = __classPrivateFieldGet(this, _Maze_cellPath, "f")[__classPrivateFieldGet(this, _Maze_cellPath, "f").length - 1];
        const x = currentHead[0], y = currentHead[1];
        const adjacentCoords = [
            [x - 1, y],
            [x + 1, y],
            [x, y - 1],
            [x, y + 1]
        ];
        const adjacentCells = [];
        for (const cell of adjacentCoords) {
            if (cell[0] >= 0 && cell[0] < __classPrivateFieldGet(this, _Maze_width, "f") && cell[1] >= 0 && cell[1] < __classPrivateFieldGet(this, _Maze_height, "f") &&
                !arrayContainsPair(__classPrivateFieldGet(this, _Maze_visitedCells, "f"), cell)) {
                adjacentCells.push(cell);
            }
        }
        if (adjacentCells.length === 0) {
            if (this.watchMode && !__classPrivateFieldGet(this, _Maze_hasWatched, "f")) {
                this.paused = true;
                pauseButton.html("Unpause");
                __classPrivateFieldSet(this, _Maze_hasWatched, true, "f");
                return;
            }
            __classPrivateFieldGet(this, _Maze_cellPath, "f").pop();
            if (__classPrivateFieldGet(this, _Maze_cellPath, "f").length === 0) {
                __classPrivateFieldSet(this, _Maze_generated, true, "f");
            }
        }
        else {
            __classPrivateFieldSet(this, _Maze_hasWatched, false, "f");
            const newHead = adjacentCells[randInt(adjacentCells.length)];
            __classPrivateFieldGet(this, _Maze_visitedCells, "f").push(newHead);
            __classPrivateFieldGet(this, _Maze_cellPath, "f").push(newHead);
            const currentHeadDisplay = __classPrivateFieldGet(this, _Maze_cellGrid, "f")[currentHead[0]][currentHead[1]];
            const newHeadDisplay = __classPrivateFieldGet(this, _Maze_cellGrid, "f")[newHead[0]][newHead[1]];
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
        for (let x = 0; x < __classPrivateFieldGet(this, _Maze_cellGrid, "f").length; ++x) {
            for (let y = 0; y < __classPrivateFieldGet(this, _Maze_cellGrid, "f")[x].length; ++y) {
                const cell = __classPrivateFieldGet(this, _Maze_cellGrid, "f")[x][y];
                const top = y * __classPrivateFieldGet(this, _Maze_displayHeight, "f");
                const bottom = (y + 1) * __classPrivateFieldGet(this, _Maze_displayHeight, "f");
                const left = x * __classPrivateFieldGet(this, _Maze_displayWidth, "f");
                const right = (x + 1) * __classPrivateFieldGet(this, _Maze_displayWidth, "f");
                let fillColor;
                let coords = [x, y];
                if (arrayContainsPair(__classPrivateFieldGet(this, _Maze_cellPath, "f"), coords)) {
                    const head = __classPrivateFieldGet(this, _Maze_cellPath, "f")[__classPrivateFieldGet(this, _Maze_cellPath, "f").length - 1];
                    if (head[0] === x && head[1] === y) {
                        fillColor = "#52f75d";
                    }
                    else {
                        fillColor = "#ed4545";
                    }
                }
                else if (arrayContainsPair(__classPrivateFieldGet(this, _Maze_visitedCells, "f"), coords)) {
                    fillColor = "#ffffff";
                }
                else {
                    fillColor = "#a0a0a0";
                }
                noStroke();
                fill(fillColor);
                rect(left, top, __classPrivateFieldGet(this, _Maze_displayWidth, "f"), __classPrivateFieldGet(this, _Maze_displayHeight, "f"));
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
    get width() { return __classPrivateFieldGet(this, _Maze_width, "f"); }
    get height() { return __classPrivateFieldGet(this, _Maze_height, "f"); }
    get displayWidth() { return __classPrivateFieldGet(this, _Maze_displayWidth, "f"); }
    get displayHeight() { return __classPrivateFieldGet(this, _Maze_displayHeight, "f"); }
    get generated() { return __classPrivateFieldGet(this, _Maze_generated, "f"); }
}
_Maze_cellGrid = new WeakMap(), _Maze_visitedCells = new WeakMap(), _Maze_cellPath = new WeakMap(), _Maze_width = new WeakMap(), _Maze_height = new WeakMap(), _Maze_displayWidth = new WeakMap(), _Maze_displayHeight = new WeakMap(), _Maze_generated = new WeakMap(), _Maze_hasWatched = new WeakMap();
let maze;
let canvasHovered = true;
function setup() {
    const canvas = createCanvas(CANVAS_WIDTH + 4, CANVAS_HEIGHT + 4);
    maze = new Maze(MAZE_WIDTH, MAZE_HEIGHT, cellDisplayWidth, cellDisplayHeight);
    resetButton = createButton("reset")
        .html("Reset")
        .size(100, 50)
        .style("text-align", "center")
        .style("font-size", "20px");
    resetButton.mouseClicked(() => {
        maze.reset();
        maze.paused = true;
        pauseButton.html("Unpause");
    });
    pauseButton = createButton("toggle pause")
        .html("Unpause")
        .size(100, 50)
        .style("text-align", "center")
        .style("font-size", "20px");
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
        .style("font-size", "20px");
    stepButton.mouseClicked(() => {
        if (maze.paused) {
            maze.stepGenerator(true);
        }
    });
    watchButton = createButton("toggle watch")
        .html("Watch Mode Disabled")
        .size(225, 50)
        .style("text-align", "center")
        .style("font-size", "20px");
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