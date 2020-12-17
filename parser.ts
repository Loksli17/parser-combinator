import TypeStatus  from './libs/typeStatus';
import Lexem       from './libs/lexem';
import Parser      from './libs/ParseModel';
import * as fs     from 'fs';
import * as combin from './combin';

let
    result  : string,
    fileData: string = fs.readFileSync('data.txt', 'utf-8');

let 
    //@return Parser string -> Lexem
    strToTerm = (reg_: RegExp, status_: TypeStatus): Parser => {
        return new Parser((str_: string): object | null => {
            let arr: RegExpMatchArray | null = str_.match(reg_);
            return arr == null ? null : {
                result: {lexem: arr[0], type: status_, numStr: 0},
                input : str_.replace(arr[0], ''),
            };
        });
    },

    strToStr = (reg_: RegExp): Parser => {
        return new Parser((str_: string): object | null => {
            str_ = str_.replace(/^\s*/, '');
            let arr: RegExpMatchArray | null = str_.match(reg_);
            return arr == null ? null : {
                result: arr[0],
                input : str_.replace(arr[0], ''),
            }
        });
    },

    strToEqualStr = (reg_: RegExp): Parser => {
        return new Parser((str_: string): object | null => {
            let 
                arr : RegExpMatchArray | null = str_.match(reg_),
                bool: boolean;

            if(arr == null) return null;

            bool = arr[0] == str_;

            return !bool ? null : {
                result: str_,
                input : '',
            };
        });
    },

    varParser = combin.monadBind(strToStr(/^var\s+/ig), (res_: string): Parser => {
        return new Parser((input_: string): object | null => {
            return {
                result: 'Var\n',
                input : input_, 
            }
        });
    }),

    logicalParser = combin.monadBind(strToStr(/^:\s*logical\s*;/ig), (res_: string): Parser => {
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

    beginParser = combin.monadBind(strToStr(/^begin/ig), (res_: string): Parser => {
        return new Parser((input_: string): object | null => {

            if(res_ == null) return null;

            return {
                result: 'Begin',
                input : input_, 
            }
        });
    }),

    endParser = combin.monadBind(strToStr(/^end/ig), (res_: string): Parser => {
        return new Parser((input_: string): object | null => {

            if(res_ == null) return null;

            return {
                result: 'End',
                input : input_, 
            }
        });
    }),

    equalParser = combin.monadBind(strToStr(/^:=/ig), (res_: string): Parser => {
        return new Parser((input_: string): object | null => {

            if(res_ == null) return null;

            return {
                result: '=',
                input : input_,
            }
        });
    }),

    unaryParser = strToStr(/^!/ig),

    binaryParser = combin.monadBind(strToStr(/^[\|\^\&]/ig), (res_: string): Parser => {
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

    identParser = strToStr(/^\b((?!begin|var|end)([a-z]+))\b/ig),

    varListParser = new Parser((str_: string) => {
        
        let
            parserIdent = combin.alternative(identParser, combin.empty()),
            parserSepar = combin.alternative(strToStr(/^,:/ig), combin.empty());

        console.log('varList', str_ = parserIdent.parse(str_).input);
        console.log('varList', parserSepar.parse(str_));
    }),

    varDecParser = new Parser((str_: string) => {

        let 
            parserIdent      = strToStr(/\b((?!begin|var|end)([a-z]+))\b/ig),
            parserSepar      = strToStr(/([\(\),;]|begin|end)/ig),
            combinIdentSepar = combin.seqAppR(parserIdent, parserSepar),
            varListParser    = combin.many(combinIdentSepar);
        
        return combin.seqAppR(varParser, combin.seqAppL(varListParser, logicalParser));
    });

    

export {
    strToStr, 
    strToTerm, 
    strToEqualStr,

    varParser, 
    logicalParser,    
    beginParser, 
    endParser,
    
    equalParser,
    unaryParser,
    identParser,
    binaryParser,

    varListParser,
    varDecParser,
};


// console.log(stringToTerminal(/(var)/ig,                           TypeStatus.keyword).parse(fileData));
// console.log(stringToTerminal(/([\(\),;]|begin|end)/ig,            TypeStatus.separator).parse(fileData));
// console.log(stringToTerminal(/[01]/ig,                            TypeStatus.const).parse(fileData));
// console.log(stringToTerminal(/[\|\^\&!]/ig,                       TypeStatus.operator).parse(fileData));
// console.log(stringToTerminal(/\b((?!begin|var|end)([a-z]+))\b/ig, TypeStatus.identifier).parse(fileData));


