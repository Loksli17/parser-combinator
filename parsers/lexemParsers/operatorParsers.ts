import ErrorFactory from '../../libs/ErrorFactory';
import * as combin  from '../../libs/combin';


const
    //@return equalParser without Error handler
    equalParser = combin.functor(combin.genTerm(/^:=/ig), (res_: combin.parserRes): combin.parserRes | null => {
        if(res_ == null) return null;
        return {
            result: '=',
            input : res_.input,
        };
    }),

    //@return unaryParser without Error handler
    unaryParser = combin.functor(combin.genTerm(/^!/ig), (res_: combin.parserRes): combin.parserRes | null => {
        if(res_ == null) return null;
        return {
            result: '.NOT.',
            input : res_.input,
        };
    }),

    //@return binaryParser without Error handler
    binaryParser = combin.functor(combin.genTerm(/^[\|\^\&]/ig), (res_: combin.parserRes) => {

        if(res_ == null) return null;
        
        let result: string = '';

        switch(res_.result){
            case '|':
                result = '.OR.';
                break;
            case '^':
                result = '.XOR.';
                break;
            case '&':
                result = '.AND.';
                break;
        }
        
        return {
            result: result,
            input : res_.input,
        };
    });


export default {

    equalParser: combin.monadBind(
        equalParser, 
        ErrorFactory(':='),
    ),

    unaryParser: combin.monadBind(
        unaryParser,
        ErrorFactory('!'),
    ),

    binaryParser: combin.monadBind(
        binaryParser,
        ErrorFactory('| or ^ or &'),
    ),
}