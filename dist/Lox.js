"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var process_1 = require("process");
var readline_1 = __importDefault(require("readline"));
var Scanner_1 = __importDefault(require("./Scanner"));
var Lox = /** @class */ (function () {
    function Lox() {
    }
    Lox.main = function () {
        var args = process_1.argv.slice(2);
        if (args.length > 1) {
            console.log('Usage: tlox [script]');
            process_1.exit(64);
        }
        else if (args.length === 1) {
            Lox.runFile(args[0]);
        }
        else {
            Lox.runPrompt();
        }
    };
    Lox.runFile = function (path) {
        var fileContents = fs_1.readFileSync(path, 'utf8');
        Lox.run(fileContents);
        if (Lox.hadError)
            process_1.exit(65);
    };
    Lox.runPrompt = function () {
        var rl = readline_1.default.createInterface({
            input: process_1.stdin,
            output: process_1.stdout,
            terminal: false,
        });
        rl.setPrompt('> ');
        rl.prompt();
        rl.on('line', function (line) {
            Lox.run(line);
            Lox.hadError = false;
            rl.prompt();
        });
    };
    Lox.run = function (source) {
        var scanner = new Scanner_1.default(source);
        var tokens = scanner.scanTokens();
        for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
            var token = tokens_1[_i];
            console.log(token);
        }
    };
    Lox.error = function (line, message) {
        Lox.report(line, '', message);
    };
    Lox.report = function (line, where, message) {
        console.error("[line " + line + "] Error " + where + ": " + message);
        Lox.hadError = true;
    };
    Lox.hadError = false;
    return Lox;
}());
exports.default = Lox;
//# sourceMappingURL=Lox.js.map