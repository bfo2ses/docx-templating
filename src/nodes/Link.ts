import he from 'he'
import { INode, Context } from '../types'
import { Data } from '../utils/Data'

export class LinkNode implements INode {
    parent: INode
    children: INode[]
    ignore: boolean = false
    parameter: string

    constructor({ parent, parameter }: Pick<LinkNode, 'parent' | 'parameter'>) {
        this.parent = parent
        this.parameter = parameter
        this.children = []
    }

    render(context: Context): string {
        const param = Data.getValue(this.parameter, context.data)
        return he.escape(param.text || param.url)
    }
}