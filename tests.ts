import TypeStatus  from './libs/typeStatus';
import * as fs     from 'fs';
import Parser      from './libs/ParseModel';
import * as combin from './combin';
import * as parser from './parser';

//error test
let testError = parser.identParser.parse('asd, sdf, sdf, df');
console.log(testError);


let
    parserIdentComma = combin.genTerm(/^[a-z]+\s*[,:]/ig),
    parserComma      = combin.genTerm(/^,/ig),
    parserIdent      = combin.genTerm(/^[a-z]+/ig);

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

let manyParser = combin.oneOrMany(seqApp);
console.log(manyParser.parse('sdasd, asdasd aasd: logical;'));





    



