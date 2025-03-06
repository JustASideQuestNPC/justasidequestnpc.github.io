import { ParticleSystem } from "./ParticleSystem.js";
const MIN_NUM_BOIDS = 1;
const MAX_NUM_BOIDS = 50;
const INITIAL_NUM_BOIDS = 25;
const MIN_VIEW_RANGE = 50;
const MAX_VIEW_RANGE = 1000;
const INITIAL_VIEW_RANGE = 200;
const MIN_PROTECTED_DISTANCE = 0;
const MAX_PROTECTED_DISTANCE = 300;
const INITIAL_PROTECTED_DISTANCE = 75;
const MIN_SEPARATION = 0;
const MAX_SEPARATION = 20;
const INITIAL_SEPARATION = 5;
const MIN_COHESION = 0;
const MAX_COHESION = 20;
const INITIAL_COHESION = 5;
const MIN_ALIGNMENT = 0;
const MAX_ALIGNMENT = 20;
const INITIAL_ALIGNMENT = 5;
const MIN_WALL_AVOID = 0;
const MAX_WALL_AVOID = 20;
const INITIAL_WALL_AVOID = 5;
let numParticles = INITIAL_NUM_BOIDS;
function setupSlider(name, min, max, initialValue, onInput) {
    const container = document.getElementById(name);
    const valueDisplay = container.getElementsByTagName("span")[0];
    valueDisplay.innerText = initialValue.toString();
    const slider = container.getElementsByTagName("input")[0];
    slider.min = min.toString();
    slider.max = max.toString();
    slider.value = initialValue.toString();
    slider.oninput = () => {
        valueDisplay.innerText = slider.value;
        onInput(Number.parseFloat(slider.value));
    };
}
const s = (p5) => {
    let canvasHovered = true;
    let FONT_MONO;
    let fontLoaded = false;
    let particleSystem;
    const FRAME_COUNTER_BUFFER_SIZE = 30;
    const fpsBuffer = [];
    p5.setup = () => {
        globalThis.sketch = p5;
        globalThis.keyStates = {};
        const rootPath = document.body.getAttribute("data-root");
        FONT_MONO = p5.loadFont(`${rootPath}assets/IBMPlexMono-Medium.ttf`, () => {
            console.log("Successfully loaded FONT_MONO.");
            fontLoaded = true;
        }, () => {
            console.log("Failed to load FONT_MONO.");
        });
        const canvas = p5.createCanvas(1280, 720);
        canvas.parent("sketchContainer");
        p5.frameRate(100);
        p5.angleMode("degrees");
        particleSystem = new ParticleSystem(p5);
        const resetButton = document.getElementById("resetButton");
        resetButton.onclick = () => {
            particleSystem.removeAll();
            particleSystem.populate(numParticles);
        };
        setupSlider("numParticles", MIN_NUM_BOIDS, MAX_NUM_BOIDS, INITIAL_NUM_BOIDS, (value) => {
            numParticles = value;
            while (particleSystem.numParticles() < numParticles) {
                particleSystem.addParticle();
            }
            while (particleSystem.numParticles() > numParticles) {
                particleSystem.removeParticle();
            }
        });
        setupSlider("viewRange", MIN_VIEW_RANGE, MAX_VIEW_RANGE, INITIAL_VIEW_RANGE, (value) => {
            particleSystem.viewRange = value;
        });
        setupSlider("minDistance", MIN_PROTECTED_DISTANCE, MAX_PROTECTED_DISTANCE, INITIAL_PROTECTED_DISTANCE, (value) => {
            particleSystem.minDistance = value;
        });
        setupSlider("separation", MIN_SEPARATION, MAX_SEPARATION, INITIAL_SEPARATION, (value) => {
            particleSystem.separationFactor = value;
        });
        setupSlider("cohesion", MIN_COHESION, MAX_COHESION, INITIAL_COHESION, (value) => {
            particleSystem.cohesionFactor = value;
        });
        setupSlider("alignment", MIN_ALIGNMENT, MAX_ALIGNMENT, INITIAL_ALIGNMENT, (value) => {
            particleSystem.alignmentFactor = value;
        });
        setupSlider("wallAvoid", MIN_WALL_AVOID, MAX_WALL_AVOID, INITIAL_WALL_AVOID, (value) => {
            particleSystem.wallAvoidFactor = value;
        });
        particleSystem.viewRange = INITIAL_VIEW_RANGE;
        particleSystem.minDistance = INITIAL_PROTECTED_DISTANCE;
        particleSystem.separationFactor = INITIAL_SEPARATION;
        particleSystem.cohesionFactor = INITIAL_COHESION;
        particleSystem.alignmentFactor = INITIAL_ALIGNMENT;
        particleSystem.wallAvoidFactor = INITIAL_WALL_AVOID;
        particleSystem.populate(numParticles);
        canvas.mouseOver(() => {
            canvasHovered = true;
        });
        canvas.mouseOut(() => {
            canvasHovered = false;
        });
        canvas.mousePressed(mousePressed);
        canvas.mouseReleased(mouseReleased);
        document.querySelector("canvas").addEventListener("contextmenu", e => e.preventDefault());
    };
    p5.draw = () => {
        fpsBuffer.push(p5.frameRate());
        if (fpsBuffer.length > FRAME_COUNTER_BUFFER_SIZE) {
            fpsBuffer.shift();
        }
        const avgFps = fpsBuffer.reduce((p, c) => p + c, 0) / fpsBuffer.length;
        particleSystem.moveAll();
        p5.background("#22292f");
        particleSystem.renderAll();
        if (fontLoaded) {
            p5.noStroke();
            p5.fill("#000000a0");
            p5.rect(p5.width - 65, 0, 65, 20);
            p5.textFont(FONT_MONO, 16);
            p5.textAlign("right", "top");
            p5.fill("#00ff00");
            p5.text(Math.floor(avgFps) + " FPS", p5.width - 5, -2);
        }
    };
    p5.keyPressed = (event) => {
        if (canvasHovered && event.key !== "F12") {
            keyStates[event.key] = true;
            return false;
        }
    };
    p5.keyReleased = (event) => {
        if (canvasHovered && event.key !== "F12") {
            keyStates[event.key] = false;
            return false;
        }
    };
    function mousePressed() {
        keyStates[p5.mouseButton + " mouse"] = true;
    }
    function mouseReleased() {
        keyStates[p5.mouseButton + " mouse"] = false;
    }
};
const instance = new p5(s);
//# sourceMappingURL=main.js.map