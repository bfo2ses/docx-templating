import _ from 'lodash'
import { INode, Context, IBlockNode } from '../types'
import { Data } from '../utils/Data'

export class ForNode implements INode {
    parent: INode
    children: INode[]
    parameters: { array: string, item: string }
    ignore: boolean = false

    constructor({ parent, parameters }: Pick<ForNode, 'parent' | 'parameters'>) {
        this.parent = parent
        this.parameters = parameters
        this.children = []
    }

    render(context: Context): string {
        const value = Data.getValue(this.parameters.array, context.data, [])
        return value.map((item: any) => {
            context.data[this.parameters.item] = item
            return this.children.map(node => node.render(context)).join('')
        }).join('')
    }
}