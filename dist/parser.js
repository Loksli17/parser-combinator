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
exports.languageParser = exports.assignmentListParser = exports.assignmentParser = exports.expressionParser = exports.varDecParser = exports.operandParser = exports.identParser = exports.binaryParser = exports.unaryParser = exports.equalParser = exports.endParser = exports.beginParser = exports.identListParser = exports.logicalParser = exports.varParser = void 0;
const ParseModel_1 = __importDefault(require("./libs/ParseModel"));
const ErrorModel_1 = __importDefault(require("./libs/ErrorModel"));
const combin = __importStar(require("./combin"));
let varParser = combin.functor(combin.genTerm(/^var\s+/ig), (res_) => {
    if (res_ == null)
        return null;
    return {
        result: 'Var',
        input: res_.input,
    };
}), varParserErr = combin.monadBind(varParser, (res_) => {
    return new ParseModel_1.default((input_) => {
        return res_ == null ? new ErrorModel_1.default('unexpected symbol, expected var', 'var', input_) : { result: res_, input: input_ };
    });
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
identParser = combin.functor(combin.genTerm(/^\b((?!begin|var|end)([a-z]+))\b/ig), (res_) => {
    return res_;
}), commaParser = combin.genTerm(/^,/ig), colonParser = combin.genTerm(/^:/ig), semicolonParser = combin.genTerm(/^;/ig), constParser = combin.genTerm(/^[10]/ig), beginParser = combin.functor(combin.genTerm(/^begin/ig), (res_) => {
    return {
        result: 'Begin',
        input: res_.input,
    };
}), beginParserErr = combin.monadBind(beginParser, (res_) => {
    return new ParseModel_1.default((input_) => {
        return res_ == null ? new ErrorModel_1.default('unexpected symbol, expected var', 'var', input_) : { result: res_, input: input_ };
    });
}), endParser = combin.functor(combin.genTerm(/^end/ig), (res_) => {
    return {
        result: 'End',
        input: res_.input,
    };
}), logicalParser = combin.functor(combin.seqApp(combin.genTerm(/^logical/ig), semicolonParser), (res_) => {
    if (res_.result.length != 2)
        return null; //normal error here
    return {
        result: `Boolean;`,
        input: res_.input,
    };
}), identListParser = new ParseModel_1.default((str_) => {
    let identColonParser = combin.functor(combin.seqApp(identParser, colonParser), (res_) => {
        if (res_.result.length != 2)
            return null; //i need in normal error here
        return {
            result: `${res_.result[0]}${res_.result[1]}`,
            input: res_.input,
        };
    }), identCommaParser = combin.functor(combin.seqApp(identParser, commaParser), (res_) => {
        if (res_.result.length != 2)
            return null; //i need in normal error here
        return {
            result: `${res_.result[0]}${res_.result[1]}`,
            input: res_.input,
        };
    }), listIdentCommaParser = combin.functor(combin.oneOrMany(identCommaParser), (res_) => {
        //проверка на null
        let valueLanguage = '';
        for (let i = 0; i < res_.result.length; i++) {
            valueLanguage += res_.result[i] + ' ';
        }
        return {
            result: valueLanguage,
            input: res_.input,
        };
    }), listIdentCommaColonParser = combin.functor(combin.seqApp(listIdentCommaParser, identColonParser), (res_) => {
        if (res_.result.length != 2)
            return null; //i need in normal error here
        return {
            result: `${res_.result[0]}${res_.result[1]}`,
            input: res_.input,
        };
    }), resultParser = combin.seqAlt(identColonParser, listIdentCommaColonParser);
    return resultParser.parse(str_);
}), varDecParser = new ParseModel_1.default((str_) => {
    let parser1 = combin.functor(combin.seqApp(varParserErr, identListParser), (res_) => {
        if (res_ instanceof ErrorModel_1.default)
            return res_;
        if (res_.result.length != 2)
            return null;
        return {
            result: `${res_.result[0]} ${res_.result[1]}`,
            input: res_.input,
        };
    }), resultParser = combin.functor(combin.seqApp(parser1, logicalParser), (res_) => {
        if (res_ instanceof ErrorModel_1.default)
            return res_;
        if (res_.result.length != 2)
            return null;
        return {
            result: `${res_.result[0]} ${res_.result[1]}`,
            input: res_.input,
        };
    });
    let result = resultParser.parse(str_);
    if (result instanceof ErrorModel_1.default)
        result.callError(str_);
    return result;
}), operandParser = new ParseModel_1.default((str_) => {
    return combin.seqAlt(identParser, constParser).parse(str_);
}), unaryOperandParser = new ParseModel_1.default((str_) => {
    let unrOperParser = combin.functor(combin.seqApp(unaryParser, operandParser), (res_) => {
        return {
            result: `${res_.result[0]} ${res_.result[1]}`,
            input: res_.input,
        };
    }), resultParser = combin.seqAlt(unrOperParser, operandParser);
    return resultParser.parse(str_);
}), expressionParser = new ParseModel_1.default((str_) => {
    let exprParser = combin.functor(combin.seqAppL(combin.functor(combin.seqAppR(combin.genTerm(/^\(/ig), expressionParser), (res_) => {
        return {
            result: `(${res_.result}`,
            input: res_.input,
        };
    }), combin.genTerm(/^\)/ig)), (res_) => {
        return {
            result: `${res_.result})`,
            input: res_.input,
        };
    }), undExprParser = combin.functor(combin.seqApp(combin.functor(combin.seqApp(combin.seqAlt(exprParser, unaryOperandParser), binaryParser), (res_) => {
        return {
            result: `${res_.result[0]} ${res_.result[1]}`,
            input: res_.input,
        };
    }), combin.seqAlt(combin.seqAlt(exprParser, expressionParser), unaryOperandParser)), (res_) => {
        return {
            result: `${res_.result[0]} ${res_.result[1]}`,
            input: res_.input,
        };
    });
    return combin.seqAlt(combin.seqAlt(undExprParser, exprParser), unaryOperandParser).parse(str_);
}), assignmentParser = new ParseModel_1.default((str_) => {
    let parserResult = combin.functor(combin.seqApp(combin.functor(combin.seqApp(combin.functor(combin.seqApp(identParser, equalParser), (res_) => {
        return {
            result: `${res_.result[0]} ${res_.result[1]}`,
            input: res_.input,
        };
    }), expressionParser), (res_) => {
        return {
            result: `${res_.result[0]} ${res_.result[1]}`,
            input: res_.input,
        };
    }), semicolonParser), (res_) => {
        return {
            result: `${res_.result[0]}${res_.result[1]}`,
            input: res_.input,
        };
    });
    return parserResult.parse(str_);
}), assignmentListParser = new ParseModel_1.default((str_) => {
    let listParser = combin.functor(combin.oneOrMany(assignmentParser), (res_) => {
        //проверка на null
        let valueLanguage = '';
        for (let i = 0; i < res_.result.length; i++) {
            valueLanguage += '\t' + res_.result[i];
            if (i != res_.result.length - 1)
                valueLanguage += '\n';
        }
        return {
            result: valueLanguage,
            input: res_.input,
        };
    });
    return listParser.parse(str_);
}), languageParser = new ParseModel_1.default((str_) => {
    let resultParser = combin.functor(combin.seqApp(combin.functor(combin.seqApp(combin.functor(combin.seqApp(varDecParser, beginParserErr), (res_) => {
        return {
            result: `${res_.result[0]} \n ${res_.result[1]}`,
            input: res_.input,
        };
    }), assignmentListParser), (res_) => {
        return {
            result: `${res_.result[0]} \n ${res_.result[1]}`,
            input: res_.input,
        };
    }), endParser), (res_) => {
        return {
            result: `${res_.result[0]} \n ${res_.result[1]}`,
            input: res_.input,
        };
    });
    return resultParser.parse(str_);
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
exports.assignmentParser = assignmentParser;
exports.assignmentListParser = assignmentListParser;
exports.languageParser = languageParser;
// console.log(stringToTerminal(/(var)/ig,                           TypeStatus.keyword).parse(fileData));
// console.log(stringToTerminal(/([\(\),;]|begin|end)/ig,            TypeStatus.separator).parse(fileData));
// console.log(stringToTerminal(/[01]/ig,                            TypeStatus.const).parse(fileData));
// console.log(stringToTerminal(/[\|\^\&!]/ig,                       TypeStatus.operator).parse(fileData));
// console.log(stringToTerminal(/\b((?!begin|var|end)([a-z]+))\b/ig, TypeStatus.identifier).parse(fileData));
