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
exports.expressionParser = exports.varDecParser = exports.operandParser = exports.identParser = exports.binaryParser = exports.unaryParser = exports.equalParser = exports.endParser = exports.beginParser = exports.identListParser = exports.logicalParser = exports.varParser = void 0;
const ParseModel_1 = __importDefault(require("./libs/ParseModel"));
const fs = __importStar(require("fs"));
const combin = __importStar(require("./combin"));
let result, fileData = fs.readFileSync('data.txt', 'utf-8');
//подумать про ошибки в каждом из парсеров!!!!!!!!!!!!!!!!!!
let varParser = combin.functor(combin.genTerm(/^var\s+/ig), (res_) => {
    return {
        result: 'Var',
        input: res_.input,
    };
}), equalParser = combin.functor(combin.genTerm(/^:=/ig), (res_) => {
    return {
        result: '=',
        input: res_.input,
    };
}), unaryParser = combin.functor(combin.genTerm(/^!/ig), (res_) => {
    return {
        result: '.NOT.',
        input: res_.input,
    };
}), binaryParser = combin.functor(combin.genTerm(/^[\|\^\&]/ig), (res_) => {
    let result = '';
    switch (res_.result) {
        case '|':
            result = '.OR.';
            break;
        case '^':
            result = '.XOR.';
            break;
        case '&':
            result = '.AND.';
            break;
    }
    return {
        result: result,
        input: res_.input,
    };
}), 
//накинуть сверху вывод ошибки
identParser = combin.genTerm(/^\b((?!begin|var|end)([a-z]+))\b/ig), commaParser = combin.genTerm(/^,/ig), colonParser = combin.genTerm(/^:/ig), semicolonParser = combin.genTerm(/^;/ig), constParser = combin.genTerm(/^[10]/ig), beginParser = combin.functor(combin.genTerm(/^begin/ig), (res_) => {
    return {
        result: 'Begin',
        input: res_.input,
    };
}), endParser = combin.functor(combin.genTerm(/^end/ig), (res_) => {
    return {
        result: 'End',
        input: res_.input,
    };
}), logicalParser = combin.functor(combin.seqApp(combin.genTerm(/^logical/ig), semicolonParser), (res) => {
    if (res.result.length != 2)
        return null; //normal error here
    return {
        result: `Boolean;`,
        input: res.input,
    };
}), 
//спросить (don't forget about functor)
identListParser = new ParseModel_1.default((str_) => {
    let identColonParser = combin.functor(combin.seqApp(identParser, colonParser), (res) => {
        if (res.result.length != 2)
            return null; //i need in normal error here
        return {
            result: `${res.result[0]}${res.result[1]}`,
            input: res.input,
        };
    }), identCommaParser = combin.functor(combin.seqApp(identParser, commaParser), (res) => {
        if (res.result.length != 2)
            return null; //i need in normal error here
        return {
            result: `${res.result[0]}${res.result[1]}`,
            input: res.input,
        };
    }), listIdentCommaParser = combin.functor(combin.oneOrMany(identCommaParser), (res) => {
        //проверка на null
        let valueLanguage = '';
        for (let i = 0; i < res.result.length; i++) {
            valueLanguage += res.result[i] + ' ';
        }
        return {
            result: valueLanguage,
            input: res.input,
        };
    }), listIdentCommaColonParser = combin.functor(combin.seqApp(listIdentCommaParser, identColonParser), (res) => {
        if (res.result.length != 2)
            return null; //i need in normal error here
        return {
            result: `${res.result[0]}${res.result[1]}`,
            input: res.input,
        };
    }), resultParser = combin.seqAlt(identColonParser, listIdentCommaColonParser);
    console.log('\nlistParserTests:');
    console.log(resultParser.parse('   asd  , afd, fd:')); //good output
    console.log(resultParser.parse(' fd  :')); //good output
    console.log(resultParser.parse('asd, fd:')); //good output
    console.log(resultParser.parse('asd, , fd:')); //null output
    console.log(resultParser.parse('asd fd:')); //null output
    console.log(resultParser.parse('fd')); //null output
    console.log(resultParser.parse(':')); //null output
    console.log('end list');
    return resultParser.parse(str_);
}), varDecParser = new ParseModel_1.default((str_) => {
    let parser1 = combin.functor(combin.seqApp(varParser, identListParser), (res) => {
        if (res.result.length != 2)
            return null; //i need in normal error here
        return {
            result: `${res.result[0]} ${res.result[1]}`,
            input: res.input,
        };
    }), resultParser = combin.functor(combin.seqApp(parser1, logicalParser), (res) => {
        if (res.result.length != 2)
            return null; //i need in normal error here
        return {
            result: `${res.result[0]} ${res.result[1]}`,
            input: res.input,
        };
    });
    return resultParser.parse(str_);
}), operandParser = new ParseModel_1.default((str_) => {
    return combin.seqAlt(identParser, constParser).parse(str_);
}), expressionParser = new ParseModel_1.default((str_) => {
    let unaryUndExrpParser = combin.functor(combin.seqApp(unaryParser, underExpressionParser), (res) => {
        return {
            result: `${res.result[0]} ${res.result[1]}`,
            input: '',
        };
    }), resultParser = combin.seqAlt(unaryUndExrpParser, underExpressionParser);
    return resultParser.parse(str_);
}), underExpressionParser = new ParseModel_1.default((str_) => {
    return {
        result: '(a ^ b) & (a | c)',
        input: ';',
    };
});
exports.varParser = varParser;
exports.equalParser = equalParser;
exports.unaryParser = unaryParser;
exports.binaryParser = binaryParser;
exports.identParser = identParser;
exports.beginParser = beginParser;
exports.endParser = endParser;
exports.logicalParser = logicalParser;
exports.identListParser = identListParser;
exports.varDecParser = varDecParser;
exports.operandParser = operandParser;
exports.expressionParser = expressionParser;
// console.log(stringToTerminal(/(var)/ig,                           TypeStatus.keyword).parse(fileData));
// console.log(stringToTerminal(/([\(\),;]|begin|end)/ig,            TypeStatus.separator).parse(fileData));
// console.log(stringToTerminal(/[01]/ig,                            TypeStatus.const).parse(fileData));
// console.log(stringToTerminal(/[\|\^\&!]/ig,                       TypeStatus.operator).parse(fileData));
// console.log(stringToTerminal(/\b((?!begin|var|end)([a-z]+))\b/ig, TypeStatus.identifier).parse(fileData));
