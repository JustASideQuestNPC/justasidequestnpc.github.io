import { TRuntimeError } from "./interpreter/common.js";
const BASE_COLORS = [
    "#000000",
    "#616178",
    "#ffffff",
    "#f54242",
    "#f57e42",
    "#f5dd42",
    "#78f542",
    "#42f59c",
    "#42d1f5",
    "#4245f5",
    "#aa42f5",
    "#f542dd",
];
function drawShape(p5, shape) {
    switch (shape.type) {
        case "line":
            p5.stroke(shape.color);
            p5.strokeWeight(shape.thickness);
            p5.line(shape.start.x, shape.start.y, shape.end.x, shape.end.y);
            break;
        case "polygon":
            p5.noStroke();
            p5.fill(shape.color);
            p5.beginShape();
            for (const v of shape.vertices) {
                p5.vertex(v.x, v.y);
            }
            p5.endShape("close");
            break;
    }
}
export default class Turtle {
    constructor(p5, glideSpeed, startX, startY) {
        this.p5 = p5;
        this.initialGlideSpeed = glideSpeed;
        this.startPos = this.p5.createVector(startX, startY);
        this.position = this.p5.createVector();
        this.glidePos = this.p5.createVector();
        this.resetAll();
    }
    resetAll() {
        this.resetPosition();
        this.resetPen();
        this.resetDrawnShapes();
        this.glideSpeed = this.initialGlideSpeed;
    }
    resetPosition() {
        this.position.set(this.startPos);
        this.heading = -Math.PI / 2;
        this.hideSprite = false;
        this.gliding = false;
    }
    resetDrawnShapes() {
        this.currentShape = null;
        this.drawnShapes = [];
    }
    resetPen() {
        this.currentColor = this.p5.color(0);
        this.lineThickness = 2;
        this.drawingPolygon = false;
        this.drawing = true;
    }
    updateGlide() {
        if (this.gliding) {
            const dt = this.p5.deltaTime / 1000;
            const moveDistance = this.glideSpeed * dt;
            if (moveDistance > this.position.dist(this.glidePos)) {
                this.position.set(this.glidePos);
                if (this.currentShape) {
                    const shape = this.currentShape;
                    switch (shape.type) {
                        case "line":
                            shape.end.set(this.position);
                            break;
                        case "polygon":
                            shape.vertices[shape.vertices.length - 1].set(this.position);
                            break;
                    }
                    if (this.currentShape.type !== "polygon") {
                        this.drawnShapes.push(this.currentShape);
                    }
                }
                this.gliding = false;
                this.parentInterpreter.resumeGlide();
            }
            else {
                const moveAngle = this.glidePos.copy().sub(this.position).heading();
                this.position.add(Math.cos(moveAngle) * moveDistance, Math.sin(moveAngle) * moveDistance);
                if (this.currentShape) {
                    const shape = this.currentShape;
                    switch (shape.type) {
                        case "line":
                            shape.end.set(this.position);
                            break;
                        case "polygon":
                            shape.vertices[shape.vertices.length - 1].set(this.position);
                            break;
                    }
                }
            }
        }
    }
    render() {
        for (const shape of this.drawnShapes) {
            drawShape(this.p5, shape);
        }
        if (this.currentShape) {
            drawShape(this.p5, this.currentShape);
        }
        if (this.hideSprite) {
            return;
        }
        this.p5.stroke("#000000");
        this.p5.strokeWeight(2);
        this.p5.fill("#ffffff");
        this.p5.push();
        this.p5.translate(this.position);
        this.p5.rotate(this.heading + Math.PI / 2);
        this.p5.triangle(0, -10, 7, 10, -7, 10);
        this.p5.pop();
    }
    async moveFwd(distance) {
        this.glidePos.set(this.position.x + Math.cos(this.heading) * distance, this.position.y + Math.sin(this.heading) * distance);
        if (this.glideSpeed <= 0) {
            if (this.drawing && !this.drawingPolygon) {
                this.drawnShapes.push({
                    type: "line",
                    thickness: this.lineThickness,
                    color: this.currentColor,
                    start: this.position.copy(),
                    end: this.glidePos.copy()
                });
            }
            this.position.set(this.glidePos);
        }
        else {
            this.gliding = true;
            if (this.drawing && !this.drawingPolygon) {
                this.currentShape = {
                    type: "line",
                    thickness: this.lineThickness,
                    color: this.currentColor,
                    start: this.position.copy(),
                    end: this.position.copy()
                };
            }
        }
    }
    async setColor(c) {
        const i = ((c % BASE_COLORS.length) + BASE_COLORS.length) % BASE_COLORS.length;
        this.currentColor = this.p5.color(BASE_COLORS[i]);
    }
    async setColorRgb(r, g, b) {
        if (this.drawingPolygon) {
            return;
        }
        this.currentColor = this.p5.color(r, g, b);
    }
    async setColorCss(str) {
        this.currentColor = this.p5.color(str);
    }
    async penUp() {
        if (this.drawingPolygon) {
            return;
        }
        this.drawing = false;
    }
    async penDown() {
        if (this.drawingPolygon) {
            return;
        }
        this.drawing = true;
    }
    async beginPoly() {
        if (this.drawingPolygon || !this.drawing) {
            return;
        }
        if (this.currentShape) {
            this.drawnShapes.push(this.currentShape);
        }
        this.currentShape = {
            type: "polygon",
            color: this.currentColor,
            vertices: [this.position.copy(), this.position.copy()]
        };
        this.drawingPolygon = true;
    }
    async endPoly() {
        if (!this.drawingPolygon) {
            return;
        }
        this.dropVertex();
        this.drawnShapes.push(this.currentShape);
        this.currentShape = null;
        this.drawingPolygon = false;
    }
    async dropVertex() {
        if (!this.drawingPolygon) {
            return;
        }
        if (this.currentShape && this.currentShape.type === "polygon") {
            this.currentShape.vertices[this.currentShape.vertices.length - 1].set(this.position);
            this.currentShape.vertices.push(this.position.copy());
        }
        else {
            throw new TRuntimeError("Cannot drop vertices in a non-polygon.");
        }
    }
}
//# sourceMappingURL=turtle.js.map