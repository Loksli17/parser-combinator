"use strict";
exports.__esModule = true;
exports.genTerm = void 0;
// import Error  from './libs/ErrorModel';
var ParseModel_1 = require("./libs/ParseModel");
// let
//     //@return Parser: string -> [term, other string]
//     genTerm = (reg_: RegExp): Parser => {
// return new Parser((str_: string): genTermRes | null => {
//     // console.log('genTerm:', str_);
//     str_ = str_.replace(/^\s*/, ''); //trum many spaces
//     let arr: RegExpMatchArray | null = str_.match(reg_);
//     return arr == null ? null : {
//         result: arr[0],
//         input : str_.replace(arr[0], ''),
//     }
// });
/*
    };


    //_>> @return Parser: [Parser A, function] -> new Parser
    monadBind = (a_: Parser, f_: Function): Parser => {
        // return new Parser((input: string): genTermRes | null => {
        //     let res = a_.parse(input);
        //     if(res == null) return f_(null).parse(input);
        //     let newParser = f_(res.result); //return parser
        //     return newParser.parse(res.input);
        // });
    },

    //<^>
    functor = (a_: Parser, f_: Function): Parser => {
        // return new Parser((str_: string) => {
        //     let res = a_.parse(str_);
        //     if(res == null) return null;
        //     return f_(res);
        // })
    },

    //<|>
    seqAlt = (a_: Parser, b_: Parser): Parser => {
        // return new Parser((str_: string): Array<genTermRes> | null => {
        //     let resA = a_.parse(str_);
        //     if(resA == null){
        //         let resB = b_.parse(str_);
        //         return resB == null ? null : resB;
        //     };
        //     return resA;
        // });
    },

    //<*> @return Parser: [parser A, Parser B] -> func
    seqApp = (a_: Parser, b_: Parser): Parser => {
        // return new Parser((str_: string): seqAppRes | null | Error => {
            
        //     let resA = a_.parse(str_);
        //     if(resA == null) return null;
        //     if(resA instanceof Error) return new Error(resA.message, resA.term, resA.input);

        //     let resB = b_.parse(resA.input);
        //     if(resB == null) return null;
        //     if(resB instanceof Error) return new Error(resB.message, resB.term, resB.input);

        //     return {
        //         result: [
        //             resA.result,
        //             resB.result,
        //         ],
        //         input: resB.input,
        //     };
        // });
    },

    //<*
    seqAppL = (a_: Parser, b_: Parser): Parser => {
        // return functor(seqApp(a_, b_), (res: seqAppRes) => {
        //     return{
        //         result: res.result[0],
        //         input : res.input,
        //     }
        // });
    },

    //*>
    seqAppR = (a_: Parser, b_: Parser): Parser => {
        // return functor(seqApp(a_, b_), (res: seqAppRes) => {
        //     return{
        //         result: res.result[1],
        //         input : res.input,
        //     }
        // });
    },

    oneOrMany = (a_: Parser): Parser => {
        // return new Parser((str_: string): manyRes | null => {

        //     let
        //         tempInput: string            = '',
        //         resA     : parserRes | null  = a_.parse(str_),
        //         res      : Array<any>        = [];

        //     if(resA == null) return null;
            
        //     res.push(resA.result);
        //     tempInput = resA.input;

        //     while(true){
        //         resA = a_.parse(resA.input);
        //         if(resA == null) break;
        //         tempInput = resA.input;
        //         res.push(resA.result);
        //     }

        //     return {
        //         result: res,
        //         input : tempInput,
        //     };
        // });
    
    
    };
    */
var genTerm = function (reg_) {
    return new ParseModel_1["default"](function (str_) {
        str_ = str_.replace(/^\s*/, '');
        var regExpResultArr = str_.match(reg_);
        return new Promise(function (resolve, reject) {
            resolve(regExpResultArr == null ? null : {
                result: regExpResultArr[0],
                input: str_.replace(regExpResultArr[0], '')
            });
            reject(new Error('err'));
        });
    });
};
exports.genTerm = genTerm;
