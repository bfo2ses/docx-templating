import sax from 'sax'
import _ from 'lodash'
import { RootNode, TextNode, TagNode, SubTemplateRootNode } from './nodes'
import { PartialCommand } from './PartialCommand'
import { Text } from './Text'
import { IRootNode } from './types'
import { Tags } from './enums'
import { Node } from './Node'
import { Medias } from './Medias'

export class OpenXML {

    static async parseForSubTemplate(template: string) {
        const node = await this.parse(template)
        const root = new SubTemplateRootNode()
        const allowedTags = [Tags.PARAGRAPH, Tags.TABLE]
        root.children = node.children.filter(c => c.tag === Tags.DOCUMENT)[0].children.filter(c => c.tag === Tags.BODY)[0].children.filter(child => child instanceof TagNode ? allowedTags.indexOf(child.tag as Tags) >= 0 : true)
        return root
    }

    static async parse(xml: string): Promise<IRootNode> {
        Node.reset()
        const file = xml

        const parser = sax.parser(true, {
            trim: false,
            normalize: false
        })

        const rootNode = new RootNode()
        Node.getInstance().setCurrent(rootNode)

        return new Promise(async (resolve, reject) => {
            parser.onopentag = (tag) => {
                const node = new TagNode({
                    parent: Node.getInstance().getCurrent(),
                    tag: tag.name,
                    attributes: tag.attributes,
                })

                if (tag.name === Tags.PARAGRAPH) {
                    PartialCommand.init(node)
                }

                Node.getInstance().addChild(node)
                Node.getInstance().setCurrent(node)
            }
            parser.onclosetag = (tag) => {
                if (Tags.PARAGRAPH === tag) {
                    PartialCommand.process()
                } else {
                    if (Node.getInstance().getCurrent() instanceof TagNode) PartialCommand.add(Text.current, Node.getInstance().getCurrent() as TagNode)
                    if (Node.getInstance().getCurrent().tag !== Tags.TEXT) Text.current = ''
                }
                Node.getInstance().setParentAsCurrent()
            }
            parser.ontext = text => {
                Text.current += text
                Node.getInstance().addChild(
                    new TextNode({
                        parent: Node.getInstance().getCurrent(),
                        text
                    })
                )
            }
            parser.onend = () => {
                resolve(rootNode)
            }
            parser.write(file)
            parser.end()
        })
    }
}
