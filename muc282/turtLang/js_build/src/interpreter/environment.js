import { TurtStdFunction } from "./callable.js";
import { TRuntimeError } from "./common.js";
export default class Environment {
    constructor(enclosing = null, globals = null) {
        this.variables = {};
        this.enclosing = enclosing;
        this.globals = globals;
        if (enclosing) {
            this.index = enclosing.index + 1;
        }
        else {
            this.index = 0;
        }
    }
    define(name, value, isLibraryVariable = false) {
        if (this.globals !== null && this.globals.variables[name] !== undefined &&
            this.globals.variables[name].isLibraryVariable) {
            if (this.globals.variables[name].value instanceof TurtStdFunction) {
                throw new TRuntimeError(`'${name}' is a builtin function and cannot be redefined.`);
            }
            else {
                throw new TRuntimeError(`'${name}' is a builtin variable and cannot be redefined.`);
            }
        }
        if (this.variables[name] !== undefined) {
            if (this.variables[name].isLibraryVariable) {
                if (this.variables[name].value instanceof TurtStdFunction) {
                    throw new TRuntimeError(`'${name}' is a builtin function and cannot be redefined.`);
                }
                else {
                    throw new TRuntimeError(`'${name}' is a builtin variable and cannot be redefined.`);
                }
            }
            throw new TRuntimeError(`Variable '${name}' is already defined.`);
        }
        this.variables[name] = {
            value: value,
            isLibraryVariable: isLibraryVariable
        };
    }
    assign(name, value) {
        if (this.globals !== null && this.globals.variables[name.lexeme] !== undefined &&
            this.globals.variables[name.lexeme].isLibraryVariable) {
            if (this.variables[name.lexeme].value instanceof TurtStdFunction) {
                throw new TRuntimeError(`'${name.lexeme}' is a builtin function and cannot be redefined.`);
            }
            else {
                throw new TRuntimeError(`'${name.lexeme}' is a builtin variable and cannot be redefined.`);
            }
        }
        if (this.variables[name.lexeme] !== undefined &&
            this.variables[name.lexeme].isLibraryVariable) {
            if (this.variables[name.lexeme].value instanceof TurtStdFunction) {
                throw new TRuntimeError(`'${name.lexeme}' is a builtin function and cannot be redefined.`);
            }
            else {
                throw new TRuntimeError(`'${name.lexeme}' is a builtin variable and cannot be redefined.`);
            }
        }
        if (this.variables[name.lexeme] !== undefined) {
            this.variables[name.lexeme].value = value;
        }
        else if (this.enclosing !== null) {
            this.enclosing.assign(name, value);
        }
        else {
            throw new TRuntimeError(`Undefined variable '${name.lexeme}'.`);
        }
    }
    get(name) {
        if (this.variables[name.lexeme] !== undefined) {
            return this.variables[name.lexeme].value;
        }
        if (this.enclosing !== null) {
            return this.enclosing.get(name);
        }
        throw new TRuntimeError(`Undefined variable '${name.lexeme}'.`);
    }
    getDebugVariableList() {
        const table = (this.enclosing !== null ? this.enclosing.getDebugVariableList() : {});
        for (const [name, value] of Object.entries(this.variables)) {
            if (!value.isLibraryVariable) {
                const shadows = (table[name] !== undefined);
                table[name] = {
                    value: value.value,
                    shadows: shadows
                };
            }
        }
        return table;
    }
}
//# sourceMappingURL=environment.js.map