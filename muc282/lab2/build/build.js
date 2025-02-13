const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 600;
let phaseSlider;
let pauseButton;
let maskBuffer;
let moonImage;
let asyncLoadingComplete = false;
let paused = false;
let usingSlider = false;
let currentPhase = 0;
function drawMoon(phase) {
    maskBuffer.background("#000000");
    maskBuffer.push();
    maskBuffer.translate(maskBuffer.width / 2, maskBuffer.height / 2);
    maskBuffer.scale(2.1);
    maskBuffer.noStroke();
    if (phase > 0 && phase < 16) {
        maskBuffer.erase();
        maskBuffer.arc(0, 0, 200, 200, -PI / 2, PI / 2);
        maskBuffer.noErase();
        if (phase < 8) {
            maskBuffer.fill("#000000");
            maskBuffer.arc(0, 0, map(phase, 0, 8, 200, 0), 200, -PI / 2, PI / 2);
        }
        else if (phase > 8) {
            maskBuffer.erase();
            maskBuffer.arc(0, 0, map(phase, 8, 16, 0, 200), 200, PI / 2, PI * 3 / 2);
            maskBuffer.noErase();
        }
    }
    else if (phase === 16) {
        maskBuffer.erase();
        maskBuffer.circle(0, 0, 200);
        maskBuffer.noErase();
    }
    else if (phase > 16 && phase < 32) {
        maskBuffer.erase();
        maskBuffer.arc(0, 0, 200, 200, PI / 2, PI * 3 / 2);
        maskBuffer.noErase();
        if (phase < 24) {
            maskBuffer.erase();
            maskBuffer.arc(0, 0, map(phase, 16, 24, 200, 0), 200, -PI / 2, PI / 2);
            maskBuffer.noErase();
        }
        else if (phase > 24) {
            maskBuffer.fill("#000000");
            maskBuffer.arc(0, 0, map(phase, 24, 32, 0, 200), 200, PI / 2, PI * 3 / 2);
        }
    }
    maskBuffer.pop();
    imageMode("center");
    image(moonImage, width / 2, height / 2, 500, 500);
    imageMode("corner");
    image(maskBuffer, 0, 0);
}
function setup() {
    const canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    phaseSlider = createSlider(0, 32, 16, 0.1)
        .id("phaseSlider")
        .parent("buttonContainer")
        .style("margin-top", 10)
        .mousePressed(() => {
        paused = true;
        usingSlider = true;
        pauseButton.html("Unpause");
    });
    pauseButton = createButton("pause")
        .parent("buttonContainer")
        .size(100, 30)
        .style("text-align", "center")
        .style("font-size", "20px")
        .html("Pause")
        .mouseClicked(() => {
        paused = !paused;
        pauseButton.html(paused ? "Unpause" : "Pause");
        if (!paused) {
            usingSlider = false;
        }
    });
    maskBuffer = createGraphics(CANVAS_WIDTH, CANVAS_HEIGHT);
    const rootPath = document.body.getAttribute("data-root");
    moonImage = loadImage(rootPath + "/assets/FullMoon2010.jpg", () => { asyncLoadingComplete = true; });
    document.querySelector("canvas").addEventListener("contextmenu", e => e.preventDefault());
    canvas.parent("sketchContainer");
}
function draw() {
    if (!asyncLoadingComplete) {
        background("#000000");
        textSize(64);
        textAlign("center", "center");
        noStroke();
        fill("#ffffff");
        text("Loading...", width / 2, height / 2);
        return;
    }
    if (!paused) {
        currentPhase += 6 * deltaTime / 1000;
        if (currentPhase >= 32) {
            currentPhase = 0;
        }
    }
    else if (usingSlider) {
        currentPhase = phaseSlider.value();
    }
    background("#000000");
    drawMoon(currentPhase);
    textSize(24);
    textAlign("left", "top");
    noStroke();
    fill("#00ff00");
    text(currentPhase.toFixed(1), 5, 10);
}
//# sourceMappingURL=build.js.map