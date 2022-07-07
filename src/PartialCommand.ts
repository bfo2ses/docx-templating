import { TagNode, TextNode } from "./nodes"
import { Tags } from "./enums"
import { Command } from "./Command"
import { INode } from "./types"
import { isEqual, omit, cloneDeepWith } from 'lodash'

const allowedTags = [Tags.FIELD_CHAR, Tags.INSERT_TEXT, Tags.LINE_BREAK, Tags.TEXT]

export class PartialCommand {
    static node: INode
    static parts: { text: string, node: TagNode }[] = []
    static lastStyle?: any

    private static hasCommand() {
        return Command.getInstance().hasCommand(this.parts.map(part => part.text).join(''))
    }

    static init(node: INode) {
        this.node = node
        this.parts = []
    }

    static process() {
        if (this.parts.length >= 1) {
            if (this.hasCommand()) {
                let text = this.parts.map(part => part.text).join('')
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
        this.parts = []
    }

    static add(text: string, node: TagNode) {
        const style = omitDeep(node.children.filter(child => child.tag === Tags.TEXT_CONTAINER_STYLE)[0], ['parent'])

        if (node.tag === Tags.TEXT_CONTAINER) {
            if (!isEqual(this.lastStyle, style) || this.parts.length === 0) {
                PartialCommand.process()
                this.lastStyle = style
                this.parts.push({
                    text: text || '',
                    node
                })
            } else {
                node.ignore = true
                this.parts[this.parts.length - 1].text = this.parts[this.parts.length - 1].text + text
                node.children.filter(child => allowedTags.indexOf(child.tag as Tags) >= 0).forEach(childNode =>
                    this.parts[this.parts.length - 1].node.children.push(childNode)
                )

            }
        }
    }
}

function omitDeep(collection: any, excludeKeys: string[]) {

    function omitFn(value: any) {

        if (value && typeof value === 'object') {
            excludeKeys.forEach((key) => {
                delete value[key];
            });
        }
    }

    return cloneDeepWith(collection, omitFn);
}