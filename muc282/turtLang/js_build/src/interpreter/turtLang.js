import Interpreter from "./interpreter.js";
import Parser from "./parser.js";
import Scanner from "./scanner.js";
let interpreter;
let statements;
let codeLoaded = false;
var TurtLang;
(function (TurtLang) {
    function loaded() { return codeLoaded; }
    TurtLang.loaded = loaded;
    function init(turtle) {
        interpreter = new Interpreter(turtle);
    }
    TurtLang.init = init;
    function compile(source, success, failure) {
        codeLoaded = false;
        const scanner = new Scanner(source);
        const tokens = scanner.scan();
        const parser = new Parser(tokens);
        statements = parser.parse();
        if (parser.parseFailed) {
            if (failure) {
                failure();
            }
            return false;
        }
        codeLoaded = true;
        if (success) {
            success();
        }
        return true;
    }
    TurtLang.compile = compile;
    async function run() {
        interpreter.init(statements);
        await interpreter.run();
    }
    TurtLang.run = run;
    function finished() {
        return interpreter.finished;
    }
    TurtLang.finished = finished;
    function turtleGliding() {
        return interpreter.turtle.gliding;
    }
    TurtLang.turtleGliding = turtleGliding;
    function killExecution() {
        interpreter.kill();
    }
    TurtLang.killExecution = killExecution;
    function currentBlock() {
        return interpreter.currentDisplayBlock;
    }
    TurtLang.currentBlock = currentBlock;
    function getDebugVariableList() {
        return interpreter.getDebugVariableList();
    }
    TurtLang.getDebugVariableList = getDebugVariableList;
})(TurtLang || (TurtLang = {}));
export default TurtLang;
//# sourceMappingURL=turtLang.js.map