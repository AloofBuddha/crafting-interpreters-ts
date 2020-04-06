import { readFileSync } from 'fs';
import { argv, stdout, stdin } from 'process';
import readline from 'readline';

import Scanner from './Scanner';

export default class Lox {
  static main() {
    const args = argv.slice(2);

    if (args.length > 1) {
      console.log('Usage: tlox [script]');
    } else if (args.length === 1) {
      Lox.runFile(args[0]);
    } else {
      Lox.runPrompt();
    }
  }

  static runFile(path: string) {
    const fileContents = readFileSync(path, 'utf8');
    Lox.run(fileContents);
  }

  static runPrompt() {
    const rl = readline.createInterface({
      input: stdin,
      output: stdout,
      terminal: false,
    });

    rl.setPrompt('> ');
    rl.prompt();

    rl.on('line', (line) => {
      Lox.run(line);
      rl.prompt();
    });
  }

  static run(source: string) {
    console.log('running Lox on input:', source);
    const scanner = new Scanner(source);
    const tokens = scanner.scanTokens();

    for (const token of tokens) {
      console.log(token);
    }
  }
}
