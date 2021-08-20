"use strict";
// ! PROMISE CONSTUCTOR?
exports.__esModule = true;
var Parser = /** @class */ (function () {
    function Parser(parse_) {
        this.parserFunction = parse_;
    }
    Parser.prototype.createPromise = function (str_) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.parserFunction(str_).then(function (value) {
                resolve(value);
                reject(new Error('error'));
            });
        });
    };
    return Parser;
}());
exports["default"] = Parser;
