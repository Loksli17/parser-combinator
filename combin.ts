import TypeStatus from './libs/typeStatus';
import Lexem      from './libs/lexem';
import Parser     from './libs/ParseModel';
import * as fs    from 'fs';


interface genTermRes{
    result: string,
    input : string,
}

let
    //@return Parser: string -> [term, other string]
    genTerm = (reg_: RegExp): Parser => {
        return new Parser((str_: string): genTermRes | null => {
            str_ = str_.replace(/^\s*/, ''); //trum many spaces
            let arr: RegExpMatchArray | null = str_.match(reg_);
            return arr == null ? null : {
                result: arr[0],
                input : str_.replace(arr[0], ''),
            }
        });
    },

    //парсер который будет возвращать ошибку
    error = (): Parser => {
        return new Parser(() => {
            return null;
        });
    },

    //_>> @return Parser: [Parser A, function] -> new Parser 
    monadBind = (a_: Parser, f_: Function): Parser => {
        return new Parser((input: string): genTermRes | null => {
            let res = a_.parse(input);
            if(res == null) return null;
            let newParser = f_(res.result); //return parser
            return newParser.parse(res.input); 
        });
    },

    //<*> @return Parser: [parser A, Parser B] -> func
    seqApp = (a_: Parser, b_: Parser, compare: Function): Parser => {
        return new Parser((str_: string): Function | null => {
            let resA = a_.parse(str_);
            if(resA == null) return null;
            let resB = b_.parse(resA.input);
            if(resB == null) return null;
            return compare(resA, resB);
        });
    },

    //<|>
    altSeq = (a_: Parser, b_: Parser): Parser => {
        return new Parser((str_: string): Array<genTermRes> | null => {
            let
                resA = a_.parse(str_),
                resB = b_.parse(str_);
            
                if(resA == null){
                    resB == null ? null : resB;
                };

                return resA;
        });
    },

    repeat = (a_: Parser, value: string): Parser => {
        return new Parser((str_: string) => {
            let result: string = '';

            while(true){
                let resA  : genTermRes = a_.parse(str_);
                if(resA == null) return null;
                if(resA.input == value) break;
                result += resA.result + ' ';
                str_ = str_.replace(resA.result, '');
            }

            return result == '' ? null : result;
        })  
    };



export {genTermRes, genTerm, error, monadBind, seqApp, altSeq, repeat};




    

    

