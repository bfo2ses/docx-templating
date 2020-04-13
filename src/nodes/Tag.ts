
export class TagNode implements DOCXTemplating.INode {
    parent: DOCXTemplating.INode
    tag: string | null
    attributes: any
    ignore: boolean = false
    children: DOCXTemplating.INode[]

    constructor({ parent, tag, attributes }: Pick<TagNode, 'parent' | 'attributes' | 'tag'>) {
        this.parent = parent
        this.tag = tag
        this.attributes = attributes
        this.children = []
    }

    render(context: DOCXTemplating.Context): string {
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
        const attributes = Object.keys(this.attributes).reduce((str, key) => str += ` ${key}="${this.attributes[key]}"`, '')
        if (content) {
            return `<${this.tag}${attributes}>${content}</${this.tag}>`
        } else {
            return `<${this.tag}${attributes}/>`
        }
    }
}