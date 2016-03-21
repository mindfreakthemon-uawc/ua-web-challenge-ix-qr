import { SourceLocation, TokenKind } from './token';
import { Visitor } from './visitor';

export class Program {
    constructor(public expressions: Expression[]) {

    }
}

export abstract class Expression {
    constructor(public sourceLocation: SourceLocation) {

    }

    abstract accept(visitor: Visitor);
}

export class VarReferenceExpression extends Expression {
    constructor(public name: string, sourceLocation: SourceLocation) {
        super(sourceLocation);
    }

    accept(visitor: Visitor) {
        return visitor.visitVarReferenceExpression(this);
    }
}

export class VarAssignmentExpression extends Expression {
    constructor(public name: string, sourceLocation: SourceLocation, public value: Expression) {
        super(sourceLocation);
    }

    accept(visitor: Visitor) {
        return visitor.visitVarAssignmentExpression(this);
    }
}

export class FunctionCallExpression extends Expression {
    constructor(public name: string, sourceLocation: SourceLocation, public args: Expression[] = []) {
        super(sourceLocation);
    }

    accept(visitor: Visitor) {
        return visitor.visitFunctionCallExpression(this);
    }
}

export class OperationExpression extends Expression {
    constructor(public type: TokenKind, sourceLocation: SourceLocation, public args: Expression[] = []) {
        super(sourceLocation);
    }

    accept(visitor: Visitor) {
        return visitor.visitOperationExpression(this);
    }
}

export class FunctionDeclarationExpression extends Expression {
    constructor(public name: string, sourceLocation: SourceLocation, public args: VarReferenceExpression[] = [], public body: Expression[] = []) {
        super(sourceLocation);
    }

    accept(visitor: Visitor) {
        return visitor.visitFunctionDeclarationExpression(this);
    }
}

export class ConditionalExpression extends Expression {
    constructor(sourceLocation: SourceLocation, public condition: Expression, public truthy: Expression, public falsy: Expression) {
        super(sourceLocation);
    }

    accept(visitor: Visitor) {
        return visitor.visitConditionalExpression(this);
    }
}

export class StringLiteralValue extends Expression {
    constructor(public value: string, sourceLocation: SourceLocation) {
        super(sourceLocation);
    }

    accept(visitor: Visitor) {
        return visitor.visitStringLiteralValue(this);
    }
}

export class NumberLiteralValue extends Expression {
    constructor(public value: number, sourceLocation: SourceLocation) {
        super(sourceLocation);
    }

    accept(visitor: Visitor) {
        return visitor.visitNumberLiteralValue(this);
    }
}

export class BooleanLiteralValue extends Expression {
    constructor(public value: boolean, sourceLocation: SourceLocation) {
        super(sourceLocation);
    }

    accept(visitor: Visitor) {
        return visitor.visitBooleanLiteralValue(this);
    }
}
