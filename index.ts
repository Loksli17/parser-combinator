import * as fs     from 'fs';
import * as combin from './combin';
import * as parser from './parser';

let fileData = fs.readFileSync('data.txt','utf-8');

//greate success
console.log('logical parser: ', parser.logicalParser.parse(':  logical ; a = a ^ (a | a) & 1'));
console.log('var parser: ', parser.varParser.parse('vAr x, y, sdf, a: logical;'));
console.log('begin parser: ', parser.beginParser.parse('begin \n a = !a'));
console.log('end parser: ', parser.endParser.parse('a = z ^ g; end'));

let 
    parserIdent      = parser.strToStr(/\b((?!begin|var|end)([a-z]+))\b/ig),
    parserSepar      = parser.strToStr(/,/ig),
    combinIdentSepar = combin.seqAppR(parserIdent, parserSepar);

console.log(combinIdentSepar.parse('asd, asd, asd,'));

