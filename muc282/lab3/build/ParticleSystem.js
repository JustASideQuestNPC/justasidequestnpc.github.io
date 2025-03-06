import Vector2D from "./Vector.js";
export class ParticleSystem {
    constructor(sketch, canvas) {
        this.minVelocity = 250;
        this.maxVelocity = 400;
        this.viewRange = 200;
        this.minDistance = 75;
        this.separationFactor = 5;
        this.cohesionFactor = 5;
        this.alignmentFactor = 5;
        this.wallAvoidFactor = 5;
        this.particles = [];
        this.sketch = sketch;
        this.canvas = canvas ?? sketch;
        this.wallMargin = 150;
    }
    numParticles() { return this.particles.length; }
    addParticle(x, y, angle, speed) {
        x = x ?? Math.random() * this.canvas.width;
        y = y ?? Math.random() * this.canvas.height;
        angle = angle ?? Math.random() * 360;
        speed = speed ?? Math.random() * (this.maxVelocity - this.minVelocity) + this.minVelocity;
        const position = new Vector2D(x, y);
        const velocity = Vector2D.fromPolar(angle, speed);
        this.particles.push(new Particle(position, velocity, this));
    }
    populate(amount) {
        for (let i = 0; i < amount; ++i) {
            this.addParticle();
        }
    }
    moveAll() {
        const dt = this.sketch.deltaTime / 1000;
        for (let p of this.particles) {
            p.move(dt);
        }
        this.particles = this.particles.filter((p) => !p.markForRemove);
    }
    renderAll() {
        for (const p of this.particles) {
            p.render(this.canvas);
        }
    }
    removeAll() {
        this.particles = [];
    }
    removeParticle() {
        this.particles.splice(Math.floor(Math.random() * this.particles.length), 1);
    }
    getAll() {
        return this.particles.slice();
    }
    get wallMargin() { return this._wallMargin; }
    set wallMargin(value) {
        this._wallMargin = value;
    }
    get leftEdge() { return this._wallMargin; }
    get rightEdge() { return this.canvas.width - this._wallMargin; }
    get topEdge() { return this._wallMargin; }
    get bottomEdge() { return this.canvas.height - this._wallMargin; }
    get width() { return this.canvas.width; }
    get height() { return this.canvas.height; }
}
class Particle {
    constructor(position, velocity, system) {
        this.markForRemove = false;
        this.position = new Vector2D();
        this.velocity = new Vector2D();
        this.position = position.copy();
        this.velocity = velocity.copy();
        this.system = system;
    }
    render(g) {
        g.push();
        g.translate(this.position.x, this.position.y);
        g.rotate(this.velocity.heading() + 90);
        g.noStroke();
        g.fill("#1f84ff");
        g.beginShape();
        g.vertex(0, -8);
        g.vertex(5, 8);
        g.vertex(-5, 8);
        g.endShape("close");
        g.pop();
    }
    move(dt) {
        const nearbyParticles = this.system.getAll().filter((p) => (p !== this && this.position.distSq(p.position) < Math.pow(this.system.viewRange, 2)));
        const separationVector = new Vector2D();
        const alignmentVector = new Vector2D();
        const averageNearbyPosition = new Vector2D();
        let numConsidered = 0;
        for (const particle of nearbyParticles) {
            if (this.position.distSq(particle.position) < Math.pow(this.system.minDistance, 2)) {
                separationVector.add(this.position.copy().sub(particle.position));
            }
            else {
                ++numConsidered;
                averageNearbyPosition.add(particle.position.copy().sub(this.position));
                alignmentVector.add(particle.velocity);
            }
        }
        this.velocity.add(separationVector.mult(this.system.separationFactor * dt));
        if (numConsidered > 0) {
            this.velocity.add(alignmentVector.div(numConsidered)
                .mult(this.system.alignmentFactor * dt));
            this.velocity.add(averageNearbyPosition.div(numConsidered)
                .mult(this.system.cohesionFactor * dt));
        }
        const wallAvoidFactor = this.system.wallAvoidFactor * 1000;
        if (this.position.x < this.system.leftEdge) {
            this.velocity.x += wallAvoidFactor * dt;
        }
        else if (this.position.x > this.system.rightEdge) {
            this.velocity.x -= wallAvoidFactor * dt;
        }
        if (this.position.y < this.system.topEdge) {
            this.velocity.y += wallAvoidFactor * dt;
        }
        else if (this.position.y > this.system.bottomEdge) {
            this.velocity.y -= wallAvoidFactor * dt;
        }
        this.velocity.limit(this.system.minVelocity, this.system.maxVelocity);
        this.position.add(this.velocity.copy().mult(dt));
        if (this.position.x < 0) {
            this.position.x = 0;
            if (this.velocity.x < 0) {
                this.velocity.x *= -1;
            }
        }
        else if (this.position.x > this.system.width) {
            this.position.x = this.system.width;
            if (this.velocity.x > 0) {
                this.velocity.x *= -1;
            }
        }
        if (this.position.y < 0) {
            this.position.y = 0;
            if (this.velocity.y < 0) {
                this.velocity.y *= -1;
            }
        }
        else if (this.position.y > this.system.height) {
            this.position.y = this.system.height;
            if (this.velocity.y > 0) {
                this.velocity.y *= -1;
            }
        }
    }
}
//# sourceMappingURL=ParticleSystem.js.map