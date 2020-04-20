import { ICommand, INode } from "../types"
import { ForNode } from "../nodes"
import { Node } from '../Node'

export class ForCommand implements ICommand {
    private readonly REGEXP = /^{F=([^\s!]+) IN ([^\s!]+)}$/g
    static instance: ForCommand

    static getInstance() {
        if (!this.instance) {
            this.instance = new ForCommand()
        }
        return this.instance
    }

    is(text: string): boolean {
        return new RegExp(this.REGEXP).test(text)
    }

    process(text: string, node: INode): string {
        const result = new RegExp(this.REGEXP).exec(text)
        if (result) {
            const parent = node.parent?.parent?.parent || node
            const newNode = new ForNode({
                parent,
                parameters: {
                    array: result[2],
                    item: result[1]
                }
            })
            parent.children[parent.children.length - 1].ignore = true
            parent.children.push(
                newNode
            )
            Node.getInstance().beginBlock(newNode)
        }
        return ''
    }

}