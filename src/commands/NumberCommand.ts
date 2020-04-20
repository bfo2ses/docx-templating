import { ICommand, INode } from "../types"
import { NumberNode, TextNode } from "../nodes"

export class NumberCommand implements ICommand {
    private readonly REGEXP = /^([^{=}]*){N=\(([^,\[\]]+)[\s,]*([0-9]*)[\s,]*(\$|€|%)?\)}(.*)$/g
    static instance: NumberCommand

    static getInstance() {
        if (!this.instance) {
            this.instance = new NumberCommand()
        }
        return this.instance
    }

    is(text: string): boolean {
        return new RegExp(this.REGEXP).test(text)
    }

    process(text: string, node: INode): string {
        const regex = new RegExp(this.REGEXP)
        const result = regex.exec(text)
        if (result) {
            node.children.push(
                new TextNode({ parent: node, text: result[1] })
            )
            node.children.push(
                new NumberNode({ parent: node, parameter: result[2], decimal: result[3].length ? parseInt(result[3]) : 2, currency: result[4] ? result[4] : null })
            )
            return result[5]
        }
        return ''
    }

}