import { Text } from "./Text"

export class PartialCommand {
    static isCommand() {
        return Text.isCommand(this.text)
    }
    static node: DOCXTemplating.INode | null
    static text: string

    static init(node: DOCXTemplating.INode | null) {
        this.node = node
        this.text = ''
    }

    static addText(text: string) {
        this.text += text
    }
}