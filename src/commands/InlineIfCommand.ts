import { ICommand, INode } from "../types"
import { TextNode, ParameterNode, IfNode } from "../nodes"

export class InlineIfCommand implements ICommand {
    private readonly REGEXP = /([^{=}]*){IF=\(([a-zA-Z0-9\.&!=><|"'\s]+)\)}([^{=}]*){\/IF}([^{=}]*)/g
    static instance: InlineIfCommand

    static getInstance() {
        if (!this.instance) {
            this.instance = new InlineIfCommand()
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
            const ifNode = new IfNode({
                parent: node,
                parameter: result[2]
            })
            ifNode.children.push(
                new TextNode({ parent: node, text: result[3] })
            )
            node.children.push(ifNode)
            return result[4]
        }
        return ''
    }

}