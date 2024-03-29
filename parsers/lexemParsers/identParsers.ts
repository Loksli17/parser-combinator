import ErrorFactory from '../../libs/ErrorFactory';
import * as combin  from '../../libs/combin';


//@return identParser without Error handler
const identParser = combin.genTerm(/^\b((?!begin|var|end)([a-z]+))\b/ig);


export default {

    //@return Parser: string -> [identificator, other string] | Error
    identParser: combin.monadBind(
        identParser, 
        ErrorFactory('identificator'),
    ),
}