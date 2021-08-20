"use strict";
exports.__esModule = true;
var fs = require("fs");
var combin = require("./combin");
// import * as parser from './parser';
// let fileData: string = fs.readFileSync('data.txt','utf-8');
// fs.writeFileSync('output.txt', parser.languageParser.parse(fileData).result);
// console.log('code was compiled successfully');
var fileData = fs.readFileSync('data.txt', 'utf-8');
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
var varParser = combin.genTerm(/^var\s+/ig), identParser = combin.genTerm(/^\b((?!begin|var|end)([a-z]+))\b/ig);
varParser.createPromise('var kek: logical;').then(function (value) {
    console.log('1 => \n', value);
    return identParser.createPromise(value.input);
}).then(function (value) {
    console.log('2 => \n', value);
});
