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
const fs = __importStar(require("fs"));
const combin = __importStar(require("./combin"));
const parser = __importStar(require("./parser"));
let fileData = fs.readFileSync('data.txt', 'utf-8');
//greate success
console.log('logical parser: ', parser.logicalParser.parse(':  logical ; a = a ^ (a | a) & 1'));
console.log('var parser: ', parser.varParser.parse('vAr x, y, sdf, a: logical;'));
console.log('begin parser: ', parser.beginParser.parse('begin \n a = !a'));
console.log('end parser: ', parser.endParser.parse('a = z ^ g; end'));
let parserIdent = parser.strToStr(/\b((?!begin|var|end)([a-z]+))\b/ig), parserSepar = parser.strToStr(/,/ig), combinIdentSepar = combin.seqAppR(parserIdent, parserSepar);
console.log(combinIdentSepar.parse('asd, asd, asd,'));
