"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.oneOrMany = exports.seqAppR = exports.seqAppL = exports.seqApp = exports.altSeq = exports.functor = exports.monadBind = exports.error = exports.genTerm = void 0;
const ParseModel_1 = __importDefault(require("./libs/ParseModel"));
let 
//@return Parser: string -> [term, other string]
genTerm = (reg_) => {
    return new ParseModel_1.default((str_) => {
        str_ = str_.replace(/^\s*/, ''); //trum many spaces
        let arr = str_.match(reg_);
        return arr == null ? null : {
            result: arr[0],
            input: str_.replace(arr[0], ''),
        };
    });
}, 
//парсер который будет возвращать ошибку
error = (message_) => {
    return new ParseModel_1.default((a) => {
        throw new Error(message_);
    });
}, 
//_>> @return Parser: [Parser A, function] -> new Parser 
monadBind = (a_, f_) => {
    return new ParseModel_1.default((input) => {
        let res = a_.parse(input);
        if (res == null)
            return null;
        let newParser = f_(res.result); //return parser
        return newParser.parse(res.input);
    });
}, 
//<^>
functor = (a_, f_) => {
    return new ParseModel_1.default((str_) => {
        let res = a_.parse(str_);
        if (res == null)
            return null;
        return f_(res);
    });
}, 
//<|>
altSeq = (a_, b_) => {
    return new ParseModel_1.default((str_) => {
        let resA = a_.parse(str_);
        if (resA == null) {
            let resB = b_.parse(str_);
            resB == null ? null : resB;
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
        let resB = b_.parse(resA.input);
        if (resB == null)
            return null;
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
exports.error = error;
exports.monadBind = monadBind;
exports.functor = functor;
exports.altSeq = altSeq;
exports.seqApp = seqApp;
exports.seqAppL = seqAppL;
exports.seqAppR = seqAppR;
exports.oneOrMany = oneOrMany;
