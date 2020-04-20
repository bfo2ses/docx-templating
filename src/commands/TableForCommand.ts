import { ICommand, INode } from "../types"
import { ForNode } from "../nodes"
import { Node } from '../Node'

export class TableForCommand implements ICommand {
    private readonly REGEXP = /^{TF=([^\s!]+) IN ([^\s!]+)}$/g
    static instance: TableForCommand

    static getInstance() {
        if (!this.instance) {
            this.instance = new TableForCommand()
        }
        return this.instance
    }

    is(text: string): boolean {
        return new RegExp(this.REGEXP).test(text)
    }

    process(text: string, node: INode): string {
        const result = new RegExp(this.REGEXP).exec(text)
        if (result) {
            const tr = node.parent?.parent?.parent?.parent
            if (tr) {
                const parent = tr?.parent || node
                tr.ignore = true
                const newNode = new ForNode({
                    parent,
                    parameters: {
                        array: result[2],
                        item: result[1]
                    }
                })
                parent.children.push(
                    newNode
                )
                Node.getInstance().beginBlock(newNode)
            }
        }
        return ''
    }

}