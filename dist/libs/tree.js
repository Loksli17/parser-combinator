"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Tree {
    constructor() {
        this.nodes = [];
    }
    addNode(lexem_, root_) {
        this.nodes.push({
            root: root_,
            lexem: lexem_,
            childrens: [],
        });
        this.nodes[root_].childrens.push(this.nodes.length - 1);
    }
    removeNode(num_) {
        if (this.nodes[num_] != undefined) {
            this.nodes.splice(num_, 1);
        }
    }
    getNodes() {
        return this.nodes;
    }
}
