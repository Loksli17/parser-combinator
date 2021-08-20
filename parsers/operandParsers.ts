import ErrorFabric from '../libs/ErrorFabric';
import * as combin from '../libs/combin';
import Parser      from '../libs/ParseModel';

import Identifier from './lexemParsers/identParsers';
import Constant   from './lexemParsers/constParsers';
import Operator   from './lexemParsers/operatorParsers';



const 
    operandParser = new Parser((str_: string): combin.parserRes => {
        return combin.seqAlt(Identifier.identParser, Constant.constParser).parse(str_);
    }),

    unaryOperandParser = new Parser((str_: string): combin.parserRes => {

        let
            unrOperParser = combin.functor(
                combin.seqApp(
                    Operator.unaryParser,
                    operandParser,
                ), 
                (res_: combin.parserRes) => {
                    return {
                        result: `${res_.result[0]} ${res_.result[1]}`,
                        input : res_.input,
                    }
                }
            ),
            resultParser = combin.seqAlt(
                unrOperParser,
                operandParser,
            );

        return resultParser.parse(str_);
    });


export default {

    //@return Parser: string -> [constant, other string] | Error
    unaryOperandParser: unaryOperandParser
}