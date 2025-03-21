export class TurtError extends Error {
    constructor(message) {
        super(message);
        this.name = "Turt.TurtError";
    }
}
export class TParseError extends TurtError {
    constructor(message) {
        super(message);
        this.name = "Turt.ParseError";
    }
}
export class TRangeError extends TurtError {
    constructor(message) {
        super(message);
        this.name = "Turt.RangeError";
    }
}
export class TRuntimeError extends TurtError {
    constructor(message) {
        super(message);
        this.name = "Turt.RuntimeError";
    }
}
export class TTypeError extends TurtError {
    constructor(message) {
        super(message);
        this.name = "Turt.TypeError";
    }
}
export class TInfiniteLoopError extends TurtError {
    constructor(message) {
        super(message);
        this.name = "Turt.InfiniteLoopError";
    }
}
//# sourceMappingURL=common.js.map