import { TokenType } from "./scanner.js";
import * as Expr from "./expressions.js";
import { TRangeError, TRuntimeError, TTypeError, TInfiniteLoopError } from "./common.js";
import Environment from "./environment.js";
import { TurtStdFunction, TurtUserFunction } from "./callable.js";
import importLibrary from "./importer.js";
import turtStdLib from "./libraries/standard.js";
import TurtArray from "./array.js";
import turtDrawLib from "./libraries/draw.js";
import CONFIG from "../../config/_CONFIG.js";
export class ReturnInterrupt extends Error {
    constructor(value) {
        super();
        this.value = value;
    }
}
export default class Interpreter {
    constructor(turtle) {
        this.displayBlocks = [];
        this.turtle = turtle;
        turtle.parentInterpreter = this;
        this.finished_ = true;
    }
    get hadError() { return this.hadError_; }
    get finished() { return this.finished_; }
    ;
    init(statements) {
        this.globals = new Environment();
        this.environment = this.globals;
        this.statements = statements;
        this.index = 0;
        this.hadError_ = false;
        this.finished_ = false;
        this.killExecution = false;
        this.displayBlocks = [[statements.slice(), 0]];
        importLibrary(this, turtStdLib);
        importLibrary(this, turtDrawLib);
        this.globals.define("screenWidth", CONFIG.SCREEN_WIDTH, true);
        this.globals.define("screenHeight", CONFIG.SCREEN_HEIGHT, true);
        this.turtle.resetAll();
    }
    async run() {
        if (this.finished || this.hadError) {
            return;
        }
        console.log("running...");
        try {
            while (this.index < this.statements.length) {
                await this.execute(this.statements[this.index++]);
                if (this.hadError_) {
                    break;
                }
            }
        }
        catch (error) {
            console.error(`[TurtLang] ${error.message}`);
            this.hadError_ = true;
        }
        this.finished_ = !this.hadError;
    }
    kill() {
        this.killExecution = true;
        this.turtle.gliding = false;
        this.finished_ = true;
    }
    async visitArrayExpr(expr) {
        const literalItems = [];
        for (const item of expr.items) {
            literalItems.push(await this.evaluate(item));
        }
        return new TurtArray(literalItems);
    }
    async visitAssignmentExpr(expr) {
        const value = await this.evaluate(expr.value);
        this.environment.assign(expr.name, value);
        return value;
    }
    async visitBinaryExpr(expr) {
        const left = await this.evaluate(expr.left);
        const right = await this.evaluate(expr.right);
        switch (expr.operator.type) {
            case TokenType.PLUS:
                if (typeof left === "number" && typeof right === "number") {
                    return left + right;
                }
                if (typeof left === "string" && typeof right === "string") {
                    return left + right;
                }
                throw new TTypeError(`[TurtLang] TypeError (line ${expr.operator.line}): Operands must be two ` +
                    `numbers or two strings.`);
            case TokenType.MINUS:
                checkNumberOperands(expr.operator, left, right);
                return Number(left) - Number(right);
            case TokenType.STAR:
                checkNumberOperands(expr.operator, left, right);
                return Number(left) * Number(right);
            case TokenType.SLASH:
                checkNumberOperands(expr.operator, left, right);
                return Number(left) / Number(right);
            case TokenType.MOD:
                checkNumberOperands(expr.operator, left, right);
                return Number(left) % Number(right);
            case TokenType.DOUBLE_MOD:
                checkNumberOperands(expr.operator, left, right);
                const rem = Number(left) % Number(right);
                return rem >= 0 ? rem : rem + Number(right);
            case TokenType.LESS:
                checkNumberOperands(expr.operator, left, right);
                return Number(left) < Number(right);
            case TokenType.LESS_EQUAL:
                checkNumberOperands(expr.operator, left, right);
                return Number(left) <= Number(right);
            case TokenType.GREATER:
                checkNumberOperands(expr.operator, left, right);
                return Number(left) > Number(right);
            case TokenType.GREATER_EQUAL:
                checkNumberOperands(expr.operator, left, right);
                return Number(left) >= Number(right);
            case TokenType.DOUBLE_EQUAL:
                return left === right;
            case TokenType.NOT_EQUAL:
                return left !== right;
        }
        return null;
    }
    async visitCallExpr(expr) {
        if (!(expr.callee instanceof Expr.VariableExpr)) {
            throw new TRuntimeError("Expected identifier before function call.");
        }
        const callee = await this.evaluate(expr.callee);
        if (!(callee instanceof TurtStdFunction || callee instanceof TurtUserFunction)) {
            throw new TTypeError(`'${expr.callee.name.lexeme}' is not a function.`);
        }
        const callArgs = [];
        for (const arg of expr.args) {
            callArgs.push(await this.evaluate(arg));
        }
        if (callArgs.length !== callee.numArgs) {
            throw new TRuntimeError(`Incorrect number of arguments for function '${expr.callee.name.lexeme}' ` +
                `(expected ${callee.numArgs}, recieved ${callArgs.length}).`);
        }
        return await callee.call(this, callArgs);
    }
    async visitGroupingExpr(expr) {
        return await this.evaluate(expr.expression);
    }
    async visitIndexExpr(expr) {
        if (!(expr.indexee instanceof Expr.VariableExpr ||
            expr.indexee instanceof Expr.LiteralExpr)) {
            throw new TRuntimeError("Expected identifier or string before indexer.");
        }
        const indexee = await this.evaluate(expr.indexee);
        if (!(typeof indexee === "string" || indexee instanceof TurtArray)) {
            throw new TTypeError("Only arrays and strings can be indexed.");
        }
        const index = await this.evaluate(expr.index);
        if (typeof index !== "number" || index % 1 !== 0) {
            throw new TTypeError("Indexes must be integer numbers.");
        }
        if (typeof indexee === "string") {
            if (index < -indexee.length || index >= indexee.length) {
                throw new TRangeError("String index out of range.");
            }
            if (index < 0) {
                return indexee[indexee.length + index];
            }
            return indexee[index];
        }
        return indexee.get(index);
    }
    async visitLiteralExpr(expr) {
        return expr.value;
    }
    async visitLogicalExpr(expr) {
        const left = await this.evaluate(expr.left);
        if (expr.operator.type === TokenType.OR) {
            if (isTruthy(left)) {
                return left;
            }
        }
        else {
            if (!isTruthy(left)) {
                return left;
            }
        }
        return await this.evaluate(expr.right);
    }
    async visitUnaryExpr(expr) {
        const right = await this.evaluate(expr.right);
        switch (expr.operator.type) {
            case TokenType.MINUS:
                checkNumberOperand(expr.operator, right);
                return -Number(right);
            case TokenType.NOT:
                return !isTruthy(right);
        }
        return null;
    }
    async visitVariableExpr(expr) {
        return this.environment.get(expr.name);
    }
    async evaluate(expr) {
        return await expr.accept(this);
    }
    async visitBlockStmt(stmt) {
        await this.executeBlock(stmt.statements, new Environment(this.environment, this.globals));
    }
    async executeBlock(statements, environment) {
        this.displayBlocks.push([statements.slice(), 0]);
        const previous = this.environment;
        try {
            this.environment = environment;
            for (let i = 0; i < statements.length; ++i) {
                this.displayBlocks[this.displayBlocks.length - 1][1] = i;
                await this.execute(statements[i]);
            }
        }
        finally {
            this.environment = previous;
            this.displayBlocks.pop();
        }
    }
    async visitExpressionStmt(stmt) {
        await this.evaluate(stmt.expression);
    }
    async visitFunctionStmt(stmt) {
        this.environment.define(stmt.name.lexeme, new TurtUserFunction(stmt, this.environment));
    }
    async visitIfStmt(stmt) {
        if (isTruthy(await this.evaluate(stmt.condition))) {
            await this.execute(stmt.thenBranch);
        }
        else if (stmt.elseBranch !== null) {
            await this.execute(stmt.elseBranch);
        }
    }
    async visitReturnStmt(stmt) {
        let value = null;
        if (stmt.value !== null) {
            value = await this.evaluate(stmt.value);
        }
        throw new ReturnInterrupt(value);
    }
    async visitVarStmt(stmt) {
        let value = null;
        if (stmt.initializer !== null) {
            value = await this.evaluate(stmt.initializer);
        }
        this.environment.define(stmt.name.lexeme, value);
    }
    async visitWhileStmt(stmt) {
        let numIterations = 0;
        while (isTruthy(await this.evaluate(stmt.condition))) {
            await this.execute(stmt.body);
            if (++numIterations >= CONFIG.MAX_LOOP_ITERATIONS) {
                throw new TInfiniteLoopError(`Maximum number of loop iterations (${CONFIG.MAX_LOOP_ITERATIONS}) exceeded.`);
            }
        }
    }
    async execute(stmt) {
        if (this.killExecution) {
            return;
        }
        let delayTimer;
        if (CONFIG.MIN_EXECUTION_DELAY > 0) {
            delayTimer = new Promise((resolve) => {
                window.setTimeout(() => {
                    resolve();
                }, CONFIG.MIN_EXECUTION_DELAY * 1000);
            });
        }
        if (this.turtle.gliding) {
            await new Promise((resolve) => {
                this.resumeGlide = () => {
                    resolve(null);
                };
            });
        }
        if (CONFIG.MIN_EXECUTION_DELAY > 0) {
            await delayTimer;
        }
        await stmt.accept(this);
    }
    get currentDisplayBlock() {
        return this.displayBlocks[this.displayBlocks.length - 1];
    }
    getDebugVariableList() {
        if (this.environment !== undefined) {
            return this.environment.getDebugVariableList();
        }
        return {};
    }
}
function checkNumberOperand(operator, operand) {
    if (typeof operand !== "number") {
        throw new TTypeError(`[TurtLang] TypeError (line ${operator.line}): Operand must be a number.`);
    }
}
function checkNumberOperands(operator, left, right) {
    if (typeof left !== "number" || typeof right !== "number") {
        throw new TTypeError(`[TurtLang] TypeError (line ${operator.line}): Operands must be numbers.`);
    }
}
function isTruthy(value) {
    return value !== null && value !== false && value !== 0;
}
//# sourceMappingURL=interpreter.js.map