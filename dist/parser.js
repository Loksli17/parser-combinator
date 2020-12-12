"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.varDecParser = exports.logicalParser = exports.strToTerm = exports.strToStr = void 0;
const ParseModel_1 = __importDefault(require("./libs/ParseModel"));
const fs = __importStar(require("fs"));
const combin = __importStar(require("./combin"));
let result, fileData = fs.readFileSync('data.txt', 'utf-8');
let 
//@return Parser string -> Lexem
strToTerm = (reg_, status_) => {
    return new ParseModel_1.default((str_) => {
        let arr = str_.match(reg_);
        return arr == null ? null : {
            result: { lexem: arr[0], type: status_, numStr: 0 },
            input: str_.replace(arr[0], ''),
        };
    });
}, strToStr = (reg_) => {
    return new ParseModel_1.default((str_) => {
        let arr = str_.match(reg_);
        return arr == null ? null : {
            result: arr[0],
            input: str_.replace(arr[0], ''),
        };
    });
}, varParser = combin.monadBind(strToStr(/var/ig), (res_) => {
    return new ParseModel_1.default((input_) => {
        return {
            result: 'Var\n',
            input: input_,
        };
    });
}), logicalParser = combin.monadBind(strToStr(/:\s*logical\s*;/ig), (res_) => {
    return new ParseModel_1.default((input_) => {
        res_ = res_.replace(/\s/g, '');
        if (res_ == null)
            return null;
        let arr = res_.match(/logical/i);
        if (arr == null)
            return null;
        return {
            result: res_.replace(arr[0], ' Boolean'),
            input: input_,
        };
    });
}), varDecParser = new ParseModel_1.default((str_) => {
    //регулярка в logicalParser не забыть про пробелы
    let parserIdent = strToStr(/\b((?!begin|var|end)([a-z]+))\b/ig), parserSepar = strToStr(/([\(\),;]|begin|end)/ig), combinIdentSepar = combin.seqAppR(parserIdent, parserSepar), varListParser = combin.many(combinIdentSepar);
    return combin.seqAppR(varParser, combin.seqAppL(varListParser, logicalParser));
});
exports.strToTerm = strToTerm;
exports.strToStr = strToStr;
exports.logicalParser = logicalParser;
exports.varDecParser = varDecParser;
// console.log(stringToTerminal(/(var)/ig,                           TypeStatus.keyword).parse(fileData));
// console.log(stringToTerminal(/([\(\),;]|begin|end)/ig,            TypeStatus.separator).parse(fileData));
// console.log(stringToTerminal(/[01]/ig,                            TypeStatus.const).parse(fileData));
// console.log(stringToTerminal(/[\|\^\&!]/ig,                       TypeStatus.operator).parse(fileData));
// console.log(stringToTerminal(/\b((?!begin|var|end)([a-z]+))\b/ig, TypeStatus.identifier).parse(fileData));
