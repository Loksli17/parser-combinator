"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.many = exports.seqAppR = exports.seqAppL = exports.seqApp = exports.alternative = exports.fmap = exports.monadBind = exports.pure = exports.empty = void 0;
const ParseModel_1 = __importDefault(require("./libs/ParseModel"));
let empty = () => {
    return new ParseModel_1.default(() => {
        return null;
    });
}, 
//look type in future
pure = (a) => {
    return new ParseModel_1.default((input) => {
        return [a, input];
    });
}, 
//использовать для нетерминалов
//input parser + func 
monadBind = (p_, f_) => {
    return new ParseModel_1.default((input) => {
        let res = p_.parse(input);
        if (res == null)
            return null;
        // console.log('monad-debug:', res);
        let newParser = f_(res.result); //return parser
        return newParser.parse(res.input);
    });
}, 
//<^>
fmap = (f_, p_) => {
    return monadBind(p_, (a) => { console.log('fmap-debug:', a); return pure(f_(a)); });
}, 
//
alternative = (p_, q_) => {
    return new ParseModel_1.default((input) => {
        let res = p_.parse(input);
        if (res == null)
            return q_.parse(input);
        return res;
    });
}, 
// <*>
seqApp = (p_, q_) => {
    return monadBind(p_, (f) => { return fmap(f, q_); });
}, 
// <*
seqAppL = (p_, q_) => {
    return new ParseModel_1.default((input) => {
        let resP = p_.parse(input);
        if (resP == null)
            return null;
        let resQ = q_.parse(resP.result);
        if (resQ == null)
            return null;
        return [resQ.result, resP.input];
    });
}, 
// *>
seqAppR = (p_, q_) => {
    return new ParseModel_1.default((input) => {
        let resP = p_.parse(input);
        if (resP == null)
            return null;
        let resQ = q_.parse(resP.result);
        //я хочу поменять тут null
        if (resQ == null)
            return { result: null, input: resP.result };
        return {
            result: resQ.result,
            input: resQ.input,
        };
    });
}, many = (p_) => {
    return alternative(many1(p_), pure([]));
}, many1 = (p_) => {
    return seqAppL(p_, many(p_));
};
exports.empty = empty;
exports.pure = pure;
exports.monadBind = monadBind;
exports.fmap = fmap;
exports.alternative = alternative;
exports.seqApp = seqApp;
exports.seqAppL = seqAppL;
exports.seqAppR = seqAppR;
exports.many = many;
