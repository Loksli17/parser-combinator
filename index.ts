import * as fs     from 'fs';
import * as combin from './combin';
import * as parser from './parser';

let fileData = fs.readFileSync('data.txt','utf-8');

console.log(parser.logicalParser.parse(':  logical ; a = a ^ (a | a) & 1'));

let 
    parserIdent      = parser.strToStr(/\b((?!begin|var|end)([a-z]+))\b/ig),
    parserSepar      = parser.strToStr(/,/ig),
    combinIdentSepar = combin.seqAppR(parserIdent, parserSepar);

console.log(combinIdentSepar.parse('asd, asd, asd,'));

