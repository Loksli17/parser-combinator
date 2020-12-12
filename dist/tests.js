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
const ParseModel_1 = __importDefault(require("./libs/ParseModel"));
const combin = __importStar(require("./combin"));
const parser = __importStar(require("./parser"));
//test parser strToString with two parsers
let separParser = parser.strToStr(/[,;]/ig), identParser = parser.strToStr(/\b((?!begin|var|end)([a-z]+))\b/ig), res = identParser.parse('x, y, z');
console.log('strToParse: ', res);
console.log('strToParse: ', separParser.parse(res.input));
//test empty sipmle function which return NULL
let emptyParser = combin.empty();
res = emptyParser.parse();
console.log('empty: ', res);
//test pure поиспользовать еще
let a = 7, b = 2;
let pureParser = combin.pure(a + b);
res = pureParser.parse(3);
console.log('pure: ', res);
// console.log('pure-use: ', res[0].parse(res[1]));
//monadBind
let parser1 = parser.strToStr(/:/ig), monadBindParser = combin.monadBind(parser1, (resLeft_) => {
    return new ParseModel_1.default((str_) => {
        let arr = str_.match(/logical/ig);
        if (arr == null)
            return null;
        return {
            result: arr[0],
            input: str_.replace(arr[0], ''),
        };
    });
});
res = monadBindParser.parse(':logical;');
console.log('monadBind: ', res);
//test fmap ->  не понятно зачем
let 
//fmap поделать еще что-то
//для logical возвращать кортеж со списком вместо списка кортежей
fmap = combin.fmap((arr) => {
    console.log(arr
    // arr[0].result,
    // arr[1].result,
    // arr[1].input,
    );
}, monadBindParser);
console.log('fmap: ', fmap.parse(':logical;'));
let alternativeParser = combin.alternative(separParser, identParser);
res = alternativeParser.parse("kek = 1");
console.log('alternative: ', res);
//test seqAppL
let lexSeparParser = parser.strToStr(/[a-z]+[,;]/), seqLParser = combin.seqAppL(lexSeparParser, separParser);
res = seqLParser.parse('x, y, z');
console.log('seqL: ', res);
//test seqAppR
let lexSeparParser1 = parser.strToStr(/([a-z]+,|[a-z]+|,)/ig), seqRParser = combin.seqAppR(lexSeparParser1, separParser);
res = seqRParser.parse('x, y, z');
console.log('seqR', res);
res = lexSeparParser1.parse('xAr, ytt, zer');
console.log('lexSeparParse', res);
res.input = 'asd, asd asd, asd, asd, ,';
do {
    res = parser.strToStr(/([a-z]+\s*,)/ig).parse(res.input);
    console.log(res);
} while (res != null);
//test many
// let
//     manyParser = combin.many(parser.strToStr(/[a-z]+/ig));
// console.log(manyParser.parse('zasd zsd sda dsd'));
