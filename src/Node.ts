import { INode } from "./types"

export class Node {

    private static instance: Node | null

    #current: INode
    #commandBlock: INode
    #endCommandBlock: INode | null
    #commandBlocks: INode[] = []


    static getInstance(): Node {
        if (!this.instance) {
            this.instance = new Node()
        }
        return this.instance
    }

    static reset() {
        this.instance = null
    }

    getCurrent() {
        return this.#current
    }

    setCurrent(node: INode) {
        this.#current = node
    }

    addChild(node: INode) {
        this.#current.children.push(node)
    }

    setParentAsCurrent(): void {
        if (this.isInBlockCommand()) {
            if (this.blockCommandHasFinished()) {
                if (this.#endCommandBlock === this.#current.parent) {
                    this.#current = this.#endCommandBlock.parent
                    this.#endCommandBlock = null
                } else {
                    this.#current = this.#current.parent
                }
            } else {
                if (this.#current.parent === this.#commandBlock?.parent) {
                    this.#current = this.#commandBlock
                } else {
                    this.#current = this.#current.parent
                }
            }
        } else {
            this.#current = this.#current.parent
        }

    }

    private blockCommandHasFinished(): boolean {
        return !!this.#endCommandBlock
    }

    private isInBlockCommand(): boolean {
        return !!this.#commandBlock || this.blockCommandHasFinished()
    }

    endBlock() {
        this.#endCommandBlock = this.getLastBlock()
        this.#endCommandBlock.children[this.#endCommandBlock.children.length - 1].ignore = true
        this.#commandBlocks.pop()
        this.#commandBlock = this.getLastBlock()
    }
    beginBlock(node: INode) {
        this.#commandBlocks.push(node)
        this.#commandBlock = node
        this.#endCommandBlock = null
    }

    private getLastBlock() {
        return this.#commandBlocks[this.#commandBlocks.length - 1]
    }

}