import { readFileSync } from 'fs';
import { argv, stdout, stdin, exit } from 'process';
import readline from 'readline';

import Scanner from './Scanner';

export default class Lox {
  static hadError = false;

  static main() {
    const args = argv.slice(2);

    if (args.length > 1) {
      console.log('Usage: tlox [script]');
      exit(64);
    } else if (args.length === 1) {
      Lox.runFile(args[0]);
    } else {
      Lox.runPrompt();
    }
  }

  private static runFile(path: string) {
    const fileContents = readFileSync(path, 'utf8');
    Lox.run(fileContents);

    if (Lox.hadError) exit(65);
  }

  private static runPrompt() {
    const rl = readline.createInterface({
      input: stdin,
      output: stdout,
      terminal: false,
    });

    rl.setPrompt('> ');
    rl.prompt();

    rl.on('line', (line) => {
      Lox.run(line);
      Lox.hadError = false;
      rl.prompt();
    });
  }

  private static run(source: string) {
    const scanner = new Scanner(source);
    const tokens = scanner.scanTokens();

    for (const token of tokens) {
      console.log(token.toString());
    }
  }

  static error(line: number, message: string) {
    Lox.report(line, '', message);
  }

  private static report(line: number, where: string, message: string) {
    console.error(`[line ${line}] Error ${where}: ${message}`);
    Lox.hadError = true;
  }
}
