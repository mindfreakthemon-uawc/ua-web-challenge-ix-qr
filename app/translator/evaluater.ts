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
import { Visitor } from './visitor';
import { TokenKind } from './token';

export class Evaluater extends Visitor {

    constructor(public program: Program) {
        super();
    }

    evaluate() {
        return this.visitProgram(this.program);
    }

    visitProgram(program: Program) {
        let results = program.expressions.map(expression => expression.accept(this));

        return results.pop();
    }

    visitFunctionDeclarationExpression(functionDeclarationExpression: FunctionDeclarationExpression) {


        functionDeclarationExpression.args.forEach(arg => arg.accept(this));
        functionDeclarationExpression.body.forEach(expression => expression.accept(this));
    }

    visitVarAssignmentExpression(varAssignmentExpression: VarAssignmentExpression) {
        varAssignmentExpression.value.accept(this);
    }

    visitConditionalExpression(conditionalExpression: ConditionalExpression) {
        let condition = conditionalExpression.condition.accept(this);

        if (condition) {
            return conditionalExpression.truthy.accept(this);
        } else if (conditionalExpression.falsy) {
            return conditionalExpression.falsy.accept(this);
        }
    }

    visitVarReferenceExpression(varReferenceExpression: VarReferenceExpression) {

    }

    visitOperationExpression(operationExpression: OperationExpression): any {
        let args = operationExpression.args.map(arg => arg.accept(this));
        let arg1 = args[0];
        let arg2 = args[1];

        switch (operationExpression.type) {
            case TokenKind.LESS:
                return arg1 < arg2;
            case TokenKind.MORE:
                return arg1 > arg2;

            case TokenKind.LESS_EQUALS:
                return arg1 <= arg2;
            case TokenKind.MORE_EQUALS:
                return arg1 >= arg2;

            case TokenKind.PLUS:
                return args.reduce((memo, current) => memo + current, 0);
            case TokenKind.MINUS:
                return arg1 - arg2;
            case TokenKind.MULT:
                return args.reduce((memo, current) => memo * current, 1);
            case TokenKind.DIVIDE:
                return arg1 / arg2;

            case TokenKind.CARET:
                return Math.pow(arg1, arg2);
            case TokenKind.EQUALS:
                return arg1 == arg2;
            case TokenKind.DEQUALS:
                return arg1 === arg2;
            case TokenKind.NEQUALS:
                return arg1 != arg2;

            case TokenKind.AND:
                return args.reduce((memo, current) => memo & current, 0);
            case TokenKind.OR:
                return args.reduce((memo, current) => memo | current, 0);
            case TokenKind.DAND:
                return args.reduce((memo, current) => memo && current, true);
            case TokenKind.DOR:
                return args.reduce((memo, current) => memo || current, false);
            case TokenKind.NEGATION:
                return !arg1;
            case TokenKind.TILDE:
                return ~arg1;
        }
    }

    visitFunctionCallExpression(functionCallExpression: FunctionCallExpression): any {
        let args = functionCallExpression.args.map(arg => arg.accept(this));


    }

    visitBooleanLiteralValue(booleanLiteralValue: BooleanLiteralValue): boolean {
        return booleanLiteralValue.value;
    }

    visitStringLiteralValue(stringLiteralValue: StringLiteralValue): string {
        return stringLiteralValue.value;
    }

    visitNumberLiteralValue(numberLiteralValue: NumberLiteralValue): number {
        return numberLiteralValue.value;
    }
}
