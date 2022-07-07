import { ICommand, INode } from "../types"
import { TextNode, ParameterNode, IfNode, InlineIfNode } from "../nodes"

export class InlineIfCommand implements ICommand {
    private readonly REGEXP = /([^{=}]*){IF=\(([^{},]+)(?:\s*,=\s*)?([^}]*?)(?:\s*,!\s*([^},]*))?\)}(.*)/g
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
            if (result[1].length > 0) {
                node.children.push(
                    new TextNode({ parent: node, text: result[1] })
                )
            }
            const ifNode = new InlineIfNode({
                parent: node,
                parameter: result[2],
                trueValue: result[3],
                falseValue: result[4]
            })

            node.children.push(ifNode)
            return result[5]
        }
        return ''
    }

}