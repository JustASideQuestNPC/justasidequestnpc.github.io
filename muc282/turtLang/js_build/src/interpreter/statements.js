export class StmtBase {
}
export class BlockStmt extends StmtBase {
    constructor(statements) {
        super();
        this.displayName = "STMT_BLOCK";
        this.statements = statements;
    }
    accept(visitor) {
        return visitor.visitBlockStmt(this);
    }
}
export class ExpressionStmt extends StmtBase {
    constructor(expression) {
        super();
        this.displayName = "STMT_EXPRESSION";
        this.expression = expression;
    }
    accept(visitor) {
        return visitor.visitExpressionStmt(this);
    }
}
export class FunctionStmt extends StmtBase {
    constructor(name, params, body) {
        super();
        this.displayName = "STMT_FUNCTION";
        this.name = name;
        this.params = params;
        this.body = body;
    }
    accept(visitor) {
        return visitor.visitFunctionStmt(this);
    }
}
export class IfStmt extends StmtBase {
    constructor(condition, thenBranch, elseBranch) {
        super();
        this.displayName = "STMT_IF";
        this.condition = condition;
        this.thenBranch = thenBranch;
        this.elseBranch = elseBranch;
    }
    accept(visitor) {
        return visitor.visitIfStmt(this);
    }
}
export class ReturnStmt extends StmtBase {
    constructor(keyword, value) {
        super();
        this.displayName = "STMT_RETURN";
        this.keyword = keyword;
        this.value = value;
    }
    accept(visitor) {
        return visitor.visitReturnStmt(this);
    }
}
export class VarStmt extends StmtBase {
    constructor(name, initializer) {
        super();
        this.displayName = "STMT_VAR";
        this.name = name;
        this.initializer = initializer;
    }
    accept(visitor) {
        return visitor.visitVarStmt(this);
    }
}
export class WhileStmt extends StmtBase {
    constructor(condition, body) {
        super();
        this.displayName = "STMT_WHILE";
        this.condition = condition;
        this.body = body;
    }
    accept(visitor) {
        return visitor.visitWhileStmt(this);
    }
}
//# sourceMappingURL=statements.js.map