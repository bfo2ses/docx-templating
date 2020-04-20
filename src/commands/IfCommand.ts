import { ICommand, INode } from "../types"
import { IfNode } from "../nodes"
import { Node } from "../Node"

export class IfCommand implements ICommand {
    private readonly REGEXP = /^{IF=\(([a-zA-Z0-9\.&'"!=><|\s]+)\)}$/g
    static instance: IfCommand

    static getInstance() {
        if (!this.instance) {
            this.instance = new IfCommand()
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
            const newNode = new IfNode({
                parent,
                parameter: result[1]
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