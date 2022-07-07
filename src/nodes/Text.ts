import he from 'he'
import { INode, ITextNode } from '../types'

export class TextNode implements ITextNode {
    parent: INode
    children: INode[]
    text: string
    ignore: boolean = false

    constructor({ parent, text }: Pick<TextNode, 'parent' | 'text'>) {
        this.parent = parent
        this.text = text
        this.children = []
    }

    render(): string {
        return he.escape(this.text)
    }
}