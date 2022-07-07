import he from "he"
import { INode, Context, ITagNode } from "../types"
import { Tags } from "../enums"

const skippingTags = [Tags.PROOF, Tags.BOOKMARK_END, Tags.BOOKMARK_START]

export class TagNode implements ITagNode {
    parent: INode
    tag: string | Tags
    attributes: any
    ignore: boolean = false
    children: INode[]

    constructor({ parent, tag, attributes }: Pick<TagNode, 'parent' | 'attributes' | 'tag'>) {
        this.parent = parent
        this.tag = tag
        this.attributes = attributes
        this.children = []
        this.ignore = skippingTags.indexOf(tag as Tags) >= 0
    }

    render(context: Context): string {
        let string = ''
        if (this.ignore) return string

        string += this.createTag(
            this.children
                .reduce(
                    (str, node) => {
                        str += node.render(context)
                        return str
                    },
                    ''
                )
        )
        return string
    }

    createTag(content: string) {
        const attributes = Object.keys(this.attributes).reduce((str, key) => str += ` ${key}="${he.escape(this.attributes[key])}"`, '')
        if (content) {
            return `<${this.tag}${attributes}>${content}</${this.tag}>`
        } else {
            return `<${this.tag}${attributes}/>`
        }
    }
}