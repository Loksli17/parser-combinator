import ErrorFabric from '../../libs/ErrorFabric';
import * as combin from '../../libs/combin';


const
    //@return commaParser without Error handler
    commaParser = combin.genTerm(/^,/ig),

    //@return colonParser without Error handler
    colonParser = combin.genTerm(/^:/ig),

    //@return semicolonParser without Error handler
    semicolonParser = combin.genTerm(/^;/ig);


export default {

    //@return Parser: string -> [',', other string] | Error
    commaParser: combin.monadBind(
        commaParser,
        ErrorFabric(','),
    ),
    
    //@return Parser: string -> [':', other string] | Error
    colonParser: combin.monadBind(
        colonParser,
        ErrorFabric(':'),
    ),

    //@return Parser: string -> [';', other string] | Error
    semicolonParser: combin.monadBind(
        semicolonParser,
        ErrorFabric(';'),
    ),
}