import Environment from "./environment.js";
import { ReturnInterrupt } from "./interpreter.js";
export class TurtStdFunction {
    constructor(name, numArgs, callback) {
        this.name = name;
        this.numArgs = numArgs;
        this.callback = callback;
    }
    async call(interpreter, args) {
        const returnValue = await this.callback(interpreter, interpreter.turtle, ...args);
        if (returnValue === undefined) {
            return null;
        }
        return returnValue;
    }
    ;
    toString() {
        return `<function ${this.name}>`;
    }
}
export class TurtUserFunction {
    constructor(declaration, closure) {
        this.declaration = declaration;
        this.closure = closure;
        this.numArgs = declaration.params.length;
    }
    async call(interpreter, args) {
        const environment = new Environment(this.closure, interpreter.globals);
        for (let i = 0; i < this.declaration.params.length; ++i) {
            environment.define(this.declaration.params[i].lexeme, args[i]);
        }
        try {
            await interpreter.executeBlock(this.declaration.body, environment);
        }
        catch (error) {
            if (error instanceof ReturnInterrupt) {
                return error.value;
            }
            throw error;
        }
        return null;
    }
    toString() {
        return `<function ${this.declaration.name.lexeme}>`;
    }
}
//# sourceMappingURL=callable.js.map