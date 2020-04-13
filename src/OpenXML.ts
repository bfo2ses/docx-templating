import sax from 'sax'
import _ from 'lodash'
import { ForNode, LinkNode, RootNode, TextNode, ParameterNode, TagNode } from './nodes'
import { Command } from './Command'
import { PartialCommand } from './PartialCommand'
import { Text } from './Text'
import { Loop } from './Loop'
// import { Medias } from './Word'

export enum Tags {
    DOCUMENT = 'w:document',
    BODY = 'w:body',
    TABLE = 'w:tbl',
    TABLE_ROW = 'w:tr',
    TABLE_CELL = 'w:tc',
    TEXT = 'w:t',
    TEXT_CONTAINER = 'w:r',
    PARAGRAPH = 'w:p'
}

export class OpenXML {

    static async parse(xml: string): Promise<DOCXTemplating.IRootNode> {
        const file = xml

        const parser = sax.parser(true, {
            trim: false,
            normalize: false
        })

        Loop.init()
        const rootNode = new RootNode()
        let currentNode: DOCXTemplating.INode = rootNode

        return new Promise(async (resolve, reject) => {
            parser.onopentag = (tag) => {
                const node = new TagNode({
                    parent: currentNode,
                    tag: tag.name,
                    attributes: tag.attributes,
                })

                if (tag.name === Tags.PARAGRAPH) {
                    PartialCommand.init(node)
                }

                currentNode.children.push(
                    node
                )
                currentNode = node
                Loop.node = node
            }
            parser.onclosetag = () => {
                if (PartialCommand.node === currentNode) {
                    if (PartialCommand.isCommand()) {
                        PartialCommand.node.children.forEach(n => {
                            n.ignore = true
                        })
                        const tr = new TagNode({
                            parent: PartialCommand.node,
                            attributes: {},
                            tag: Tags.TEXT_CONTAINER
                        })
                        const text = new TagNode({
                            parent: tr,
                            attributes: {},
                            tag: Tags.TEXT
                        })
                        tr.children.push(text)
                        PartialCommand.node.children.push(tr)
                        Command.process(PartialCommand.text, text)
                    }
                    PartialCommand.init(currentNode)
                }
                if (Loop.current) {
                    if (Loop.hasFinished) {
                        if (Loop.node?.parent === Loop.current) {
                            currentNode = Loop.current.parent
                            Loop.init(Loop.current.parentLoop)
                        } else {
                            Loop.node = Loop.node?.parent
                            if (currentNode.parent) currentNode = currentNode.parent
                        }
                    } else {
                        if (currentNode.parent === Loop.current.parent) {
                            currentNode = Loop.current
                        } else if (currentNode.parent) {
                            currentNode = currentNode.parent
                        }
                    }
                } else {
                    if (currentNode.parent) {
                        if (currentNode.parent instanceof ForNode) {
                            currentNode = currentNode.parent.parent
                        } else {
                            currentNode = currentNode.parent
                        }
                    }
                }
            }
            parser.ontext = text => {
                if (PartialCommand.node) {
                    PartialCommand.addText(text)
                }
                if (Text.isCommand(text)) {
                    Command.process(text, currentNode)
                } else {
                    currentNode.children.push(
                        new TextNode({
                            parent: currentNode,
                            text
                        })
                    )
                }
            }
            parser.onend = () => {
                resolve(rootNode)
            }
            parser.write(file)
            parser.end()
        })
    }
}
