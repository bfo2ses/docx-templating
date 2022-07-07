import _ from 'lodash'
import { INode, Context } from '../types'
import { Data } from '../utils/Data'
import { Medias } from '../Medias'

export class LinkWrapperNode implements INode {
    parent: INode
    children: INode[]
    ignore: boolean = false
    parameter: string

    constructor({ parent, parameter }: Pick<LinkWrapperNode, 'parent' | 'parameter'>) {
        this.parent = parent
        this.parameter = parameter
        this.children = []
    }

    render(context: Context): string {
        const link = Data.getValue(this.parameter, context.data)
        return `<w:hyperlink r:id="${Medias.getInstance().getLinkId(link.url)}">${this.children.map(c => c.render(context)).join('')}</w:hyperlink>`
    }
}