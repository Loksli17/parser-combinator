import ErrorFabric from '../../libs/ErrorFabric';
import * as combin from '../../libs/combin';


const
    //@return varParser without Error handler
    varParser = combin.functor(combin.genTerm(/^var\s+/ig), (res_: combin.parserRes): combin.parserRes | null => {
        if(res_ == null) return null;
        return {
            result: 'Var',
            input : res_.input,
        };
    }),

    //@return beginParser without Error handler
    beginParser = combin.functor(combin.genTerm(/^begin/ig), (res_: combin.parserRes) => {
        if(res_ == null) return null;
        return {
            result: 'Begin',
            input : res_.input,
        };
    }),

    //@return endParser without Error handler
    endParser = combin.functor(combin.genTerm(/^end/ig),  (res_: combin.parserRes) => {
        if(res_ == null) return null;
        return {
            result: 'End',
            input : res_.input,
        };
    }),
    
    //@return logicalParser without Error handler
    logicalParser = combin.functor(
        combin.genTerm(/^logical/ig),
        (res_: combin.parserRes): combin.parserRes | null => {
            if(res_ == null) return null;
            return {
                result: `Boolean;`,
                input : res_.input,
            };
        },
    );


export default {

    //@return Parser: string -> ['var', other string] | Error
    varParser: combin.monadBind(
        varParser,
        ErrorFabric('var'),
    ),
    
    //@return Parser: string -> ['begin', other string] | Error
    beginParser: combin.monadBind(
        beginParser,
        ErrorFabric('begin'),
    ),
    
    //@return Parser: string -> ['end', other string] | Error
    endParser: combin.monadBind(
        endParser,
        ErrorFabric('end'),
    ),

    //@return Parser: string -> ['logical, other string] | Error
    logicalParser: combin.monadBind(
        logicalParser,
        ErrorFabric('logical'),
    ),
}