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


export class Visitor {

    visitProgram(program: Program) {
        program.expressions.forEach(expression => expression.accept(this));
    }

    visitFunctionDeclarationExpression(functionDeclarationExpression: FunctionDeclarationExpression) {
        functionDeclarationExpression.args.forEach(arg => arg.accept(this));
        functionDeclarationExpression.body.forEach(expression => expression.accept(this));
    }

    visitVarAssignmentExpression(varAssignmentExpression: VarAssignmentExpression) {
        varAssignmentExpression.value.accept(this);
    }

    visitConditionalExpression(conditionalExpression: ConditionalExpression) {
        conditionalExpression.condition.accept(this);
        conditionalExpression.truthy.accept(this);

        if (conditionalExpression.falsy) {
            conditionalExpression.falsy.accept(this);
        }
    }

    visitVarReferenceExpression(varReferenceExpression: VarReferenceExpression) {

    }

    visitOperationExpression(operationExpression: OperationExpression) {
        operationExpression.args.forEach(arg => arg.accept(this));
    }

    visitFunctionCallExpression(functionCallExpression: FunctionCallExpression) {
        functionCallExpression.args.forEach(arg => arg.accept(this));
    }

    visitBooleanLiteralValue(booleanLiteralValue: BooleanLiteralValue) {

    }

    visitStringLiteralValue(stringLiteralValue: StringLiteralValue) {

    }

    visitNumberLiteralValue(numberLiteralValue: NumberLiteralValue) {

    }
}
