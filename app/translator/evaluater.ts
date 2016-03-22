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

    stack = [];

    scope: Map<string, any>[] = [];

    constructor(public program: Program) {
        super();

        let globals = this.createScope();

        // provide math functions & constants
        this.importToScope(globals, Math);
        
        globals.set('log', console.log.bind(console));
    }

    evaluate() {
        return this.visitProgram(this.program);
    }

    visitProgram(program: Program) {
        let results = program.expressions.map(expression => expression.accept(this));

        return results.pop();
    }

    visitFunctionDeclarationExpression(functionDeclarationExpression: FunctionDeclarationExpression) {
        let name = functionDeclarationExpression.name;
        let argNames = functionDeclarationExpression.args.map(arg => arg.name);

        let func = (...args) => {
            let scope = this.createScope();

            argNames.forEach((name, index) => {
                scope.set(name, args[index]);
            });

            let results = functionDeclarationExpression.body.map(expression => expression.accept(this));

            this.vanishScope();

            return results.pop();
        };

        func.toString = () => {
            return `function ${name}`;
        };

        this.scope[0].set(name, func);

        return func;
    }

    visitVarAssignmentExpression(varAssignmentExpression: VarAssignmentExpression) {
        let name = varAssignmentExpression.name;
        let value = varAssignmentExpression.value.accept(this);

        this.assign(name, value);

        return value;
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
        let name = varReferenceExpression.name;

        return this.retrieve(name);
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
                return Math.pow(Number(arg1), Number(arg2));
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
        let name = functionCallExpression.name;

        let func = this.retrieve(name);

        if (func instanceof Function) {
            return func.apply(null, args);
        }

        throw new Error(`TypeError: ${name} is not a function.`);
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

    protected importToScope(scope, object) {
        Object.getOwnPropertyNames(object)
            .forEach(key => {
                if (Math[key] instanceof Function) {
                    scope.set(key, object[key].bind(Math));
                } else {
                    scope.set(key, object[key]);
                }
            });
    }
    protected assign(key, value) {
        this.scope[0].set(key, value);
    }

    protected retrieve(key) {
        let map = this.scope.find(map => {
            if (map.has(key)) {
                return true;
            }
        });

        if (map) {
            return map.get(key);
        }

        return undefined;
    }

    protected createScope() {
        let scope = new Map<string, any>();

        this.scope.unshift(scope);

        return scope;
    }

    protected vanishScope() {
        this.scope.shift();
    }
}
