import * as fs    from 'fs';
import ParseModel from './libs/ParseModel';
// import * as parser from './parser';

// let fileData: string = fs.readFileSync('data.txt','utf-8');
// fs.writeFileSync('output.txt', parser.languageParser.parse(fileData).result);
// console.log('code was compiled successfully');

const fileData: string = fs.readFileSync('data.txt','utf-8');

// ParseModel.genTerm.then(value => {
//     console.log(value);
// });


ParseModel.functor.then(value => {
    console.log(value);
})

