import fs from 'fs';
import readline from 'readline';
import process from 'process';

import Scanner from './Scanner';

let hadError = false;

export function runFile(path: string) {
  const fileContents = fs.readFileSync(path, 'utf8');
  run(fileContents);

  if (hadError) process.exit(65);
}

export function runPrompt() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
  });

  rl.setPrompt('> ');
  rl.prompt();

  rl.on('line', (line) => {
    run(line);
    hadError = false;
    rl.prompt();
  });
}

function run(source: string) {
  const scanner = new Scanner(source);
  const tokens = scanner.scanTokens();

  for (const token of tokens) {
    console.log(token.toString());
  }
}

export function error(line: number, message: string) {
  report(line, '', message);
}

function report(line: number, where: string, message: string) {
  console.error(`[line ${line}] Error${where}: ${message}`);
  hadError = true;
}
