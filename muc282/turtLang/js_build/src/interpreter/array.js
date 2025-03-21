import { TRangeError } from "./common.js";
export default class TurtArray {
    constructor(items) {
        this.items = items;
    }
    get(i) {
        if (i < -this.items.length || i >= this.items.length) {
            throw new TRangeError("Array index out of range.");
        }
        if (i < 0) {
            return this.items[this.items.length + i];
        }
        return this.items[i];
    }
    toString() {
        return "[" + this.items.join(", ") + "]";
    }
    pushBack(value) {
        this.items.push(value);
        return this.items.length;
    }
    popBack() {
        if (this.items.length > 0) {
            return this.items.pop();
        }
        return null;
    }
    pushFront(value) {
        this.items.unshift(value);
        return this.items.length;
    }
    popFront() {
        if (this.items.length > 0) {
            return this.items.shift();
        }
        return null;
    }
    size() {
        return this.items.length;
    }
}
//# sourceMappingURL=array.js.map