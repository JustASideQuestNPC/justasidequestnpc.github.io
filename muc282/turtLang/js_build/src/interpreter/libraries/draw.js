function toRadians(angle) { return angle * (Math.PI / 180); }
function toDegrees(angle) { return angle * (180 / Math.PI); }
const TWO_PI = Math.PI * 2;
const functions = {
    "getMoveSpeed": (_, turtle) => turtle.glideSpeed,
    "setMoveSpeed": (_, turtle, moveSpeed) => {
        turtle.glideSpeed = moveSpeed;
    },
    "resetAll": (_, turtle) => {
        turtle.resetAll();
    },
    "goHome": (_, turtle) => {
        turtle.resetPosition();
    },
    "clearCanvas": (_, turtle) => {
        turtle.resetDrawnShapes();
    },
    "resetPen": (_, turtle) => {
        turtle.resetPen();
    },
    "getX": (_, turtle) => turtle.position.x,
    "getY": (_, turtle) => turtle.position.y,
    "setPos": (_, turtle, x, y) => {
        turtle.position.set(x, y);
    },
    "moveFwd": async (_, turtle, distance) => {
        await turtle.moveFwd(distance);
    },
    "getAngle": (_, turtle) => {
        return toDegrees(turtle.heading + 90);
    },
    "setAngle": (_, turtle, angle) => {
        turtle.heading = toRadians(angle - 90);
        turtle.heading = ((turtle.heading % TWO_PI) + TWO_PI) % TWO_PI;
    },
    "rotate": (_, turtle, angle) => {
        turtle.heading += toRadians(angle);
        turtle.heading = ((turtle.heading % TWO_PI) + TWO_PI) % TWO_PI;
    },
    "hideTurtle": (_, turtle) => {
        turtle.hideSprite = true;
    },
    "showTurtle": (_, turtle) => {
        turtle.hideSprite = false;
    },
    "isHidden": (_, turtle) => turtle.hideSprite,
    "penUp": async (_, turtle) => {
        await turtle.penUp();
    },
    "penDown": async (_, turtle) => {
        await turtle.penDown();
    },
    "penIsDown": (_, turtle) => {
        return turtle.drawing;
    },
    "setColor": async (_, turtle, c) => {
        await turtle.setColor(c);
    },
    "setColorRgb": async (_, turtle, r, g, b) => {
        await turtle.setColorRgb(r, g, b);
    },
    "setColorCss": async (_, turtle, c) => {
        await turtle.setColor(c);
    },
    "lineThickness": (_, turtle, value) => {
        turtle.lineThickness = value;
    },
    "beginPoly": async (_, turtle) => {
        await turtle.beginPoly();
    },
    "endPoly": async (_, turtle) => {
        await turtle.endPoly();
    },
    "dropVertex": async (_, turtle) => {
        await turtle.dropVertex();
    },
};
const variables = {
    COLOR_BLACK: 0,
    COLOR_GRAY: 1,
    COLOR_WHITE: 2,
    COLOR_RED: 3,
    COLOR_ORANGE: 4,
    COLOR_YELLOW: 5,
    COLOR_GREEN: 6,
    COLOR_CYAN: 7,
    COLOR_SKY: 8,
    COLOR_BLUE: 9,
    COLOR_PURPLE: 10,
    COLOR_PINK: 11
};
const lib = {
    functions: functions,
    variables: variables
};
export default lib;
//# sourceMappingURL=draw.js.map