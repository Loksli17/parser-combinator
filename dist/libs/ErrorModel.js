"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ErrorModel {
    constructor(mes_, term_, input_) {
        this.message = mes_;
        this.term = term_;
        this.input = input_;
    }
    callError(fullText) {
        console.log(`Error: ${this.message} before ${fullText.replace(this.input, '')}`);
        process.exit(0);
    }
}
exports.default = ErrorModel;
