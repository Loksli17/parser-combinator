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
Object.defineProperty(exports, "__esModule", { value: true });
const combin = __importStar(require("./combin"));
const parser = __importStar(require("./parser"));
//error test
let testError = parser.identParser.parse('asd, sdf, sdf, df');
console.log(testError);
let parserIdentComma = combin.genTerm(/^[a-z]+\s*[,:]/ig), parserComma = combin.genTerm(/^,/ig), parserIdent = combin.genTerm(/^[a-z]+/ig);
console.log(parserIdentComma.parse('asdsad, asdasd, asd, asd:'));
console.log(parser.binaryParser.parse(' | dsf'));
let altSeqTest = combin.altSeq(parserIdent, parserComma);
console.log(altSeqTest.parse('asdasd, adasd, adssad'));
// let parser1 = combin.seqApp(parserIdent, parserComma);
//данный комбинатор использовать с функтором
let seqApp = combin.seqApp(parserIdent, parserComma);
console.log(seqApp.parse('sdfdf, sdfsdf'));
let seqAppL = combin.seqAppL(parserIdent, parserComma);
console.log(seqAppL.parse('asdsad, begin'));
let seqAppR = combin.seqAppR(parserIdent, parserComma);
console.log(seqAppR.parse('asdsad, begin'));
