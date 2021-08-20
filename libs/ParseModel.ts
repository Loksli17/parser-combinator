
// ! PROMISE CONSTUCTOR?

export interface ParserRes{
    result: any,
    input : any,
}

export default class Parser{

    private parserFunction: (str: string) => Promise<ParserRes | null>;

    constructor(parse_: (str: string) => Promise<ParserRes | null>){
        this.parserFunction = parse_;
    }

    public createPromise(str_: string): Promise<ParserRes>{
        return new Promise((resolve: Function, reject: Function) => {

            this.parserFunction(str_).then(value => {
                resolve(value);
                reject(new Error('error'));
            });     
        });
    }
}