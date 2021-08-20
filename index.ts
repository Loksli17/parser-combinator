import * as fs     from 'fs';
import * as parser from './parser';

let fileData: string = fs.readFileSync('assets/input.txt','utf-8');
fs.writeFileSync('assets/output.txt', parser.languageParser.parse(fileData).result);

console.log('code was compiled successfully');

