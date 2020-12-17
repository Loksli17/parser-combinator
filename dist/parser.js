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
exports.varDecParser = exports.varListParser = exports.binaryParser = exports.identParser = exports.unaryParser = exports.equalParser = exports.endParser = exports.beginParser = exports.logicalParser = exports.varParser = exports.strToEqualStr = exports.strToTerm = exports.strToStr = void 0;
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
        str_ = str_.replace(/^\s*/, '');
        let arr = str_.match(reg_);
        return arr == null ? null : {
            result: arr[0],
            input: str_.replace(arr[0], ''),
        };
    });
}, strToEqualStr = (reg_) => {
    return new ParseModel_1.default((str_) => {
        let arr = str_.match(reg_), bool;
        if (arr == null)
            return null;
        bool = arr[0] == str_;
        return !bool ? null : {
            result: str_,
            input: '',
        };
    });
}, varParser = combin.monadBind(strToStr(/^var\s+/ig), (res_) => {
    return new ParseModel_1.default((input_) => {
        return {
            result: 'Var\n',
            input: input_,
        };
    });
}), logicalParser = combin.monadBind(strToStr(/^:\s*logical\s*;/ig), (res_) => {
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
}), beginParser = combin.monadBind(strToStr(/^begin/ig), (res_) => {
    return new ParseModel_1.default((input_) => {
        if (res_ == null)
            return null;
        return {
            result: 'Begin',
            input: input_,
        };
    });
}), endParser = combin.monadBind(strToStr(/^end/ig), (res_) => {
    return new ParseModel_1.default((input_) => {
        if (res_ == null)
            return null;
        return {
            result: 'End',
            input: input_,
        };
    });
}), equalParser = combin.monadBind(strToStr(/^:=/ig), (res_) => {
    return new ParseModel_1.default((input_) => {
        if (res_ == null)
            return null;
        return {
            result: '=',
            input: input_,
        };
    });
}), unaryParser = strToStr(/^!/ig), binaryParser = combin.monadBind(strToStr(/^[\|\^\&]/ig), (res_) => {
    return new ParseModel_1.default((input_) => {
        let result = '';
        if (res_ == null)
            return null;
        switch (res_) {
            case '|':
                result = 'OR';
                break;
            case '^':
                result = 'XOR';
                break;
            case '&':
                result = 'AND';
                break;
        }
        return {
            result: result,
            input: input_,
        };
    });
}), identParser = strToStr(/^\b((?!begin|var|end)([a-z]+))\b/ig), varListParser = new ParseModel_1.default((str_) => {
    let parserIdent = combin.alternative(identParser, combin.empty()), parserSepar = combin.alternative(strToStr(/^,:/ig), combin.empty());
    console.log('varList', str_ = parserIdent.parse(str_).input);
    console.log('varList', parserSepar.parse(str_));
}), varDecParser = new ParseModel_1.default((str_) => {
    let parserIdent = strToStr(/\b((?!begin|var|end)([a-z]+))\b/ig), parserSepar = strToStr(/([\(\),;]|begin|end)/ig), combinIdentSepar = combin.seqAppR(parserIdent, parserSepar), varListParser = combin.many(combinIdentSepar);
    return combin.seqAppR(varParser, combin.seqAppL(varListParser, logicalParser));
});
exports.strToTerm = strToTerm;
exports.strToStr = strToStr;
exports.strToEqualStr = strToEqualStr;
exports.varParser = varParser;
exports.logicalParser = logicalParser;
exports.beginParser = beginParser;
exports.endParser = endParser;
exports.equalParser = equalParser;
exports.unaryParser = unaryParser;
exports.binaryParser = binaryParser;
exports.identParser = identParser;
exports.varListParser = varListParser;
exports.varDecParser = varDecParser;
// console.log(stringToTerminal(/(var)/ig,                           TypeStatus.keyword).parse(fileData));
// console.log(stringToTerminal(/([\(\),;]|begin|end)/ig,            TypeStatus.separator).parse(fileData));
// console.log(stringToTerminal(/[01]/ig,                            TypeStatus.const).parse(fileData));
// console.log(stringToTerminal(/[\|\^\&!]/ig,                       TypeStatus.operator).parse(fileData));
// console.log(stringToTerminal(/\b((?!begin|var|end)([a-z]+))\b/ig, TypeStatus.identifier).parse(fileData));
