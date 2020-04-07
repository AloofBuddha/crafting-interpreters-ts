import TokenType from './TokenType';

export default class Token {
  constructor(
    readonly type: TokenType,
    readonly lexeme: string,
    readonly literal: any,
    readonly line: number
  ) {}

  toString(): string {
    return `${TokenType[this.type]} ${this.lexeme} ${this.literal}`;
  }
}
