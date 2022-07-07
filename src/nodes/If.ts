import { INode, Context } from '../types'
import { Data } from '../utils/Data'

export class IfNode implements INode {
    parent: INode
    children: INode[]
    parameter: string
    ignore: boolean = false

    constructor({ parent, parameter }: Pick<IfNode, 'parent' | 'parameter'>) {
        this.parent = parent
        this.parameter = parameter
        this.children = []
    }

    render(context: Context): string {
        const bool = Data.getValue(this.parameter, context.data)
        if (bool) {
            return this.children.map(child => child.render(context)).join('')
        } else {
            return ''
        }

    }
}