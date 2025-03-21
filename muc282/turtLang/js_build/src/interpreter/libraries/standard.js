import TurtArray from "../array.js";
import { TTypeError } from "../common.js";
function degToRad(angle) {
    return angle * Math.PI / 180;
}
function radToDeg(angle) {
    return angle * 180 / Math.PI;
}
function mapValue(n, s1, e1, s2, e2) {
    return e2 + ((e2 - s2) / (e1 - s1)) * (n - s1);
}
const functions = {
    "print": (i, t, message) => {
        console.log(`${message}`);
    },
    "pushBack": (i, t, array, value) => {
        if (array instanceof TurtArray) {
            array.pushBack(value);
            return array.size();
        }
        throw new TTypeError("pushBack() requires an array.");
    },
    "popBack": (i, t, array) => {
        if (array instanceof TurtArray) {
            return array.popBack();
        }
        throw new TTypeError("popBack() requires an array.");
    },
    "pushFront": (i, t, array, value) => {
        if (array instanceof TurtArray) {
            array.pushFront(value);
            return array.size();
        }
        throw new TTypeError("pushFront() requires an array.");
    },
    "popFront": (i, t, array) => {
        if (array instanceof TurtArray) {
            return array.popFront();
        }
        throw new TTypeError("popFront() requires an array.");
    },
    "length": (i, t, array) => {
        if (array instanceof TurtArray) {
            return array.size();
        }
        else if (typeof array === "string") {
            return array.length;
        }
        throw new TTypeError("length() requires an array or string.");
    },
    "copy": (i, t, array) => {
        if (array instanceof TurtArray) {
            const copied = [];
            for (let i = 0; i < array.size(); ++i) {
                copied.push(array.get(i));
            }
            return new TurtArray(copied);
        }
        throw new TTypeError("copy() requires an array.");
    },
    "degToRad": (i, t, angle) => {
        if (typeof angle === "number") {
            return degToRad(angle);
        }
        throw new TTypeError("degToRad() requires a number.");
    },
    "radToDeg": (i, t, angle) => {
        if (typeof angle === "number") {
            return radToDeg(angle);
        }
        throw new TTypeError("radToDeg() requires a number.");
    },
    "sin": (i, t, angle) => {
        if (typeof angle === "number") {
            return Math.sin(degToRad(angle));
        }
        throw new TTypeError("sin() requires a number.");
    },
    "cos": (i, t, angle) => {
        if (typeof angle === "number") {
            return Math.cos(degToRad(angle));
        }
        throw new TTypeError("cos() requires a number.");
    },
    "tan": (i, t, angle) => {
        if (typeof angle === "number") {
            return Math.tan(degToRad(angle));
        }
        throw new TTypeError("tan() requires a number.");
    },
    "exp": (i, t, angle) => {
        if (typeof angle === "number") {
            return Math.exp(degToRad(angle));
        }
        throw new TTypeError("exp() requires a number.");
    },
    "sqrt": (i, t, angle) => {
        if (typeof angle === "number") {
            return Math.sqrt(degToRad(angle));
        }
        throw new TTypeError("sqrt() requires a number.");
    },
    "map": (i, t, n, s1, e1, s2, e2) => {
        if (typeof n === "number" && typeof s1 === "number" && typeof e1 === "number" &&
            typeof s2 === "number" && typeof e2 === "number") {
            return mapValue(n, s1, e1, s2, e2);
        }
        throw new TTypeError("map() requires 5 numbers.");
    },
    "lerp": (i, t, start, end, amount) => {
        if (typeof start === "number" && typeof end === "number" && typeof amount === "number") {
            return mapValue(amount, 0, 1, start, end);
        }
        throw new TTypeError("lerp() requires 3 numbers.");
    },
};
const variables = {};
const lib = {
    functions: functions,
    variables: variables
};
export default lib;
//# sourceMappingURL=standard.js.map