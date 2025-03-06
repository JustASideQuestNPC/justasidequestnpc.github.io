function degToRad(angle) {
    return angle * Math.PI / 180;
}
function radToDeg(angle) {
    return angle * 180 / Math.PI;
}
var AngleUnit;
(function (AngleUnit) {
    AngleUnit[AngleUnit["DEGREES"] = 0] = "DEGREES";
    AngleUnit[AngleUnit["RADIANS"] = 1] = "RADIANS";
})(AngleUnit || (AngleUnit = {}));
export default class Vector2D {
    constructor(x, y) {
        if (typeof x === "number") {
            this.x = x;
            this.y = y;
        }
        else {
            this.x = 0;
            this.y = 0;
        }
    }
    static fromPolar(theta, radius, angleMode) {
        angleMode = (angleMode !== undefined ? angleMode : Vector2D.angleMode);
        if (angleMode === Vector2D.AngleUnit.DEGREES) {
            theta = degToRad(theta);
        }
        return new Vector2D(Math.cos(theta) * radius, Math.sin(theta) * radius);
    }
    toString() {
        return `Vector2D: (${this.x}, ${this.y})`;
    }
    set(x, y) {
        if (x instanceof Vector2D) {
            this.x = x.x;
            this.y = x.y;
        }
        else {
            this.x = x;
            this.y = y;
        }
        return this;
    }
    copy() {
        return new Vector2D(this.x, this.y);
    }
    add(x, y) {
        if (x instanceof Vector2D) {
            this.x += x.x;
            this.y += x.y;
        }
        else {
            this.x += x;
            this.y += y;
        }
        return this;
    }
    sub(x, y) {
        if (x instanceof Vector2D) {
            this.x -= x.x;
            this.y -= x.y;
        }
        else {
            this.x -= x;
            this.y -= y;
        }
        return this;
    }
    mult(s) {
        this.x *= s;
        this.y *= s;
        return this;
    }
    div(s) {
        this.x *= s;
        this.y *= s;
        return this;
    }
    mag() {
        return Math.sqrt(this.magSq());
    }
    magSq() {
        return Math.pow(this.x, 2) + Math.pow(this.y, 2);
    }
    setMag(newMag) {
        return this.mult(newMag / this.mag());
    }
    limit(minimum, maximum) {
        if (maximum === undefined) {
            maximum = minimum;
            minimum = 0;
        }
        if (this.magSq() < Math.pow(minimum, 2)) {
            this.setMag(minimum);
        }
        if (this.magSq() > Math.pow(maximum, 2)) {
            this.setMag(maximum);
        }
        return this;
    }
    heading(angleMode) {
        angleMode = (angleMode !== undefined ? angleMode : Vector2D.angleMode);
        let a = Math.atan2(this.y, this.x);
        if (angleMode === Vector2D.AngleUnit.DEGREES) {
            return radToDeg(a);
        }
        else {
            return a;
        }
    }
    setHeading(newHeading, angleMode) {
        angleMode = (angleMode !== undefined ? angleMode : Vector2D.angleMode);
        if (angleMode === Vector2D.AngleUnit.DEGREES) {
            newHeading = degToRad(newHeading);
        }
        let mag = this.mag();
        this.x = Math.cos(newHeading) * mag;
        this.y = Math.sin(newHeading) * mag;
        return this;
    }
    dot(x, y) {
        if (x instanceof Vector2D) {
            return this.x * x.x + this.y * x.y;
        }
        else {
            return this.x * x + this.y * y;
        }
    }
    normalize() {
        if (this.x !== 0 || this.y !== 0) {
            this.div(this.mag());
        }
        return this;
    }
    distSq(x, y) {
        if (x instanceof Vector2D) {
            return Math.pow(this.x - x.x, 2) + Math.pow(this.y - x.y, 2);
        }
        else {
            return Math.pow(this.x - x, 2) + Math.pow(this.y - y, 2);
        }
    }
    dist(x, y) {
        if (x instanceof Vector2D) {
            return Math.sqrt(Math.pow(this.x - x.x, 2) + Math.pow(this.y - x.y, 2));
        }
        else {
            return Math.sqrt(Math.pow(this.x - x, 2) + Math.pow(this.y - y, 2));
        }
    }
    equals(x, y) {
        if (x instanceof Vector2D) {
            return this.x === x.x && this.y === x.y;
        }
        else {
            return this.x === x && this.y === y;
        }
    }
    snapZero(threshold) {
        if (this.magSq() < Math.pow(threshold, 2)) {
            this.x = 0;
            this.y = 0;
        }
        return this;
    }
}
Vector2D.AngleUnit = AngleUnit;
Vector2D.angleMode = Vector2D.AngleUnit.DEGREES;
//# sourceMappingURL=Vector.js.map