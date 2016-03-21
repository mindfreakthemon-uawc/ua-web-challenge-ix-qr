import {
    Program,
    FunctionDeclarationExpression,
    VarAssignmentExpression,
    ConditionalExpression,
    VarReferenceExpression,
    OperationExpression,
    FunctionCallExpression,
    BooleanLiteralValue,
    StringLiteralValue,
    NumberLiteralValue
} from './node';
import { TokenKind, Token } from './token';
import { Visitor } from './visitor';


export class Checker extends Visitor {
    constructor(public program: Program) {
        super();
    }

    check() {
        this.visitProgram(this.program);
    }
}

export class FunctionDuplicateDefineChecker extends Checker {
    functions: string[] = [];

    visitFunctionDeclarationExpression(functionDeclarationExpression: FunctionDeclarationExpression) {
        let name = functionDeclarationExpression.name;

        if (this.functions.indexOf(name) === -1) {
            this.functions.push(name);
        } else {
            throw new Error(`Function ${name} is already defined.`);
        }
    }
}

export class FunctionCallChecker extends Checker {
    functions = new Set();

    visitFunctionDeclarationExpression(functionDeclarationExpression: FunctionDeclarationExpression) {
        this.functions.add(functionDeclarationExpression.name);
    }

    visitFunctionCallExpression(functionCallExpression: FunctionCallExpression) {
        let name = functionCallExpression.name;

        if (!this.functions.has(name)) {
            throw new Error(`Function ${name} is not yet defined.`);
        }
    }
}

export class OperationArityChecker extends Checker {
    visitOperationExpression(operationExpression: OperationExpression) {
        let type = operationExpression.type;

        let arityMin = 1;
        let arityMax = Number.MAX_SAFE_INTEGER;

        switch (type) {
            case TokenKind.MORE:
            case TokenKind.LESS:
            case TokenKind.LESS_EQUALS:
            case TokenKind.MORE_EQUALS:
            case TokenKind.MINUS:
            case TokenKind.DIVIDE:
            case TokenKind.CARET:
            case TokenKind.EQUALS:
            case TokenKind.DEQUALS:
            case TokenKind.NEQUALS:

                arityMin = 2;
                arityMax = 2;

                break;

            case TokenKind.PLUS:
            case TokenKind.MULT:
            case TokenKind.AND:
            case TokenKind.OR:
            case TokenKind.DAND:
            case TokenKind.DOR:

                arityMin = 2;

                break;

            case TokenKind.NEGATION:
            case TokenKind.TILDE:

                arityMin = 1;
                arityMax = 1;

                break;
        }

        if (operationExpression.args.length < arityMin || operationExpression.args.length > arityMax) {
            throw new Error(`Operation ${Token.operatorSourceString(type)} supports ${arityMin} min and ${arityMax} max args`);
        }
    }
}
