import ErrorFactory from '../libs/ErrorFactory';
import * as combin  from '../libs/combin';
import Parser       from '../libs/ParseModel';

import Identifier from './lexemParsers/identParsers';
import Constant   from './lexemParsers/constParsers';
import Operator   from './lexemParsers/operatorParsers';



const
    //! think about Error here
    operandParser = new Parser((str_: string): combin.parserRes => {
        return combin.seqAlt(Identifier.identParser, Constant.constParser).parse(str_);
    }),


    unaryOperandParser = new Parser((str_: string): combin.parserRes => {

        let unrOperParser = combin.functor(
            combin.seqApp(Operator.unaryParser, operandParser), 
            (res_: combin.parserRes) => {
                return {
                    result: `${res_.result[0]} ${res_.result[1]}`,
                    input : res_.input,
                }
            }
        );

        return combin.seqAlt(unrOperParser, operandParser).parse(str_);  
    });


export default {

    //@return Parser: string -> 
    //    [(unary operator | NOTHING) + (constant | identifier), other string] | Error
    unaryOperandParser: unaryOperandParser,

    //@return Parser: string -> [(constant | identifier), other string] | Error
    operandParser: operandParser,
}