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
            rl.prompt();
        });
    };
    Lox.run = function (source) {
        console.log('running Lox on input:', source);
        var scanner = new Scanner_1.default(source);
        var tokens = scanner.scanTokens();
        for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
            var token = tokens_1[_i];
            console.log(token);
        }
    };
    return Lox;
}());
exports.default = Lox;
//# sourceMappingURL=Lox.js.map