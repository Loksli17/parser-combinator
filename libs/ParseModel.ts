
// ! PROMISE CONSTUCTOR?

interface ParserRes{
    result: any,
    input : any,
}

export default class Parser{

    private parserFunction: (str: string) => ParserRes | null;

    constructor(parse_: (str: string) => ParserRes | null){
        this.parserFunction = parse_;
    }

    public createPromise(str_: string): Promise<ParserRes>{
        return new Promise((resolve: Function, reject: Function) => {

            let resolveData: ParserRes | null = this.parserFunction(str_);

            resolve(resolveData);
            reject(new Error('error'));            
        });
    }
}