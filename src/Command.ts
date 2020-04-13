import _ from 'lodash'

import { PartialCommand } from "./PartialCommand"
import { ForNode, TextNode, LinkNode, ParameterNode } from "./nodes"
import { Loop } from './Loop'

enum CommandTypes {
    PARAMETER = 'Parameter',
    LINK = 'Link',
    FOR = 'For',
    ENDFOR = 'EndFor',
    TABLEFOR = 'TableFor',
    ENDTABLEFOR = 'EndTableFor'
}

export class Command {
    private static readonly PARAMETER_REGEXP = /([^{=}]*){=([^\s!]+)}([^{=}]*)/g
    private static readonly FOR_REGEXP = /^{F=([^\s!]+) in ([^\s!]+)}$/g
    private static readonly TABLE_FOR_REGEXP = /^{TF=([^\s!]+) in ([^\s!]+)}$/g
    private static readonly LINK_REGEXP = /([^{=}]*){L=([^\s!]+)}([^{=}]*)/g


    static typeOfCommand(text: string): string | null {
        if (new RegExp(this.PARAMETER_REGEXP).test(text)) {
            return CommandTypes.PARAMETER
        } else if (new RegExp(this.LINK_REGEXP).test(text)) {
            return CommandTypes.LINK
        } else if (new RegExp(this.FOR_REGEXP).test(text)) {
            return CommandTypes.FOR
        } else if (/{\/F}/g.test(text)) {
            return CommandTypes.ENDFOR
        } else if (new RegExp(this.TABLE_FOR_REGEXP).test(text)) {
            return CommandTypes.TABLEFOR
        } else if (/{\/TF}/g.test(text)) {
            return CommandTypes.ENDTABLEFOR
        } else {
            return null
        }
    }

    static process(text: string, node: DOCXTemplating.INode) {
        switch (Command.typeOfCommand(text)) {
            case CommandTypes.PARAMETER:
                Command.processParameter(text, node)
                break
            case CommandTypes.LINK:
                Command.processLink(text, node)
                break
            case CommandTypes.FOR:
                Command.processFor(text, node)
                break
            case CommandTypes.TABLEFOR:
                Command.processTableFor(text, node)
                break
            case CommandTypes.ENDFOR:
            case CommandTypes.ENDTABLEFOR:
                Command.processEndFor()
                break
            default:
                break

        }
        PartialCommand.init(node)
    }

    private static processFor(text: string, node: DOCXTemplating.INode) {
        const result = new RegExp(this.FOR_REGEXP).exec(text)
        if (result) {
            const parent = node.parent?.parent?.parent || node
            parent.children[parent.children.length - 1].ignore = true
            const newNode = new ForNode({
                parent,
                parentLoop: Loop.current,
                parameters: {
                    array: result[2],
                    item: result[1]
                }
            })
            parent.children.push(
                newNode
            )
            Loop.init(newNode)
        }
    }

    private static processEndFor() {
        if (!!Loop.current) {
            Loop.current.children[Loop.current.children.length - 1].ignore = true
            Loop.hasFinished = true
        }
    }

    private static processTableFor(text: string, node: DOCXTemplating.INode) {
        const result = new RegExp(this.TABLE_FOR_REGEXP).exec(text)
        if (result) {
            const tr = node.parent?.parent?.parent?.parent
            if (tr) {
                const parent = tr?.parent || node
                tr.ignore = true
                const newNode = new ForNode({
                    parent,
                    parentLoop: Loop.current,
                    parameters: {
                        array: result[2],
                        item: result[1]
                    }
                })
                parent.children.push(
                    newNode
                )
                Loop.current = newNode
            }
        }
    }

    private static processLink(text: string, node: DOCXTemplating.INode) {
        let result
        if (node.parent?.parent) {
            const nodes = []
            while ((result = this.LINK_REGEXP.exec(text)) !== null) {
                if (result.index === this.LINK_REGEXP.lastIndex) {
                    this.LINK_REGEXP.lastIndex++
                }
                if (result[1].length) {
                    const wrapper1 = _.clone(node.parent)
                    const node1 = _.clone(node)
                    node1.children = [new TextNode({ parent: node1, text: result[1] })]
                    wrapper1.children = [node1]
                    nodes.push(
                        wrapper1
                    )
                }

                nodes
                    .push(new LinkNode({ parent: node.parent, parameter: result[2] }))

                if (result[3].length) {
                    const wrapper2 = _.clone(node.parent)
                    const node2 = _.clone(node)
                    node2.children = [new TextNode({ parent: node2, text: result[3] })]
                    wrapper2.children = [node2]
                    nodes
                        .push(wrapper2)
                }
            }
            node.parent.ignore = node.ignore = true
            nodes.forEach(n => {
                node.parent?.parent?.children.push(n)
            })
        }
    }

    private static processParameter(text: string, node: DOCXTemplating.INode) {
        let result
        const regex = new RegExp(this.PARAMETER_REGEXP)
        while ((result = regex.exec(text)) !== null) {
            if (result.index === regex.lastIndex) {
                regex.lastIndex++
            }
            node.children.push(
                new TextNode({ parent: node, text: result[1] })
            )
            node.children.push(
                new ParameterNode({ parent: node, parameter: result[2] })
            )
            node.children.push(
                new TextNode({ parent: node, text: result[3] })
            )
        }
    }
}