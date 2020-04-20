import { ICommand, INode } from "../types"
import { Block } from "../Block"
import { Node } from "../Node"

export class EndBlockCommand implements ICommand {
    private readonly REGEXP = /^{\/(IF|F|TF)}$/g
    static instance: EndBlockCommand

    static getInstance() {
        if (!this.instance) {
            this.instance = new EndBlockCommand()
        }
        return this.instance
    }

    is(text: string): boolean {
        return new RegExp(this.REGEXP).test(text)
    }

    process(text: string, node: INode): string {
        Node.getInstance().endBlock()
        return ''
    }

}