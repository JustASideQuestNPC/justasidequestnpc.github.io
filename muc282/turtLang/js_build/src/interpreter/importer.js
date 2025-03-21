import { TurtStdFunction } from "./callable.js";
export default function importLibrary(interpreter, lib) {
    for (const [name, data] of Object.entries(lib.functions)) {
        const numArgs = data.length - 2;
        interpreter.globals.define(name, new TurtStdFunction(name, numArgs, data), true);
    }
    for (const [name, value] of Object.entries(lib.variables)) {
        interpreter.globals.define(name, value, true);
    }
}
//# sourceMappingURL=importer.js.map