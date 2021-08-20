import * as fs     from 'fs';
import ParseModel, { ParserRes }  from './libs/ParseModel';
import * as combin from './combin';
// import * as parser from './parser';

// let fileData: string = fs.readFileSync('data.txt','utf-8');
// fs.writeFileSync('output.txt', parser.languageParser.parse(fileData).result);
// console.log('code was compiled successfully');

const fileData: string = fs.readFileSync('data.txt','utf-8');

// ParseModel.genTerm.then(value => {
//     console.log(value);
// });

/*
    let varParser = combin.genTerm(/^var\s+/ig)
    .then(value => {
        combin.functor((value) => {
            if value == null return value;
            return {
                result: 'Var',
                input : value.input,
            }
        })
    }).then(value => {
        console.log(value);
    });
*/

const 
    varParser   = combin.genTerm(/^var\s+/ig),
    identParser = combin.genTerm(/^\b((?!begin|var|end)([a-z]+))\b/ig);

const VarParser = combin.functor(varParser, (res: ParserRes | null) => {
    if (res == null) return null;
    return {
        result: 'Var',
        input : res.input,
    }
});
    
// varParser.createPromise('var kek: logical;').then((value: any) => {
//     console.log('1 => \n', value);
//     return identParser.createPromise(value.input);
// }).then(value => {
//     console.log('2 => \n', value);
// });

