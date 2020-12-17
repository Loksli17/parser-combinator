import TypeStatus  from './libs/typeStatus';
import * as fs     from 'fs';
import Parser      from './libs/ParseModel';
import * as combin from './combin';
import * as parser from './parser';

let
    parserIdentComma = combin.genTerm(/^[a-z]+\s*[,:]/ig),
    parserComma      = combin.genTerm(/^,/ig),
    parserIdent      = combin.genTerm(/^[a-z]+/ig);

console.log(parserIdentComma.parse('asdsad, asdasd, asd, asd:'));
console.log(parser.binaryParser.parse(' | dsf'));


let altSeqTest = combin.altSeq(parserIdent, parserComma);
console.log(altSeqTest.parse('asdasd, adasd, adssad'));
// let parser1 = combin.seqApp(parserIdent, parserComma);

let identListParserTest = parser.identListParser.parse('asd, kke erre, sdfe:');





    



