import { ICommand, INode } from "../types"
import { TemplateNode } from "../nodes/Template"

export class TemplateCommand implements ICommand {
    private readonly REGEXP = /{T=([^\s!]+)}/g
    static instance: TemplateCommand

    static getInstance() {
        if (!this.instance) {
            this.instance = new TemplateCommand()
        }
        return this.instance
    }

    is(text: string): boolean {
        return new RegExp(this.REGEXP).test(text)
    }

    process(text: string, node: INode): string {
        const result = new RegExp(this.REGEXP).exec(text)
        if (result) {
            const parent = node.parent.parent.parent
            parent.children[parent.children.length - 1].ignore = true
            const newNode = new TemplateNode({
                parent,
                file: result[1]
            })
            parent.children.push(
                newNode
            )
        }
        return ''
    }

}