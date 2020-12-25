class ErrorModel{
    public term   : string;
    public result : string;
    public message: string;

    constructor(mes_: string, term_: string, res_: string){
        this.message = mes_;
        this.term    = term_;
        this.result  = res_;
    }

    public createError(): void{
        console.log(`Error: ${this.message} before ${this.result}`);
        process.exit(0);
    }

}

export default ErrorModel;