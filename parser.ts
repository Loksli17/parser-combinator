import TypeStatus  from './libs/typeStatus';
import Lexem       from './libs/lexem';
import Parser      from './libs/ParseModel';
import * as fs     from 'fs';
import * as combin from './combin';

let
    result  : string,
    fileData: string = fs.readFileSync('data.txt', 'utf-8');

let 
     varParser = combin.monadBind(combin.genTerm(/^var\s+/ig), (res_: string): Parser => {
        return new Parser((input_: string): object | null => {
            return {
                result: 'Var\n',
                input : input_, 
            }
        });
    }),

    logicalParser = combin.monadBind(combin.genTerm(/^logical\s*;/ig), (res_: string): Parser => {
        return new Parser((input_: string): object | null => {
            res_ = res_.replace(/\s/g, '');
            if(res_ == null) return null;

            let arr: RegExpMatchArray | null = res_.match(/logical/i);
            if(arr == null) return null;

            return{
                result: res_.replace(arr[0], ' Boolean'),
                input:  input_,
            }
        });
    }),

    beginParser = combin.monadBind(combin.genTerm(/^begin/ig), (res_: string): Parser => {
        return new Parser((input_: string): object | null => {

            if(res_ == null) return null;

            return {
                result: 'Begin',
                input : input_, 
            }
        });
    }),

    endParser = combin.monadBind(combin.genTerm(/^end/ig), (res_: string): Parser => {
        return new Parser((input_: string): object | null => {

            if(res_ == null) return null;

            return {
                result: 'End',
                input : input_, 
            }
        });
    }),

    equalParser = combin.monadBind(combin.genTerm(/^:=/ig), (res_: string): Parser => {
        return new Parser((input_: string): object | null => {

            if(res_ == null) return null;

            return {
                result: '=',
                input : input_,
            }
        });
    }),

    unaryParser = combin.genTerm(/^!/ig),

    binaryParser = combin.monadBind(combin.genTerm(/^[\|\^\&]/ig), (res_: string): Parser => {
        return new Parser((input_: string) => {

            let result: string = '';

            if(res_ == null) return null;

            switch(res_){
                case '|':
                    result = 'OR';
                    break;
                case '^':
                    result = 'XOR';
                    break;
                case '&':
                    result = 'AND';
                    break;
            }

            return{
                result: result,
                input : input_,
            }
        });
    }),

    //накинуть сверху вывод ошибки
    identParser = combin.genTerm(/^\b((?!begin|var|end)([a-z]+))\b/ig),

    commaParser = combin.genTerm(/^,/ig),

    colonParser = combin.genTerm(/^:/ig),

    //спросить (don't forget about functor)
    identListParser = new Parser((str_: string): combin.parserRes => {
        let
            commaColonParser: Parser = combin.seqAlt(commaParser, colonParser),
            identSeparParser: Parser = combin.functor(
                combin.seqApp(identParser, commaColonParser),
                (res: combin.parserRes) => {
                    if(res.result.length != 2) return null; //i need in normal error here
                    return {
                        result: `${res.result[0]}${res.result[1]}`,
                        input : res.input,
                    };
                },
            ), 
            listParser      : Parser = combin.oneOrMany(identSeparParser),
            valueLanguage   : string = '';

        console.log('listParserTests: \n');
        console.log(listParser.parse('asd, afd, fd:')); //good output
        console.log(listParser.parse('dfsdf, , , , :')); //ошибку в такой ситуации можно выкинуть выше

        return {
            result: 'asd, afd, fd:',
            input : ' logical;',
        }
    });
 

export {
    varParser,
    logicalParser,
    identListParser,

    beginParser,
    endParser,
    
    equalParser,

    unaryParser,
    binaryParser,

    identParser, 
};


// console.log(stringToTerminal(/(var)/ig,                           TypeStatus.keyword).parse(fileData));
// console.log(stringToTerminal(/([\(\),;]|begin|end)/ig,            TypeStatus.separator).parse(fileData));
// console.log(stringToTerminal(/[01]/ig,                            TypeStatus.const).parse(fileData));
// console.log(stringToTerminal(/[\|\^\&!]/ig,                       TypeStatus.operator).parse(fileData));
// console.log(stringToTerminal(/\b((?!begin|var|end)([a-z]+))\b/ig, TypeStatus.identifier).parse(fileData));


