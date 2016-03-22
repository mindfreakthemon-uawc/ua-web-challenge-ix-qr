import { Token, TokenKind } from './token';
import {
    Program,
    Expression,
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


export class Parser {
    protected index = 0;

    constructor(protected tokens: Token[]) {

    }

    parse(): Program {
        let expressions = this.parseExpressionList();

        let { kind } = this.wrap();

        if (kind !== TokenKind.LT) {
            this.errorExpectedTokenKinds(TokenKind.LT);
        }

        return new Program(expressions);
    }

    protected errorExpectedTokenKinds(...tokenKinds: TokenKind[]) {
        this.error(...tokenKinds.map(tokenKind => TokenKind[tokenKind]))
    }

    protected error(...expected: any[]) {
        let token = this.getToken();

        throw new Error(`Unexpected ${token.toString()}, expected ${expected.join(' | ')}.`);
    }

    protected getToken({ skipTokens = 0 } = {}) {
        return this.tokens[this.index + skipTokens];
    }

    protected consumeToken() {
        this.index++;
    }

    protected getTokenKind({ skipTokens = 0 } = {}) {
        return this.getToken({ skipTokens }).tokenKind;
    }

    protected getTokenPosition({ skipTokens = 0 } = {}) {
        return this.getToken({ skipTokens }).sourceLocation;
    }

    protected wrap() {
        return {
            token: this.getToken(),
            kind: this.getTokenKind(),
            position: this.getTokenPosition()
        };
    }

    protected parseExpressionList(): Expression[] {
        let expressions = [];

        while (true) {
            switch (this.getTokenKind()) {
                case TokenKind.RT_PARENTHESES:
                case TokenKind.LT:
                    return expressions;
            }

            expressions.push(this.parseExpression());
        }
    }

    protected parseExpression(): Expression {
        let { kind } = this.wrap();

        if (kind === TokenKind.LF_PARENTHESES) {
            this.consumeToken();

            let { kind } = this.wrap();
            let expression;

            switch (kind) {
                case TokenKind.IF:
                    // conditional expression
                    expression = this.parseConditionalExpression();

                    break;

                case TokenKind.SET:
                    // var assignment
                    expression = this.parseVarAssignmentExpression();

                    break;

                case TokenKind.DEFINE:
                    // function declaration expression
                    expression = this.parseFunctionDeclarationExpression();

                    break;

                case TokenKind.IDENTIFIER:
                    // function call expression
                    expression = this.parseFunctionCallExpression();

                    break;

                case TokenKind.LESS:
                case TokenKind.MORE:
                case TokenKind.LESS_EQUALS:
                case TokenKind.MORE_EQUALS:
                case TokenKind.PLUS:
                case TokenKind.MINUS:
                case TokenKind.MULT:
                case TokenKind.DIVIDE:
                case TokenKind.CARET:
                case TokenKind.EQUALS:
                case TokenKind.DEQUALS:
                case TokenKind.NEQUALS:
                case TokenKind.AND:
                case TokenKind.OR:
                case TokenKind.DAND:
                case TokenKind.DOR:
                case TokenKind.NEGATION:
                case TokenKind.TILDE:
                    // operation expression
                    expression = this.parseOperationExpression();

                    break;

                case TokenKind.BOOLEAN_LITERAL:
                case TokenKind.STRING_LITERAL:
                case TokenKind.NUMBER_LITERAL:
                    expression = this.parseAnyLiteral();

                    break;
                
                default:
                    this.errorExpectedTokenKinds(TokenKind.IF, TokenKind.SET, TokenKind.DEFINE, TokenKind.IDENTIFIER);
            }

            if (this.getTokenKind() !== TokenKind.RT_PARENTHESES) {
                this.errorExpectedTokenKinds(TokenKind.RT_PARENTHESES);
            }

            this.consumeToken();

            return expression;
        } else if (kind === TokenKind.IDENTIFIER) {
            return this.parseVarReferenceExpression();
        } else {
            switch (kind) {
                case TokenKind.BOOLEAN_LITERAL:
                case TokenKind.STRING_LITERAL:
                case TokenKind.NUMBER_LITERAL:
                    return this.parseAnyLiteral();
            }
        }

        this.errorExpectedTokenKinds(TokenKind.BOOLEAN_LITERAL, TokenKind.NUMBER_LITERAL, TokenKind.STRING_LITERAL, TokenKind.LF_PARENTHESES, TokenKind.IDENTIFIER);
    }

    protected parseAnyLiteral(): Expression  {
        let { token, position, kind } = this.wrap();

        switch (kind) {
            case TokenKind.BOOLEAN_LITERAL:
                this.consumeToken();

                return new BooleanLiteralValue(token.booleanData, position);
            case TokenKind.STRING_LITERAL:
                this.consumeToken();

                return new StringLiteralValue(token.stringData, position);
            case TokenKind.NUMBER_LITERAL:
                this.consumeToken();

                return new NumberLiteralValue(token.numberData, position);
        }

        this.errorExpectedTokenKinds(TokenKind.BOOLEAN_LITERAL, TokenKind.NUMBER_LITERAL, TokenKind.STRING_LITERAL);
    }

    protected parseOperationExpression() {
        let { kind, position } = this.wrap();

        this.consumeToken();

        let args = this.parseExpressionList();

        return new OperationExpression(kind, position, args);
    }

    protected parseFunctionCallExpression() {
        let { token, position } = this.wrap();

        let identifier = token.stringData;

        this.consumeToken();

        let args = this.parseExpressionList();

        return new FunctionCallExpression(identifier, position, args);
    }

    protected parseFunctionDeclarationExpression() {
        let position = this.getTokenPosition();

        this.consumeToken();

        if (this.getTokenKind() !== TokenKind.LF_PARENTHESES) {
            this.errorExpectedTokenKinds(TokenKind.LF_PARENTHESES);
        }

        this.consumeToken();

        if (this.getTokenKind() !== TokenKind.IDENTIFIER) {
            this.errorExpectedTokenKinds(TokenKind.IDENTIFIER);
        }

        let identifier = this.getToken().stringData;

        this.consumeToken();

        let names: VarReferenceExpression[] = [];

        while (this.getTokenKind() === TokenKind.IDENTIFIER) {
            names.push(this.parseVarReferenceExpression());
        }

        if (this.getTokenKind() !== TokenKind.RT_PARENTHESES) {
            this.errorExpectedTokenKinds(TokenKind.RT_PARENTHESES);
        }

        this.consumeToken();

        let body = this.parseExpressionList();

        return new FunctionDeclarationExpression(identifier, position, names, body);
    }

    protected parseVarAssignmentExpression() {
        let position = this.getTokenPosition();

        this.consumeToken();

        let { token, kind } = this.wrap();

        if (kind !== TokenKind.IDENTIFIER) {
            this.errorExpectedTokenKinds(TokenKind.IDENTIFIER);
        }

        this.consumeToken();

        let identified = token.stringData;

        let value = this.parseExpression();

        return new VarAssignmentExpression(identified, position, value);
    }

    protected parseConditionalExpression() {
        let position = this.getTokenPosition();

        this.consumeToken();

        let condition = this.parseExpression();

        let truthy = this.parseExpression();

        let falsy = null;

        if (this.getTokenKind() !== TokenKind.RT_PARENTHESES) {
            falsy = this.parseExpression();
        }

        return new ConditionalExpression(position, condition, truthy, falsy);
    }

    protected parseVarReferenceExpression(): VarReferenceExpression {
        let { token, position } = this.wrap();

        this.consumeToken();

        return new VarReferenceExpression(token.stringData, position);
    }
}
