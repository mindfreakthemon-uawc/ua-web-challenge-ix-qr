export class SourceLocation {
    constructor(public line: number, public column: number) {
    }

    toString() {
        return `line: ${this.line}; column: ${this.column}`;
    }
}

export enum TokenKind {
    LF_PARENTHESES, //'('
    RT_PARENTHESES, //')'
    LF_SQ_BRACKET, //'['
    RT_SQ_BRACKET, //']'

    SEMICOLON, //';'
    COLON, //':'
    COMMA, //','

    LESS, //'<'
    MORE, //'>'

    LESS_EQUALS, //'<='
    MORE_EQUALS, //'>='

    PLUS, //'+'
    MINUS, //'-'
    MULT, //'*'
    DIVIDE, //'/'

    IDENTIFIER,

    CARET, //'^'
    EQUALS, //'='
    DEQUALS, //'=='
    NEQUALS, //'!='
    AND, //'&'
    OR, //'|'
    DAND, //'&&'
    DOR, //'||'
    NEGATION, //!
    TILDE, //~

    DEFINE,
    WHILE,
    RETURN,
    IF,
    SET,

    NUMBER_LITERAL,
    AMBIGUOUS_NUMBER_LITERAL,
    BOOLEAN_LITERAL,
    STRING_LITERAL,
    UNTERMINATED_STRING_LITERAL,

    UNKNOWN_TOKEN,

    LT //last token of file
}

export interface TokenOptions {
    id?: string;

    stringData?: string;
    numberData?: number;
    booleanData?: boolean;
}

export class Token {
    stringData: string;
    numberData: number;
    booleanData: boolean;

    constructor(public tokenKind: TokenKind, public sourceLocation: SourceLocation, options: TokenOptions = {}) {
        this.stringData = options.stringData;
        this.numberData = options.numberData;
        this.booleanData = options.booleanData;
    }

    toSource() {
        switch (this.tokenKind) {
            case TokenKind.BOOLEAN_LITERAL:
                return String(this.booleanData);
            case TokenKind.NUMBER_LITERAL:
                return String(this.numberData);
            case TokenKind.IDENTIFIER:
            case TokenKind.STRING_LITERAL:
                return this.stringData;

            case TokenKind.DEFINE:
                return 'define';
            case TokenKind.IF:
                return 'if';
            case TokenKind.SET:
                return 'set';
            case TokenKind.WHILE:
                return 'while';
            case TokenKind.RETURN:
                return 'return';

            case TokenKind.AMBIGUOUS_NUMBER_LITERAL:
            case TokenKind.UNTERMINATED_STRING_LITERAL:
            case TokenKind.UNKNOWN_TOKEN:
                return '<>';

            default:
                return Token.operatorSourceString(this.tokenKind);
        }
    }

    toKind() {
        return TokenKind[this.tokenKind] || 'unknown';
    }

    toString() {
        return `${this.toKind()}#{${this.toSource()}}@{${this.sourceLocation}}`;
    }

    static operatorSourceString(tokenKind: TokenKind) {
        switch (tokenKind) {
            case TokenKind.LESS:
                return '<';
            case TokenKind.MORE:
                return '>';

            case TokenKind.LESS_EQUALS:
                return '<=';
            case TokenKind.MORE_EQUALS:
                return '>=';

            case TokenKind.PLUS:
                return '+';
            case TokenKind.MINUS:
                return '-';
            case TokenKind.MULT:
                return '*';
            case TokenKind.DIVIDE:
                return '/';

            case TokenKind.CARET:
                return '^';
            case TokenKind.EQUALS:
                return '=';
            case TokenKind.DEQUALS:
                return '==';
            case TokenKind.NEQUALS:
                return '!=';
            case TokenKind.AND:
                return '&';
            case TokenKind.OR:
                return '|';
            case TokenKind.DAND:
                return '&&';
            case TokenKind.DOR:
                return '||';
            case TokenKind.NEGATION:
                return '!';
            case TokenKind.TILDE:
                return '~';
        }

        return '?';
    }
}
