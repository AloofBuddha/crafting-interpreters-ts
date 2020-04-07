import Token from './Token';
import TokenType from './TokenType';
import ReservedWords from './ReservedWords';
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
        return this.addToken(TokenType.LEFT_PAREN);

      case ')':
        return this.addToken(TokenType.RIGHT_PAREN);

      case '{':
        return this.addToken(TokenType.LEFT_BRACE);

      case '}':
        return this.addToken(TokenType.RIGHT_BRACE);

      case ',':
        return this.addToken(TokenType.COMMA);

      case '.':
        return this.addToken(TokenType.DOT);

      case '-':
        return this.addToken(TokenType.MINUS);

      case '+':
        return this.addToken(TokenType.PLUS);

      case ';':
        return this.addToken(TokenType.SEMICOLON);

      case '*':
        return this.addToken(TokenType.STAR);

      case '!':
        return this.addToken(
          this.match('=') ? TokenType.BANG_EQUAL : TokenType.BANG
        );

      case '=':
        return this.addToken(
          this.match('=') ? TokenType.EQUAL_EQUAL : TokenType.EQUAL
        );

      case '<':
        return this.addToken(
          this.match('=') ? TokenType.LESS_EQUAL : TokenType.LESS
        );

      case '>':
        return this.addToken(
          this.match('=') ? TokenType.GREATER_EQUAL : TokenType.GREATER
        );

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
        return this.line++;

      case '"':
        return this.string();

      default:
        if (isDigit(char)) {
          return this.number();
        } else if (isAlpha(char)) {
          return this.identifier();
        } else {
          return error(this.line, `Unexpected character: '${char}'`);
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

    // see if the identifier is a reserved word
    const text = this.source.substring(this.start, this.current);
    const type = ReservedWords[text] || TokenType.IDENTIFIER;
    this.addToken(type);
  }
}
