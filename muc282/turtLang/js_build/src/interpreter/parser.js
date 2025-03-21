import { TokenType } from "./scanner.js";
import * as Expr from "./expressions.js";
import * as Stmt from "./statements.js";
import { TParseError } from "./common.js";
function reportError(token, message) {
    if (token.type === TokenType.EOF) {
        message = `[TurtLang] ParseError (line ${token.line} at end): ${message}`;
    }
    else {
        message = `[TurtLang] ParseError (line ${token.line} at '${token.lexeme}'): ${message}'`;
    }
    console.error(message);
    return new TParseError(message);
}
export default class Parser {
    constructor(tokens) {
        this.current = 0;
        this.parseFailed_ = false;
        this.tokens = tokens;
    }
    get parseFailed() { return this.parseFailed_; }
    parse() {
        const statements = [];
        while (!this.atEof()) {
            statements.push(this.declaration());
        }
        return statements;
    }
    atEof() {
        return this.tokens[this.current].type === TokenType.EOF;
    }
    advance() {
        if (!this.atEof()) {
            ++this.current;
        }
        return this.previous();
    }
    peek() {
        return this.tokens[this.current];
    }
    previous() {
        return this.tokens[this.current - 1];
    }
    check(type) {
        if (this.atEof()) {
            return false;
        }
        return this.peek().type === type;
    }
    consume(type, message) {
        if (this.check(type)) {
            return this.advance();
        }
        throw reportError(this.peek(), message);
    }
    match(...types) {
        for (const type of types) {
            if (this.check(type)) {
                this.advance();
                return true;
            }
        }
        return false;
    }
    expression() {
        return this.assignment();
    }
    equality() {
        let expr = this.comparison();
        while (this.match(TokenType.DOUBLE_EQUAL, TokenType.NOT_EQUAL)) {
            const operator = this.previous();
            const right = this.comparison();
            expr = new Expr.BinaryExpr(expr, operator, right);
        }
        return expr;
    }
    comparison() {
        let expr = this.term();
        while (this.match(TokenType.LESS, TokenType.GREATER, TokenType.LESS_EQUAL, TokenType.GREATER_EQUAL)) {
            const operator = this.previous();
            const right = this.term();
            expr = new Expr.BinaryExpr(expr, operator, right);
        }
        return expr;
    }
    term() {
        let expr = this.factor();
        while (this.match(TokenType.PLUS, TokenType.MINUS)) {
            const operator = this.previous();
            const right = this.factor();
            expr = new Expr.BinaryExpr(expr, operator, right);
        }
        return expr;
    }
    factor() {
        let expr = this.modulo();
        while (this.match(TokenType.SLASH, TokenType.STAR)) {
            const operator = this.previous();
            const right = this.modulo();
            expr = new Expr.BinaryExpr(expr, operator, right);
        }
        return expr;
    }
    modulo() {
        let expr = this.unary();
        while (this.match(TokenType.MOD, TokenType.DOUBLE_MOD)) {
            const operator = this.previous();
            const right = this.unary();
            expr = new Expr.BinaryExpr(expr, operator, right);
        }
        return expr;
    }
    unary() {
        if (this.match(TokenType.MINUS, TokenType.NOT)) {
            const operator = this.previous();
            const right = this.unary();
            return new Expr.UnaryExpr(operator, right);
        }
        return this.call();
    }
    primary() {
        if (this.match(TokenType.TRUE)) {
            return new Expr.LiteralExpr(true);
        }
        if (this.match(TokenType.FALSE)) {
            return new Expr.LiteralExpr(false);
        }
        if (this.match(TokenType.NULL)) {
            return new Expr.LiteralExpr(null);
        }
        if (this.match(TokenType.NUMBER, TokenType.STRING)) {
            return new Expr.LiteralExpr(this.previous().literal);
        }
        if (this.match(TokenType.IDENTIFIER)) {
            return new Expr.VariableExpr(this.previous());
        }
        if (this.match(TokenType.LEFT_BRACKET)) {
            return this.arrayInitializer();
        }
        if (this.match(TokenType.LEFT_PAREN)) {
            let expr = this.expression();
            this.consume(TokenType.RIGHT_PAREN, "Expected ')' after expression.");
            return new Expr.GroupingExpr(expr);
        }
        throw reportError(this.peek(), "Expected an expression.");
    }
    call() {
        let expr = this.primary();
        while (this.check(TokenType.LEFT_PAREN) || this.check(TokenType.LEFT_BRACKET)) {
            if (this.match(TokenType.LEFT_PAREN)) {
                expr = this.finishCall(expr);
            }
            else if (this.match(TokenType.LEFT_BRACKET)) {
                expr = this.indexer(expr);
            }
        }
        return expr;
    }
    arrayInitializer() {
        const items = [];
        if (!this.check(TokenType.RIGHT_BRACKET)) {
            do {
                items.push(this.expression());
            } while (this.match(TokenType.COMMA));
        }
        this.consume(TokenType.RIGHT_BRACKET, "Expected ']' after array initializer list.");
        return new Expr.ArrayExpr(items);
    }
    finishCall(callee) {
        const callArgs = [];
        if (!this.check(TokenType.RIGHT_PAREN)) {
            do {
                callArgs.push(this.expression());
            } while (this.match(TokenType.COMMA));
        }
        const paren = this.consume(TokenType.RIGHT_PAREN, "Expected ')' after argument list.");
        return new Expr.CallExpr(callee, paren, callArgs);
    }
    indexer(indexee) {
        if (this.check(TokenType.RIGHT_BRACKET)) {
            throw reportError(this.peek(), "Expected argument to array or string indexer.");
        }
        const index = this.expression();
        this.consume(TokenType.RIGHT_BRACKET, "Expected ']' after index.");
        return new Expr.IndexExpr(indexee, index);
    }
    assignment() {
        const expr = this.logical();
        if (this.match(TokenType.EQUAL)) {
            const equals = this.previous();
            const value = this.assignment();
            if (expr instanceof Expr.VariableExpr) {
                const name = expr.name;
                return new Expr.AssignmentExpr(name, value);
            }
            reportError(equals, "Invalid assignment target");
        }
        return expr;
    }
    logical() {
        let expr = this.equality();
        while (this.match(TokenType.AND, TokenType.OR)) {
            const operator = this.previous();
            const right = this.equality();
            expr = new Expr.LogicalExpr(expr, operator, right);
        }
        return expr;
    }
    synchronize() {
        this.advance();
        while (!this.atEof()) {
            if (this.previous().type === TokenType.SEMICOLON) {
                return;
            }
            switch (this.peek().type) {
                case TokenType.FUNCDEF:
                case TokenType.VAR:
                case TokenType.FOR:
                case TokenType.WHILE:
                case TokenType.IF:
                case TokenType.RETURN:
                    return;
            }
            this.advance();
        }
    }
    declaration() {
        try {
            if (this.match(TokenType.FUNCDEF)) {
                return this.functionStatement();
            }
            if (this.match(TokenType.RETURN)) {
                return this.returnStatement();
            }
            if (this.match(TokenType.VAR)) {
                return this.varDeclaration();
            }
            return this.statement();
        }
        catch (error) {
            if (error instanceof TParseError) {
                this.synchronize();
                this.parseFailed_ = true;
                return null;
            }
            throw error;
        }
    }
    statement() {
        if (this.match(TokenType.FOR)) {
            return this.forStatement();
        }
        if (this.match(TokenType.IF)) {
            return this.ifStatement();
        }
        if (this.match(TokenType.WHILE)) {
            return this.whileStatement();
        }
        if (this.match(TokenType.LEFT_BRACE)) {
            return new Stmt.BlockStmt(this.blockStatement());
        }
        return this.expressionStatement();
    }
    expressionStatement() {
        const expr = this.expression();
        this.consume(TokenType.SEMICOLON, "Expected ';' after expression.");
        return new Stmt.ExpressionStmt(expr);
    }
    varDeclaration() {
        const name = this.consume(TokenType.IDENTIFIER, "Expected variable name.");
        let initializer = null;
        if (this.match(TokenType.EQUAL)) {
            initializer = this.expression();
        }
        this.consume(TokenType.SEMICOLON, "Expected ';' after declaration.");
        return new Stmt.VarStmt(name, initializer);
    }
    blockStatement() {
        const statements = [];
        while (!this.check(TokenType.RIGHT_BRACE) && !this.atEof()) {
            statements.push(this.declaration());
        }
        this.consume(TokenType.RIGHT_BRACE, "Expected '}' after block.");
        return statements;
    }
    ifStatement() {
        this.consume(TokenType.LEFT_PAREN, "Expected '{' after 'if'.");
        const condition = this.expression();
        this.consume(TokenType.RIGHT_PAREN, "Expected '}' after if condition.");
        const thenBranch = this.statement();
        let elseBranch = null;
        if (this.match(TokenType.ELSE)) {
            elseBranch = this.statement();
        }
        return new Stmt.IfStmt(condition, thenBranch, elseBranch);
    }
    whileStatement() {
        this.consume(TokenType.LEFT_PAREN, "Expected '{' after 'while'.");
        const condition = this.expression();
        this.consume(TokenType.RIGHT_PAREN, "Expected '}' after while condition.");
        const body = this.statement();
        return new Stmt.WhileStmt(condition, body);
    }
    forStatement() {
        this.consume(TokenType.LEFT_PAREN, "Expected '(' after 'for'.");
        let initializer;
        if (this.match(TokenType.SEMICOLON)) {
            initializer = null;
        }
        else if (this.match(TokenType.VAR)) {
            initializer = this.varDeclaration();
        }
        else {
            initializer = this.expressionStatement();
        }
        let condition = null;
        if (!this.check(TokenType.SEMICOLON)) {
            condition = this.expression();
        }
        this.consume(TokenType.SEMICOLON, "Expected ';' after loop condition.");
        let increment = null;
        if (!this.check(TokenType.RIGHT_PAREN)) {
            increment = this.expression();
        }
        this.consume(TokenType.RIGHT_PAREN, "Expected ')' after for loop clauses.");
        let body = this.statement();
        if (increment !== null) {
            body = new Stmt.BlockStmt([body, new Stmt.ExpressionStmt(increment)]);
        }
        if (condition === null) {
            condition = new Expr.LiteralExpr(true);
        }
        body = new Stmt.WhileStmt(condition, body);
        if (initializer !== null) {
            body = new Stmt.BlockStmt([initializer, body]);
        }
        return body;
    }
    functionStatement() {
        const name = this.consume(TokenType.IDENTIFIER, "Expected function name.");
        this.consume(TokenType.LEFT_PAREN, "Expected '(' after function name.");
        const params = [];
        if (!this.check(TokenType.RIGHT_PAREN)) {
            do {
                params.push(this.consume(TokenType.IDENTIFIER, "Expected parameter name."));
            } while (this.match(TokenType.COMMA));
        }
        this.consume(TokenType.RIGHT_PAREN, "Expected ')' after parameter list.");
        this.consume(TokenType.LEFT_BRACE, "Expected '{' before function body.");
        const body = this.blockStatement();
        return new Stmt.FunctionStmt(name, params, body);
    }
    returnStatement() {
        const keyword = this.previous();
        let value = null;
        if (!this.check(TokenType.SEMICOLON)) {
            value = this.expression();
        }
        this.consume(TokenType.SEMICOLON, "Expected ';' after return value.");
        return new Stmt.ReturnStmt(keyword, value);
    }
}
//# sourceMappingURL=parser.js.map