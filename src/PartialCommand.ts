import { TagNode, TextNode } from "./nodes"
import { Tags } from "./enums"
import { Command } from "./Command"
import { INode } from "./types"


export class PartialCommand {
    static node: INode
    static parts: { text: string, node: TagNode }[] = []

    private static hasCommand() {
        return Command.getInstance().hasCommand(this.parts.map(part => part.text).join(''))
    }

    static init(node: INode) {
        this.node = node
        this.parts = []
    }

    static process() {
        let text = this.parts.map(part => part.text).join('')
        if (this.hasCommand()) {
            this.parts.forEach(part => {
                part.node.ignore = true
            })
            this.parts[0].node.children.forEach(c => {
                if (c.tag === Tags.TEXT) c.ignore = true
            })
            this.parts[0].node.ignore = false
            while (text?.length) {
                const textNode = new TagNode({
                    parent: this.parts[0].node,
                    attributes: {
                        'xml:space': 'preserve'
                    },
                    tag: Tags.TEXT
                })
                this.parts[0].node.children.push(textNode)
                if (Command.getInstance().hasCommand(text)) {
                    text = Command.getInstance().process(text, textNode)
                } else {
                    const node = new TextNode({
                        text,
                        parent: textNode
                    })
                    textNode.children.push(node)
                    text = ''
                }
            }
        }
    }

    static add(text: string, node: TagNode) {
        if (node.tag !== Tags.TEXT) {
            if (node.tag !== Tags.TEXT_CONTAINER && this.parts.filter(part => part.node.tag === Tags.TEXT_CONTAINER).length === 0) return
            this.parts.push({
                text,
                node
            })
        }
    }
}