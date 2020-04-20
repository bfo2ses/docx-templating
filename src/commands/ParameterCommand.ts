import { ICommand, INode } from "../types"
import { TextNode, ParameterNode } from "../nodes"

export class ParameterCommand implements ICommand {
    private readonly REGEXP = /([^{=}]*){=([^\s!]+)}(.*)/g
    static instance: ParameterCommand

    static getInstance() {
        if (!this.instance) {
            this.instance = new ParameterCommand()
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
                new ParameterNode({ parent: node, parameter: result[2] })
            )
            return result[3]
        }
        return ''
    }

}