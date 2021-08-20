"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.oneOrMany = exports.seqAppR = exports.seqAppL = exports.seqApp = exports.seqAlt = exports.functor = exports.monadBind = exports.genTerm = void 0;
const ErrorModel_1 = __importDefault(require("./ErrorModel"));
const ParseModel_1 = __importDefault(require("./ParseModel"));
let 
//@return Parser: string -> [term, other string]
genTerm = (reg_) => {
    return new ParseModel_1.default((input_) => {
        input_ = input_.replace(/^\s*/, ''); //trum many spaces
        let arr = input_.match(reg_);
        return arr == null ? null : {
            result: arr[0],
            input: input_.replace(arr[0], ''),
        };
    });
}, 
//_>> @return Parser: [Parser A, function] -> new Parser 
monadBind = (a_, f_) => {
    return new ParseModel_1.default((input_) => {
        let res = a_.parse(input_);
        if (res == null)
            return f_(null).parse(input_);
        let newParser = f_(res.result); //return parser
        return newParser.parse(res.input);
    });
}, 
//<^> @return Parser: [Parser, Function] -> new Parser
functor = (a_, f_) => {
    return new ParseModel_1.default((input_) => {
        let res = a_.parse(input_);
        if (res == null)
            return null;
        return f_(res);
    });
}, 
//<|>
seqAlt = (a_, b_) => {
    return new ParseModel_1.default((str_) => {
        let resA = a_.parse(str_);
        if (resA == null) {
            let resB = b_.parse(str_);
            return resB == null ? null : resB;
        }
        ;
        return resA;
    });
}, 
//<*> @return Parser: [parser A, Parser B] -> func
seqApp = (a_, b_) => {
    return new ParseModel_1.default((str_) => {
        let resA = a_.parse(str_);
        if (resA == null)
            return null;
        if (resA instanceof ErrorModel_1.default)
            return new ErrorModel_1.default(resA.message, resA.term, resA.input);
        let resB = b_.parse(resA.input);
        if (resB == null)
            return null;
        if (resB instanceof ErrorModel_1.default)
            return new ErrorModel_1.default(resB.message, resB.term, resB.input);
        return {
            result: [
                resA.result,
                resB.result,
            ],
            input: resB.input,
        };
    });
}, 
//<*
seqAppL = (a_, b_) => {
    return functor(seqApp(a_, b_), (res) => {
        return {
            result: res.result[0],
            input: res.input,
        };
    });
}, 
//*>
seqAppR = (a_, b_) => {
    return functor(seqApp(a_, b_), (res) => {
        return {
            result: res.result[1],
            input: res.input,
        };
    });
}, oneOrMany = (a_) => {
    return new ParseModel_1.default((str_) => {
        let tempInput = '', resA = a_.parse(str_), res = [];
        if (resA == null)
            return null;
        res.push(resA.result);
        tempInput = resA.input;
        while (true) {
            resA = a_.parse(resA.input);
            if (resA == null)
                break;
            tempInput = resA.input;
            res.push(resA.result);
        }
        return {
            result: res,
            input: tempInput,
        };
    });
};
exports.genTerm = genTerm;
exports.monadBind = monadBind;
exports.functor = functor;
exports.seqAlt = seqAlt;
exports.seqApp = seqApp;
exports.seqAppL = seqAppL;
exports.seqAppR = seqAppR;
exports.oneOrMany = oneOrMany;
