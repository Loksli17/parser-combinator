class ErrorModel{
    public term   : string;
    public input : string;
    public message: string;

    constructor(mes_: string, term_: string, input_: string){
        this.message = mes_;
        this.term    = term_;
        this.input   = input_;
    }

    public callError(fullText: string): void{
        console.error(`Error: ${this.message} before:\n ${fullText.replace(this.input, '')}`);
        process.exit(0);
    }

}

export default ErrorModel;