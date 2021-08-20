
// ! PROMISE CONSTUCTOR?

interface parserRes{
    result: any,
    input : any,
}

interface genTermRes extends parserRes{
    result: string,
    input : string,
}


const 
    genTerm = new Promise((resolve, reject) => {

        let 
            str = "var x, y, z, u: integer;",
            reg = /^var\s+/ig;
        str.replace(/^\s*/, '');

        let regExpResultArr: RegExpMatchArray | null = str.match(reg);
        let resolveData: genTermRes | null = regExpResultArr == null ? null : {
            result: regExpResultArr[0],
            input : str.replace(regExpResultArr[0], '')
        };

        resolve(resolveData);
        reject(new Error('error'));
    }),
    
    functor = new Promise((resolve, reject) => {

        let 
            parser: Promise<unknown> = genTerm,
            func  : Function = (value: genTermRes) => {
                return {
                    result: 'Var',
                    input : value.input,
                }
            };

        parser.then(value => {
            let resolveData: genTermRes | null = value == null ? null : func(value);
            resolve(resolveData);
        });

    });




export default {
    genTerm,
    functor,
};