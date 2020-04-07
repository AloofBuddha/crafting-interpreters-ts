// a repository of pure functions other classes use

export function isDigit(char: string): boolean {
  return char >= '0' && char <= '9';
}

export function isAlpha(char: string): boolean {
  return (
    (char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z') || char === '_'
  );
}

export function isAlphaNumeric(char: string): boolean {
  return isAlpha(char) || isDigit(char);
}
