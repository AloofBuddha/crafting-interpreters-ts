"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Scanner = /** @class */ (function () {
    function Scanner(source) {
        this.source = source;
    }
    Scanner.prototype.scanTokens = function () {
        return this.source.split(' ');
    };
    return Scanner;
}());
exports.default = Scanner;
//# sourceMappingURL=Scanner.js.map