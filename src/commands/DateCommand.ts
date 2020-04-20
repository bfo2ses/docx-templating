import { ICommand, INode } from "../types"
import { IfNode, TextNode, DateNode } from "../nodes"
import { Block } from "../Block"

export class DateCommand implements ICommand {
    private readonly REGEXP = /([^{=}]*){D=\(([^{=},]*)[\s]*,[\s]*(.+)\)}([^{=}]*)/g
    static instance: DateCommand

    static getInstance() {
        if (!this.instance) {
            this.instance = new DateCommand()
        }
        return this.instance
    }

    is(text: string): boolean {
        return new RegExp(this.REGEXP).test(text)
    }

    process(text: string, node: INode): string {
        const regex = new RegExp(this.REGEXP)
        const result = regex.exec(text)
        if(result){
            node.children.push(
                new TextNode({ parent: node, text: result[1] })
            )
            node.children.push(
                new DateNode({
                    parent: node,
                    parameter: result[2],
                    format: result[3]
                })
            )
            return result[4]
        }
        return ''
    }

}