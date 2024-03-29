import ErrorFactory from '../../libs/ErrorFactory';
import * as combin  from '../../libs/combin';


//@return constParser without Error handler
const constParser = combin.genTerm(/^[10]/ig);


export default {

    //@return Parser: string -> [constant, other string] | Error
    constParser: combin.monadBind(
        constParser, 
        ErrorFactory('idenificator'),
    ),
}