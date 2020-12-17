import * as fs     from 'fs';
import * as combin from './combin';
import * as parser from './parser';

let fileData = fs.readFileSync('data.txt','utf-8');

// console.log('logical parser: ', parser.logicalParser.parse(':  logical ; a = a ^ (a | a) & 1'));
// console.log('var parser: ', parser.varParser.parse(' vAr y, sdf, a: logical;'));
// console.log('begin parser: ', parser.beginParser.parse('   begin \n a = !a'));
// console.log('end parser: ', parser.endParser.parse(' end'));

// console.log('var list parser: ', parser.varListParser.parse('kek, lol, dfsdf :logical;'));

