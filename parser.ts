import TypeStatus  from './libs/typeStatus';
import Lexem       from './libs/lexem';
import Parser      from './libs/ParseModel';
import * as fs     from 'fs';
import * as combin from './combin';

let
    result  : string,
    fileData: string = fs.readFileSync('data.txt', 'utf-8');

//подумать про ошибки в каждом из парсеров!!!!!!!!!!!!!!!!!!

let 
    varParser = combin.functor(combin.genTerm(/^var\s+/ig), (res_: combin.parserRes): combin.parserRes => {
        return {
            result: 'Var',
            input : res_.input,
        };
    }),

    equalParser = combin.functor(combin.genTerm(/^:=/ig), (res_: combin.parserRes): combin.parserRes => {
        return {
            result: '=',
            input : res_.input,
        };
    }),

    unaryParser = combin.functor(combin.genTerm(/^!/ig), (res_: combin.parserRes) => {
        return {
            result: '.NOT.',
            input : res_.input,
        };
    }),

    binaryParser = combin.functor(combin.genTerm(/^[\|\^\&]/ig), (res_: combin.parserRes) => {
        
        let result: string = '';

        switch(res_.result){
            case '|':
                result = '.OR.';
                break;
            case '^':
                result = '.XOR.';
                break;
            case '&':
                result = '.AND.';
                break;
        }
        
        return {
            result: result,
            input : res_.input,
        };
    }),

    //накинуть сверху вывод ошибки
    identParser = combin.genTerm(/^\b((?!begin|var|end)([a-z]+))\b/ig),

    commaParser = combin.genTerm(/^,/ig),

    colonParser = combin.genTerm(/^:/ig),

    beginParser = combin.functor(combin.genTerm(/^begin/ig), (res_: combin.parserRes) => {
        return {
            result: 'Begin',
            input : res_.input,
        };
    }),

    endParser = combin.functor(combin.genTerm(/^end/ig),  (res_: combin.parserRes) => {
        return {
            result: 'End',
            input : res_.input,
        };
    }),

    semicolonParser = combin.genTerm(/^;/ig),

    logicalParser = combin.functor(
        combin.seqApp(
            combin.genTerm(/^logical/ig),
            semicolonParser,
        ),
        (res: combin.parserRes): combin.parserRes | null => {
            if(res.result.length != 2) return null; //normal error here
            return {
                result: `Boolean;`,
                input : res.input,
            };
        },
    ),
   
    //спросить (don't forget about functor)
    identListParser = new Parser((str_: string): combin.parserRes => {
        let
            commaColonParser: Parser = combin.seqAlt(commaParser, colonParser),
            identSeparParser: Parser = combin.functor(
                combin.seqApp(identParser, commaColonParser),
                (res: combin.parserRes): combin.parserRes | null => {
                    if(res.result.length != 2) return null; //i need in normal error here
                    return {
                        result: `${res.result[0]}${res.result[1]}`,
                        input : res.input,
                    };
                },
            ), 
            listParser      : Parser = combin.oneOrMany(identSeparParser),
            valueLanguage   : string = '';

        console.log('\nlistParserTests:');
        console.log(listParser.parse('   asd  , afd, fd:')); //good output
        console.log(listParser.parse('dfsdf, , , , :')); //ошибку в такой ситуации можно выкинуть выше

        return {
            result: 'asd, afd, fd:',
            input : ' logical;',
        }
    }),

    expressionParser = new Parser((str_: string): combin.parserRes => {
        

        return {
            result: '',
            input : '',
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


