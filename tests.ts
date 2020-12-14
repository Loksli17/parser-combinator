import TypeStatus  from './libs/typeStatus';
import * as fs     from 'fs';
import Parser      from './libs/ParseModel';
import * as combin from './combin';
import * as parser from './parser';



//test parser strToString with two parsers
let 
    separParser = parser.strToStr(/[,;]/ig),
    identParser = parser.strToStr(/\b((?!begin|var|end)([a-z]+))\b/ig),
    res = identParser.parse('x, y, z');

console.log('strToParse: ', res);
console.log('strToParse: ', separParser.parse(res.input));



//test empty sipmle function which return NULL
let
    emptyParser = combin.empty();

res = emptyParser.parse();
console.log('empty: ', res);



//test pure поиспользовать еще
let a = 7, b = 2;
let
    pureParser = combin.pure(a + b);

res = pureParser.parse(3);
console.log('pure: ', res);
// console.log('pure-use: ', res[0].parse(res[1]));



//monadBind
let
    parser1 = parser.strToStr(/:/ig),
    monadBindParser = combin.monadBind(parser1, (resLeft_: string) => {
        return new Parser((str_: string) => {
            let arr = str_.match(/logical/ig);
            if(arr == null) return null;

            return{
                result: arr[0],
                input : str_.replace(arr[0], ''),
            };
        });
    });

res = monadBindParser.parse(':logical;');
console.log('monadBind: ', res);



//test fmap ->  не понятно зачем
let
    //fmap поделать еще что-то
    //для logical возвращать кортеж со списком вместо списка кортежей
    fmap = combin.fmap((arr: any) => {
        console.log(
            arr
            // arr[0].result,
            // arr[1].result,
            // arr[1].input,
        );
    }, monadBindParser);

console.log('fmap: ', fmap.parse(':logical;'));



let
    alternativeParser = combin.alternative(separParser, identParser);

res = alternativeParser.parse("kek = 1");
console.log('alternative: ', res);


//test seqApp
// let parserTestSeq = combin.seqApp(identParser, separParser).parse(() => {});


//test seqAppL
let
    lexSeparParser = parser.strToStr(/[a-z]+[,;]/),
    seqLParser     = combin.seqAppL(lexSeparParser, separParser);
    
res = seqLParser.parse('x, y, z');
console.log('seqL: ', res);



//test seqAppR
let
    lexSeparParser1 = parser.strToStr(/([a-z]+,|[a-z]+|,)/ig),
    seqRParser      = combin.seqAppR(lexSeparParser1, separParser);

res = seqRParser.parse('x, y, z');
console.log('seqR', res);

res = lexSeparParser1.parse('xAr, ytt, zer')
console.log('lexSeparParse', res);



//VAR LIIIIIIIST test variable-list parser how to do
//variant 1 - with while whan res not null (not correct, example places down)
res.input = 'asd, asd asd, asd, asd, ,';

do{
    res = parser.strToStr(/(\b((?!begin|var|end)([a-z]+))\b\s*,)/ig).parse(res.input);
    console.log(res);
}while(res != null)

//variant2 - it is better than before
let parserVarList = parser.strToStr(/(\s*\b((?!begin|var|end)([a-z]+))\b,\s*)+(\b((?!begin|var|end)([a-z]+))\b)/ig);
console.log(parserVarList.parse('asd, asd, gfd, dfg'));
//если null или не пустой input нужно делать ошибку, надо подумать как скомбинить возвращение не пустого input и не понятно что делать с лишними пробелами

//variant3
//Здесь идет полное сравние строки и результат регулярного выражения, чтобы находить ОДИН идент
//парсер ниже можно скомбинировать с помощью alternative
let parserIdentTest     = parser.strToEqualStr(/\b((?!begin|var|end)([a-z]+))\b/ig);
//parsers for listIdent
let parserIdentSeparStr = parser.strToStr(/((\b((?!begin|var|end)([a-z]+))\b\s*,)|\b((?!begin|var|end)([a-z]+))\b)/ig);
let parserIdentSepar    = combin.seqAppR(parserIdentSeparStr, parser.strToStr(/,/g));
parserIdentSepar = combin.monadBind(parserIdentSepar, (res_: string): Parser => {
    return new Parser((input_: string) => {

        console.log(res_, input_);

        if(res_ == null && input_ != null){
            return 'error with ,';
        }else if(res_ == null){
            return 'error with ident'; //не найден идентификатор
        }

        return {
            result: `${input_}${res_}`, 
            input : input_.replace(res_, ''),
        }
    });
});

console.log('/n/n ident list');
console.log(parserIdentSepar.parse(','));
// console.log(parserIdentTest.parse('kek'));


//вопросы
//1.





    



