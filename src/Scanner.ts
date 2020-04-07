import Token from './Token';
import TokenType from './TokenType';
import { error } from './Lox';
import { isDigit, isAlpha, isAlphaNumeric } from './helpers';

export default class Scanner {
  private tokens: Token[] = [];
  private start = 0;
  private current = 0;
  private line = 1;

  private get isAtEnd(): boolean {
    return this.current >= this.source.length;
  }

  constructor(readonly source: string) {}

  scanTokens(): Token[] {
    while (!this.isAtEnd) {
      // we are at the beginning of the next lexeme
      this.start = this.current;
      this.scanToken();
    }

    this.tokens.push(new Token(TokenType.EOF, '', null, this.line));

    return this.tokens;
  }

  private scanToken() {
    const char = this.advance();

    switch (char) {
      case '(':
        this.addToken(TokenType.LEFT_PAREN);
        break;

      case ')':
        this.addToken(TokenType.RIGHT_PAREN);
        break;

      case '{':
        this.addToken(TokenType.LEFT_BRACE);
        break;

      case '}':
        this.addToken(TokenType.RIGHT_BRACE);
        break;

      case ',':
        this.addToken(TokenType.COMMA);
        break;

      case '.':
        this.addToken(TokenType.DOT);
        break;

      case '-':
        this.addToken(TokenType.MINUS);
        break;

      case '+':
        this.addToken(TokenType.PLUS);
        break;

      case ';':
        this.addToken(TokenType.SEMICOLON);
        break;

      case '*':
        this.addToken(TokenType.STAR);
        break;

      case '!':
        this.addToken(this.match('=') ? TokenType.BANG_EQUAL : TokenType.BANG);
        break;

      case '=':
        this.addToken(
          this.match('=') ? TokenType.EQUAL_EQUAL : TokenType.EQUAL
        );
        break;

      case '<':
        this.addToken(this.match('=') ? TokenType.LESS_EQUAL : TokenType.LESS);
        break;

      case '>':
        this.addToken(
          this.match('=') ? TokenType.GREATER_EQUAL : TokenType.GREATER
        );
        break;

      case '/':
        if (this.match('/')) {
          // A comment goes until the end of the line.
          while (this.peek() !== '\n' && !this.isAtEnd) {
            this.advance();
          }
        } else {
          this.addToken(TokenType.SLASH);
        }
        break;

      case ' ':
      case '\r':
      case '\t':
        // ignore whitespace
        break;

      case '\n':
        this.line++;
        break;

      case '"':
        this.string();
        break;

      default:
        if (isDigit(char)) {
          this.number();
        } else if (isAlpha(char)) {
          this.identifier();
        } else {
          error(this.line, `Unexpected character: '${char}'`);
        }
    }
  }

  private addToken(type: TokenType, literal: any = null) {
    const text = this.source.substring(this.start, this.current);
    this.tokens.push(new Token(type, text, literal, this.line));
  }

  private advance(): string {
    this.current++;
    return this.source.charAt(this.current - 1);
  }

  // conditional advance
  private match(expected: string): boolean {
    if (this.isAtEnd) return false;
    if (this.source.charAt(this.current) != expected) return false;

    this.current++;
    return true;
  }

  // like advance, but doesn't consume
  private peek(): string {
    if (this.isAtEnd) return '\0';
    return this.source.charAt(this.current);
  }

  private peekNext(): string {
    if (this.current + 1 >= this.source.length) return '\0';
    return this.source.charAt(this.current + 1);
  }

  // note: Lox supports multi-line strings
  private string() {
    while (this.peek() !== '"' && !this.isAtEnd) {
      if (this.peek() === '\n') this.line++;
      this.advance();
    }

    // unterminated string
    if (this.isAtEnd) {
      error(this.line, 'Unterminated string.');
      return;
    }

    // the closing "
    this.advance();

    // trim the surrounding quotes
    const value = this.source.substring(this.start + 1, this.current - 1);
    this.addToken(TokenType.STRING, value);
  }

  private number() {
    while (isDigit(this.peek())) this.advance();

    // look for a fractional part
    if (this.peek() === '.' && isDigit(this.peekNext())) {
      // consumethe '.'
      this.advance();

      while (isDigit(this.peek())) this.advance();
    }

    const value = Number.parseFloat(
      this.source.substring(this.start, this.current)
    );
    this.addToken(TokenType.NUMBER, value);
  }

  private identifier() {
    while (isAlphaNumeric(this.peek())) this.advance();

    this.addToken(TokenType.IDENTIFIER);
  }
}
