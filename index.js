"use strict";
exports.__esModule = true;
var fs = require("fs");
var ParseModel_1 = require("./libs/ParseModel");
// import * as parser from './parser';
// let fileData: string = fs.readFileSync('data.txt','utf-8');
// fs.writeFileSync('output.txt', parser.languageParser.parse(fileData).result);
// console.log('code was compiled successfully');
var fileData = fs.readFileSync('data.txt', 'utf-8');
// ParseModel.genTerm.then(value => {
//     console.log(value);
// });
ParseModel_1["default"].functor.then(function (value) {
    console.log(value);
});
