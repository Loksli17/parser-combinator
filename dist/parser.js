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
exports.identParser = exports.binaryParser = exports.unaryParser = exports.equalParser = exports.endParser = exports.beginParser = exports.identListParser = exports.logicalParser = exports.varParser = void 0;
const ParseModel_1 = __importDefault(require("./libs/ParseModel"));
const fs = __importStar(require("fs"));
const combin = __importStar(require("./combin"));
let result, fileData = fs.readFileSync('data.txt', 'utf-8');
let varParser = combin.monadBind(combin.genTerm(/^var\s+/ig), (res_) => {
    return new ParseModel_1.default((input_) => {
        return {
            result: 'Var\n',
            input: input_,
        };
    });
}), logicalParser = combin.monadBind(combin.genTerm(/^logical\s*;/ig), (res_) => {
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
}), beginParser = combin.monadBind(combin.genTerm(/^begin/ig), (res_) => {
    return new ParseModel_1.default((input_) => {
        if (res_ == null)
            return null;
        return {
            result: 'Begin',
            input: input_,
        };
    });
}), endParser = combin.monadBind(combin.genTerm(/^end/ig), (res_) => {
    return new ParseModel_1.default((input_) => {
        if (res_ == null)
            return null;
        return {
            result: 'End',
            input: input_,
        };
    });
}), equalParser = combin.monadBind(combin.genTerm(/^:=/ig), (res_) => {
    return new ParseModel_1.default((input_) => {
        if (res_ == null)
            return null;
        return {
            result: '=',
            input: input_,
        };
    });
}), unaryParser = combin.genTerm(/^!/ig), binaryParser = combin.monadBind(combin.genTerm(/^[\|\^\&]/ig), (res_) => {
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
}), 
//накинуть сверху вывод ошибки
identParser = combin.altSeq(combin.genTerm(/^\b((?!begin|var|end)([a-z]+))\b/ig), combin.error(`expected identifier`)), commaParser = combin.genTerm(/^,/ig), colonParser = combin.genTerm(/^:/ig), identListParser = new ParseModel_1.default((str_) => {
    // // let 
    // //     identCommaParser = combin.seqApp(identParser, commaParser, (resL_: combin.genTermRes, resR_: combin.genTermRes) => {
    // //         return {
    // //             result: `${resL_.result}${resR_.result}`,
    // //             input : resR_.input, 
    // //         }
    // //     }),
    // //     identColonParser = combin.seqApp(identParser, colonParser, (resL_: combin.genTermRes, resR_: combin.genTermRes) => {
    // //         return {
    // //             result: `${resL_.result}${resR_.result}`,
    // //             input : resR_.input, 
    // //         }
    // //     }),
    // //     identCommaListParser = combin.repeat(identCommaParser, '');
    // console.log(identCommaListParser.parse(str_));
});
exports.varParser = varParser;
exports.logicalParser = logicalParser;
exports.beginParser = beginParser;
exports.endParser = endParser;
exports.equalParser = equalParser;
exports.unaryParser = unaryParser;
exports.binaryParser = binaryParser;
exports.identParser = identParser;
exports.identListParser = identListParser;
// console.log(stringToTerminal(/(var)/ig,                           TypeStatus.keyword).parse(fileData));
// console.log(stringToTerminal(/([\(\),;]|begin|end)/ig,            TypeStatus.separator).parse(fileData));
// console.log(stringToTerminal(/[01]/ig,                            TypeStatus.const).parse(fileData));
// console.log(stringToTerminal(/[\|\^\&!]/ig,                       TypeStatus.operator).parse(fileData));
// console.log(stringToTerminal(/\b((?!begin|var|end)([a-z]+))\b/ig, TypeStatus.identifier).parse(fileData));
