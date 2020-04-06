#!/usr/bin/env node
"use strict";
function run() {
    var args = process.argv.slice(2);
    if (args.length > 1) {
        console.log('Usage: tlox [script]');
    }
    else if (args.length === 1) {
        runFile(args[0]);
    }
    else {
        runPrompt();
    }
}
function runFile(path) {
    console.log('runFile:', path);
}
function runPrompt() {
    console.log('runPrompt');
}
run();
//# sourceMappingURL=index.js.map