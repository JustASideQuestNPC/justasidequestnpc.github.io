export var TokenType;
(function (TokenType) {
    TokenType["LEFT_PAREN"] = "LEFT_PAREN";
    TokenType["RIGHT_PAREN"] = "RIGHT_PAREN";
    TokenType["LEFT_BRACKET"] = "LEFT_BRACKET";
    TokenType["RIGHT_BRACKET"] = "RIGHT_BRACKET";
    TokenType["LEFT_BRACE"] = "LEFT_BRACE";
    TokenType["RIGHT_BRACE"] = "RIGHT_BRACE";
    TokenType["COMMA"] = "COMMA";
    TokenType["DOT"] = "DOT";
    TokenType["MINUS"] = "MINUS";
    TokenType["PLUS"] = "PLUS";
    TokenType["SEMICOLON"] = "SEMICOLON";
    TokenType["SLASH"] = "SLASH";
    TokenType["STAR"] = "STAR";
    TokenType["NOT"] = "NOT";
    TokenType["NOT_EQUAL"] = "NOT_EQUAL";
    TokenType["EQUAL"] = "EQUAL";
    TokenType["DOUBLE_EQUAL"] = "DOUBLE_EQUAL";
    TokenType["GREATER"] = "GREATER";
    TokenType["GREATER_EQUAL"] = "GREATER_EQUAL";
    TokenType["LESS"] = "LESS";
    TokenType["LESS_EQUAL"] = "LESS_EQUAL";
    TokenType["MOD"] = "MOD";
    TokenType["DOUBLE_MOD"] = "DOUBLE_MOD";
    TokenType["IDENTIFIER"] = "IDENTIFIER";
    TokenType["STRING"] = "STRING";
    TokenType["NUMBER"] = "NUMBER";
    TokenType["AND"] = "AND";
    TokenType["ELSE"] = "ELSE";
    TokenType["FALSE"] = "FALSE";
    TokenType["FUNCDEF"] = "FUNCDEF";
    TokenType["FOR"] = "FOR";
    TokenType["IF"] = "IF";
    TokenType["NULL"] = "NULL";
    TokenType["OR"] = "OR";
    TokenType["RETURN"] = "RETURN";
    TokenType["TRUE"] = "TRUE";
    TokenType["VAR"] = "VAR";
    TokenType["WHILE"] = "WHILE";
    TokenType["EOF"] = "EOF";
})(TokenType || (TokenType = {}));
const KEYWORDS = {
    "and": TokenType.AND,
    "else": TokenType.ELSE,
    "false": TokenType.FALSE,
    "function": TokenType.FUNCDEF,
    "for": TokenType.FOR,
    "if": TokenType.IF,
    "null": TokenType.NULL,
    "or": TokenType.OR,
    "return": TokenType.RETURN,
    "true": TokenType.TRUE,
    "var": TokenType.VAR,
    "while": TokenType.WHILE,
};
export class Token {
    constructor(type, lexeme, literal, line) {
        this.type = type;
        this.lexeme = lexeme;
        this.literal = literal;
        this.line = line;
    }
    toString() {
        return `${this.type} ${this.lexeme} ${this.literal}`;
    }
}
export default class Scanner {
    constructor(source) {
        this.tokens = [];
        this.start = 0;
        this.current = 0;
        this.line = 1;
        this.hadError = false;
        this.source = source;
    }
    error(message) {
        console.error(`[Turtle] Fatal Error (line ${this.line}): ${message}`);
        this.hadError = true;
    }
    atEof() {
        return this.current >= this.source.length;
    }
    advance() {
        return this.source[this.current++];
    }
    peek() {
        if (this.atEof()) {
            return "";
        }
        return this.source[this.current];
    }
    peekNext() {
        if (this.current + 1 >= this.source.length) {
            return "";
        }
        return this.source[this.current + 1];
    }
    addToken(type, literal = null) {
        const tokenText = this.source.slice(this.start, this.current);
        this.tokens.push(new Token(type, tokenText, literal, this.line));
    }
    match(expected) {
        if (this.atEof()) {
            return false;
        }
        if (this.source[this.current] === expected) {
            ++this.current;
            return true;
        }
        return false;
    }
    isDigit(char) {
        return /^\d+$/.test(char);
    }
    isAlpha(char) {
        return /[a-zA-Z]|_/.test(char);
    }
    isAlphaNumeric(char) {
        return this.isAlpha(char) || this.isDigit(char);
    }
    scanToken() {
        const char = this.advance();
        switch (char) {
            case "(":
                this.addToken(TokenType.LEFT_PAREN);
                break;
            case ")":
                this.addToken(TokenType.RIGHT_PAREN);
                break;
            case "[":
                this.addToken(TokenType.LEFT_BRACKET);
                break;
            case "]":
                this.addToken(TokenType.RIGHT_BRACKET);
                break;
            case "{":
                this.addToken(TokenType.LEFT_BRACE);
                break;
            case "}":
                this.addToken(TokenType.RIGHT_BRACE);
                break;
            case ",":
                this.addToken(TokenType.COMMA);
                break;
            case ".":
                this.addToken(TokenType.DOT);
                break;
            case "-":
                this.addToken(TokenType.MINUS);
                break;
            case "+":
                this.addToken(TokenType.PLUS);
                break;
            case ";":
                this.addToken(TokenType.SEMICOLON);
                break;
            case "*":
                this.addToken(TokenType.STAR);
                break;
            case "/":
                this.addToken(TokenType.SLASH);
                break;
            case "!":
                this.addToken(this.match("=") ? TokenType.NOT_EQUAL : TokenType.NOT);
                break;
            case "=":
                this.addToken(this.match("=") ? TokenType.DOUBLE_EQUAL : TokenType.EQUAL);
                break;
            case "<":
                this.addToken(this.match("=") ? TokenType.LESS_EQUAL : TokenType.LESS);
                break;
            case ">":
                this.addToken(this.match("=") ? TokenType.GREATER_EQUAL : TokenType.GREATER);
                break;
            case "%":
                this.addToken(this.match("%") ? TokenType.DOUBLE_MOD : TokenType.MOD);
                break;
            case "#":
                while (this.peek() !== "\n" && !this.atEof()) {
                    this.advance();
                }
                break;
            case " ":
            case "\r":
            case "\t": break;
            case "\n":
                ++this.line;
                break;
            case '"':
                this.parseString();
                break;
            default:
                if (this.isDigit(char)) {
                    this.parseNumber();
                }
                else if (this.isAlpha(char)) {
                    this.parseIdentifier();
                }
                else {
                    this.error(`Unexpected character "${char}".`);
                }
        }
    }
    parseString() {
        while (this.peek() !== '"' && !this.atEof()) {
            if (this.peek() === "\n") {
                ++this.line;
            }
            this.advance();
        }
        if (this.atEof()) {
            this.error("Unclosed string.");
        }
        this.advance();
        this.addToken(TokenType.STRING, this.source.slice(this.start + 1, this.current - 1));
    }
    parseNumber() {
        while (this.isDigit(this.peek())) {
            this.advance();
        }
        if (this.peek() === "." && this.isDigit(this.peekNext())) {
            this.advance();
            while (this.isDigit(this.peek())) {
                this.advance();
            }
        }
        this.addToken(TokenType.NUMBER, Number.parseFloat(this.source.slice(this.start, this.current)));
    }
    parseIdentifier() {
        while (this.isAlphaNumeric(this.peek())) {
            this.advance();
        }
        const id = this.source.slice(this.start, this.current);
        if (KEYWORDS[id]) {
            this.addToken(KEYWORDS[id]);
        }
        else {
            this.addToken(TokenType.IDENTIFIER);
        }
    }
    scan() {
        while (!this.atEof()) {
            this.start = this.current;
            this.scanToken();
        }
        this.tokens.push(new Token(TokenType.EOF, "", null, this.line));
        return this.tokens;
    }
}
//# sourceMappingURL=scanner.js.map