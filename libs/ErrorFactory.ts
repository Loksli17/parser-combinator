
import ErrorParser from './ErrorModel';
import Parser      from './ParseModel';
import {parserRes} from './combin';


export default (terminal: string): Function => {
    return (res_: string, ): Parser => {
        return new Parser((input_: string): parserRes | ErrorParser => {
            return res_ == null ? new ErrorParser(`unexpected symbol, expected ${terminal}`, terminal, input_) : {result: res_, input: input_};
        });
    }
}