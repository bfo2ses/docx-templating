export class TextNode implements DOCXTemplating.ITextNode {
    parent: DOCXTemplating.INode
    children: DOCXTemplating.INode[]
    text: string
    ignore: boolean = false

    constructor({ parent, text }: Pick<TextNode, 'parent' | 'text'>) {
        this.parent = parent
        this.text = text
        this.children = []
    }

    render(): string {
        return this.text
    }
}