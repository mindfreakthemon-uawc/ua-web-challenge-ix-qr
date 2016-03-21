import { TokenKind, SourceLocation, Token } from './token';

const NULL = '\0';
const IDENTIFIER_REGEXP = /^[a-z0-9_$]+$/i;

export class Lexer {
    protected col = 0;
    protected row = 1;

    protected current = -1;

    constructor(protected source: string) {

    }

    scan() {
        let buffer = '';

        let c = this.getAndConsumeNext({ skipSpace: true });

        let sl = new SourceLocation(this.row, this.col);

        switch (c) {
            case NULL:
                return new Token(TokenKind.LT, sl);
            case '0':
                let nc = this.getNext();

                if (nc >= '0' && nc <= '9') {
                    return new Token(TokenKind.AMBIGUOUS_NUMBER_LITERAL, sl);
                }

                if (nc !== '.') {
                    return new Token(TokenKind.NUMBER_LITERAL, sl, {
                        numberData: 0
                    });
                }

                /* fall through */
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                let isFloat = false;

                buffer += c;

                c = this.getNext();

                while ((c >= '0' && c <= '9') || (c === '.' && !isFloat)) {
                    c = this.getAndConsumeNext();

                    if (c === '.') {
                        isFloat = true;
                    }

                    buffer += c;

                    c = this.getNext();
                }

                return new Token(TokenKind.NUMBER_LITERAL, sl, {
                    numberData: isFloat ? parseFloat(buffer) : parseInt(buffer, 10)
                });
            case '(':
                return new Token(TokenKind.LF_PARENTHESES, sl);
            case ')':
                return new Token(TokenKind.RT_PARENTHESES, sl);
            case '[':
                return new Token(TokenKind.LF_SQ_BRACKET, sl);
            case ']':
                return new Token(TokenKind.RT_SQ_BRACKET, sl);
            case ';':
                return new Token(TokenKind.SEMICOLON, sl);
            case ':':
                return new Token(TokenKind.COLON, sl);
            case ',':
                return new Token(TokenKind.COMMA, sl);
            case '<':
                if (this.getNext() === '=') {
                    this.getAndConsumeNext();
                    return new Token(TokenKind.LESS_EQUALS, sl);
                } else {
                    return new Token(TokenKind.LESS, sl);
                }

            case '>':
                if (this.getNext() === '=') {
                    this.getAndConsumeNext();
                    return new Token(TokenKind.MORE_EQUALS, sl);
                } else {
                    return new Token(TokenKind.MORE, sl);
                }

            case '+':
                return new Token(TokenKind.PLUS, sl);
            case '-':
                return new Token(TokenKind.MINUS, sl);
            case '*':
                return new Token(TokenKind.MULT, sl);
            case '/':
                return new Token(TokenKind.DIVIDE, sl);
            case '^':
                return new Token(TokenKind.CARET, sl);
            case '=':
                if (this.getNext() === '=') {
                    this.getAndConsumeNext();
                    return new Token(TokenKind.DEQUALS, sl);
                } else {
                    return new Token(TokenKind.EQUALS, sl);
                }

            case '&':
                if (this.getNext() === '&') {
                    this.getAndConsumeNext();
                    return new Token(TokenKind.DAND, sl);
                } else {
                    return new Token(TokenKind.AND, sl);
                }

            case '|':
                if (this.getNext() === '|') {
                    this.getAndConsumeNext();
                    return new Token(TokenKind.DOR, sl);
                } else {
                    return new Token(TokenKind.OR, sl);
                }

            case '!':
                if (this.getNext() === '=') {
                    this.getAndConsumeNext();
                    return new Token(TokenKind.NEQUALS, sl);
                } else {
                    return new Token(TokenKind.NEGATION, sl);
                }

            case '~':
                return new Token(TokenKind.TILDE, sl);

            case '\'':
            case '"':
                let opening = c;

                c = this.getAndConsumeNext();

                while (c !== opening && c !== NULL) {
                    buffer += c;

                    c = this.getAndConsumeNext();
                }

                if (c === NULL) {
                    return new Token(TokenKind.UNTERMINATED_STRING_LITERAL, sl);
                }

                return new Token(TokenKind.STRING_LITERAL, sl, { stringData: buffer });

            default:
                if (Lexer.isIdentifierChar(c)) {
                    buffer += c;

                    c = this.getNext();
                } else {
                    return new Token(TokenKind.UNKNOWN_TOKEN, sl);
                }

                while (Lexer.isIdentifierChar(c)) {
                    c = this.getAndConsumeNext();

                    buffer += c;

                    c = this.getNext();
                }

                if (buffer === 'define') {
                    return new Token(TokenKind.DEFINE, sl);
                }
                if (buffer === 'if') {
                    return new Token(TokenKind.IF, sl);
                }
                if (buffer === 'set') {
                    return new Token(TokenKind.SET, sl);
                }
                if (buffer === 'while') {
                    return new Token(TokenKind.WHILE, sl);
                }
                if (buffer === 'return') {
                    return new Token(TokenKind.RETURN, sl);
                }

                if (buffer === 'true') {
                    return new Token(TokenKind.BOOLEAN_LITERAL, sl, { booleanData: true });
                }
                if (buffer === 'false') {
                    return new Token(TokenKind.BOOLEAN_LITERAL, sl, { booleanData: false });
                }

                return new Token(TokenKind.IDENTIFIER, sl, { stringData: buffer });
        }
    }

    tokenize() {
        let tokens = [];
        let token: Token;

        while ((token = this.scan()).tokenKind !== TokenKind.LT) {
            tokens.push(token);
        }

        tokens.push(new Token(TokenKind.LT, new SourceLocation(this.row, this.col)));

        return tokens;
    }

    protected getNext({ skipChars = 0, skipSpace = false, consume = false } = {}) {
        let c: string;

        let current = this.current + skipChars;
        let source = this.source;
        let row = this.row;
        let col = this.col;

        while (true) {
            current++;
            col++;

            if (current >= this.source.length) {
                // EOF
                return NULL;
            }

            if (source[current] === '\r' && source[current + 1] === '\n') {
                current += 2;
                row++;
                col = 1;
            }

            if (source[current] === '\n') {
                current++;
                row++;
                col = 1;
            }

            c = source[current];

            if (!skipSpace || c !== ' ') {
                break;
            }
        }

        if (consume) {
            this.current = current;
            this.row = row;
            this.col = col;
        }

        return c;
    }

    protected getAndConsumeNext({ skipSpace = false } = {}) {
        return this.getNext({ skipSpace, consume: true });
    }

    protected static isIdentifierChar(c) {
        return IDENTIFIER_REGEXP.test(c);
    }
}
