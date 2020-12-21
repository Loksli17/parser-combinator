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

    semicolonParser = combin.genTerm(/^;/ig),
    
    constParser = combin.genTerm(/^[10]/ig),

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
            identColonParser: Parser = combin.functor(
                combin.seqApp(identParser, colonParser),
                (res: combin.parserRes): combin.parserRes | null => {
                    if(res.result.length != 2) return null; //i need in normal error here
                    return {
                        result: `${res.result[0]}${res.result[1]}`,
                        input : res.input,
                    };
                },
            ),
            
            identCommaParser: Parser = combin.functor(
                combin.seqApp(identParser, commaParser),
                (res: combin.parserRes) => {
                    if(res.result.length != 2) return null; //i need in normal error here
                    return {
                        result: `${res.result[0]}${res.result[1]}`,
                        input : res.input,
                    }
                },
            ),

            listIdentCommaParser: Parser = combin.functor(
                combin.oneOrMany(identCommaParser),
                (res: combin.parserRes) => {

                    //проверка на null
                    let valueLanguage: string = '';

                    for(let i = 0; i < res.result.length; i++){
                        valueLanguage += res.result[i] + ' ';
                    }

                    return {
                        result: valueLanguage,
                        input : res.input,
                    }
                }
            ),
    
            listIdentCommaColonParser: Parser = combin.functor(
                combin.seqApp(listIdentCommaParser, identColonParser),
                (res: combin.parserRes) => {
                    if(res.result.length != 2) return null; //i need in normal error here
                    return {
                        result: `${res.result[0]}${res.result[1]}`,
                        input : res.input,
                    }
                },
            ),

            resultParser: Parser = combin.seqAlt(
                identColonParser, 
                listIdentCommaColonParser,
            );

        console.log('\nlistParserTests:');
        console.log(resultParser.parse('   asd  , afd, fd:')); //good output
        console.log(resultParser.parse(' fd  :')); //good output
        console.log(resultParser.parse('asd, fd:')); //good output
        console.log(resultParser.parse('asd, , fd:')); //null output
        console.log(resultParser.parse('asd fd:')); //null output
        console.log(resultParser.parse('fd')); //null output
        console.log(resultParser.parse(':')); //null output
        console.log('end list')

        return resultParser.parse(str_);
    }),


    varDecParser = new Parser((str_: string): combin.parserRes => {
        
        let 
            parser1 = combin.functor(
                combin.seqApp(varParser, identListParser),
                (res: combin.parserRes) => {
                    if(res.result.length != 2) return null; //i need in normal error here
                    return {
                        result: `${res.result[0]} ${res.result[1]}`,
                        input : res.input,
                    }                    
                },
            ),
            resultParser = combin.functor(
                combin.seqApp(parser1, logicalParser),
                (res: combin.parserRes) => {
                    if(res.result.length != 2) return null; //i need in normal error here
                    return {
                        result: `${res.result[0]} ${res.result[1]}`,
                        input : res.input,
                    } 
                },
            );
        
        return resultParser.parse(str_);
    }),

    
    operandParser = new Parser((str_: string): combin.parserRes => {
        return combin.seqAlt(identParser, constParser).parse(str_);
    }),

    expressionParser = new Parser((str_: string): combin.parserRes => {
        
        let 
            unaryUndExrpParser = combin.functor(
                combin.seqApp(unaryParser, underExpressionParser),
                (res: combin.parserRes): combin.parserRes => {
                    return {
                        result: `${res.result[0]} ${res.result[1]}`,
                        input : '',
                    }
                },
            ),
            resultParser = combin.seqAlt(unaryUndExrpParser, underExpressionParser);

        return resultParser.parse(str_);
    }),

    underExpressionParser = new Parser((str_: string): combin.parserRes => {
        return {
            result: '(a ^ b) & (a | c)',
            input : ';',
        };
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
    operandParser,

    varDecParser,
    expressionParser,

};


// console.log(stringToTerminal(/(var)/ig,                           TypeStatus.keyword).parse(fileData));
// console.log(stringToTerminal(/([\(\),;]|begin|end)/ig,            TypeStatus.separator).parse(fileData));
// console.log(stringToTerminal(/[01]/ig,                            TypeStatus.const).parse(fileData));
// console.log(stringToTerminal(/[\|\^\&!]/ig,                       TypeStatus.operator).parse(fileData));
// console.log(stringToTerminal(/\b((?!begin|var|end)([a-z]+))\b/ig, TypeStatus.identifier).parse(fileData));


