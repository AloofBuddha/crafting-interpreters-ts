#!/usr/bin/env node
import process from 'process';

import { runFile, runPrompt } from './Lox';

const args = process.argv.slice(2);

if (args.length > 1) {
  console.log('Usage: tlox [script]');
  process.exit(64);
} else if (args.length === 1) {
  runFile(args[0]);
} else {
  runPrompt();
}
