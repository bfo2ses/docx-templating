import _ from 'lodash'
import { ICommand, INode } from "../types"
import { TextNode, LinkNode, LinkWrapperNode } from "../nodes"
import { Tags } from '../enums'

export class LinkCommand implements ICommand {
    private readonly REGEXP = /([^{=}]*){L=([^\s!]+)}(.*)/g
    static instance: LinkCommand

    static getInstance() {
        if (!this.instance) {
            this.instance = new LinkCommand()
        }
        return this.instance
    }

    is(text: string): boolean {
        return new RegExp(this.REGEXP).test(text)
    }

    process(text: string, node: INode): string {
        const regexp = new RegExp(this.REGEXP)
        const result = regexp.exec(text)
        if (node.parent?.parent) {
            const nodes = []
            if (result) {
                if (result[1].length) {
                    const wrapper1 = _.clone(node.parent)
                    wrapper1.ignore = false
                    const node1 = _.clone(node)
                    node1.ignore = false
                    node1.children = [new TextNode({ parent: node1, text: result[1] })]
                    wrapper1.children = [...wrapper1.children.filter(n => n.tag !== Tags.TEXT), node1]
                    nodes.push(
                        wrapper1
                    )
                }

                const wrapper = new LinkWrapperNode({
                    parent: node.parent.parent,
                    parameter: result[2]
                })
                const wrapperLink = _.clone(node.parent)
                wrapperLink.ignore = false
                const nodeLink = _.clone(node)
                nodeLink.ignore = false
                nodeLink.children = [new LinkNode({ parent: nodeLink, parameter: result[2] })]
                wrapperLink.children = [...wrapperLink.children.filter(n => n.tag !== Tags.TEXT), nodeLink]
                wrapperLink.parent = wrapper
                wrapper.children = [wrapperLink]
                nodes.push(
                    wrapper
                )

                node.parent.ignore = node.ignore = true
                nodes.forEach(n => {
                    node.parent?.parent?.children.push(n)
                })
                return result[3]
            }
        }
        return ''
    }

}