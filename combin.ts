import TypeStatus from './libs/typeStatus';
import Lexem      from './libs/lexem';
import Parser     from './libs/ParseModel';
import * as fs    from 'fs';


let
    empty = (): Parser => {
        return new Parser(() => {
            return null;
        });
    },

    //look type in future
    pure = (a: any): Parser => {
        return new Parser((input: any): Array<any> => {
            return [a, input];
        });
    },

    //использовать для нетерминалов
    //input parser + func 
    monadBind = (p_: Parser, f_: Function): Parser => {
        return new Parser((input: any): object | null => {
            let res = p_.parse(input);
            if(res == null) return null;
            // console.log('monad-debug:', res);
            let newParser = f_(res.result); //return parser
            return newParser.parse(res.input); 
        });
    },

    //<^>
    fmap = (f_: Function, p_: Parser): Parser => {
        return monadBind(p_, (a: any) => {console.log('fmap-debug:', a); return pure(f_(a))});
    },

    //
    alternative = (p_: Parser, q_: Parser): Parser => {
        return new Parser((input: any) => {
            let res = p_.parse(input);
            if(res == null) return q_.parse(input);
            return res;
        });
    },

    // <*>
    seqApp = (p_: Parser, q_: Parser): Parser => {
        return monadBind(p_, (f: any) => {return fmap(f, q_)});
    },

    // <*
    seqAppL = (p_: Parser, q_: Parser): Parser => {
        return new Parser((input: any) => {
            let resP = p_.parse(input);
            if(resP == null) return null; 

            let resQ = q_.parse(resP.result);
            if(resQ == null) return null;
            return [resQ.result, resP.input];
        });
    },

    // *>
    seqAppR = (p_: Parser, q_: Parser): Parser => {
        return new Parser((input: any) => {
            let resP = p_.parse(input);
            if(resP == null) return null;
            
            let resQ = q_.parse(resP.result);
            //я хочу поменять тут null
            if(resQ == null) return {result: null, input: resP.result};
            return {
                result: resQ.result,
                input : resQ.input,
            };
        });
    },

    many = (p_: Parser): Parser => {
        return alternative(many1(p_), pure([]));
    },

    many1 = (p_: Parser): Parser => {
        return seqAppL(p_, many(p_));  
    };

export {empty, pure, monadBind, fmap, alternative, seqApp, seqAppL, seqAppR, many};




    

    

