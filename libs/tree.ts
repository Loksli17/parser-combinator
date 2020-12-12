import Lexem from './lexem';

interface NodeTree{
    root     : number,
    childrens: Array<number>,
    lexem    : Lexem,
}

class Tree{
    private nodes : Array<NodeTree>;

    constructor(){
        this.nodes = [];
    }

    public addNode(lexem_: Lexem, root_: number): void{
        this.nodes.push({
            root     : root_,
            lexem    : lexem_,
            childrens: [], 
        });

        this.nodes[root_].childrens.push(this.nodes.length - 1);
    }

    public removeNode(num_: number): void{
        if(this.nodes[num_] != undefined){
            this.nodes.splice(num_, 1);
        }
    }

    public getNodes(): Array<NodeTree>{
        return this.nodes;
    }
}