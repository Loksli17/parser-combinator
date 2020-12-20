import TypeStatus from './libs/typeStatus';
import Lexem      from './libs/lexem';
import Parser     from './libs/ParseModel';
import * as fs    from 'fs';


interface parserRes{
    result: any,
    input : any,
}

interface genTermRes extends parserRes{
    result: string,
    input : string,
}

interface seqAppRes extends parserRes{
    result: Array<genTermRes>,
    input : string,
}

interface manyRes extends parserRes{
    result: Array<string>,
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
    error = (message_: string): Parser => {
        return new Parser((a: any) => {
            throw new Error(message_);
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

    //<^>
    functor = (a_: Parser, f_: Function): Parser => {
        return new Parser((str_: string) => {
            let res = a_.parse(str_);
            if(res == null) return null
            return f_(res);
        })
    },

    //<|>
    seqAlt = (a_: Parser, b_: Parser): Parser => {
        return new Parser((str_: string): Array<genTermRes> | null => {
            let resA = a_.parse(str_);
                
            if(resA == null){
                let resB = b_.parse(str_);
                return resB == null ? null : resB;
            };

            return resA;
        });
    },

    //<*> @return Parser: [parser A, Parser B] -> func
    seqApp = (a_: Parser, b_: Parser): Parser => {
        return new Parser((str_: string): seqAppRes | null => {
            let resA = a_.parse(str_);
            if(resA == null) return null;
            let resB = b_.parse(resA.input);
            if(resB == null) return null;
            return {
                result: [
                    resA.result,
                    resB.result,
                ],
                input: resB.input,
            };
        });
    },

    //<*
    seqAppL = (a_: Parser, b_: Parser): Parser => {
        return functor(seqApp(a_, b_), (res: seqAppRes) => {
            return{
                result: res.result[0],
                input : res.input,
            }
        });
    },

    //*>
    seqAppR = (a_: Parser, b_: Parser): Parser => {
        return functor(seqApp(a_, b_), (res: seqAppRes) => {
            return{
                result: res.result[1],
                input : res.input,
            }
        });
    },

    oneOrMany = (a_: Parser): Parser => {
        return new Parser((str_: string): manyRes | null => {

            let 
                tempInput: string            = '', 
                resA     : parserRes | null  = a_.parse(str_),
                res      : Array<any>        = [];

            if(resA == null) return null;
            
            res.push(resA.result);
            tempInput = resA.input;

            while(true){
                resA = a_.parse(resA.input);
                if(resA == null) break;
                tempInput = resA.input; 
                res.push(resA.result);
            }

            return {
                result: res,
                input : tempInput,
            };
        });
    };



export {
    genTermRes,
    parserRes,
    seqAppRes,
    manyRes,

    genTerm, 
    error, 
    
    monadBind,
    functor,
    seqAlt, 

    seqApp,
    seqAppL,
    seqAppR,

    oneOrMany
};




    

    

