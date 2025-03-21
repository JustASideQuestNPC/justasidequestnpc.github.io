export class ExprBase {
}
export class ArrayExpr extends ExprBase {
    constructor(items) {
        super();
        this.items = items;
    }
    accept(visitor) {
        return visitor.visitArrayExpr(this);
    }
}
export class AssignmentExpr extends ExprBase {
    constructor(name, value) {
        super();
        this.name = name;
        this.value = value;
    }
    accept(visitor) {
        return visitor.visitAssignmentExpr(this);
    }
}
export class BinaryExpr extends ExprBase {
    constructor(left, operator, right) {
        super();
        this.left = left;
        this.operator = operator;
        this.right = right;
    }
    accept(visitor) {
        return visitor.visitBinaryExpr(this);
    }
}
export class CallExpr extends ExprBase {
    constructor(callee, paren, args) {
        super();
        this.callee = callee;
        this.paren = paren;
        this.args = args;
    }
    accept(visitor) {
        return visitor.visitCallExpr(this);
    }
}
export class GroupingExpr extends ExprBase {
    constructor(expression) {
        super();
        this.expression = expression;
    }
    accept(visitor) {
        return visitor.visitGroupingExpr(this);
    }
}
export class IndexExpr extends ExprBase {
    constructor(indexee, index) {
        super();
        this.indexee = indexee;
        this.index = index;
    }
    accept(visitor) {
        return visitor.visitIndexExpr(this);
    }
}
export class LiteralExpr extends ExprBase {
    constructor(value) {
        super();
        this.value = value;
    }
    accept(visitor) {
        return visitor.visitLiteralExpr(this);
    }
}
export class LogicalExpr extends ExprBase {
    constructor(left, operator, right) {
        super();
        this.left = left;
        this.operator = operator;
        this.right = right;
    }
    accept(visitor) {
        return visitor.visitLogicalExpr(this);
    }
}
export class UnaryExpr extends ExprBase {
    constructor(operator, right) {
        super();
        this.operator = operator;
        this.right = right;
    }
    accept(visitor) {
        return visitor.visitUnaryExpr(this);
    }
}
export class VariableExpr extends ExprBase {
    constructor(name) {
        super();
        this.name = name;
    }
    accept(visitor) {
        return visitor.visitVariableExpr(this);
    }
}
//# sourceMappingURL=expressions.js.map