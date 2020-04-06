#!/usr/bin/env node

function run() {
  const args = process.argv.slice(2);

  if (args.length > 1) {
    console.log('Usage: tlox [script]');
  } else if (args.length === 1) {
    runFile(args[0]);
  } else {
    runPrompt();
  }
}

function runFile(path: string) {
  console.log('runFile:', path);
}

function runPrompt() {
  console.log('runPrompt');
}

run();
