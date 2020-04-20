import { INode, Context } from '../types'
import { Data } from '../utils/Data'

export class ParameterNode implements INode {
    parent: INode
    ignore: boolean = false
    children: INode[]
    parameter: string

    constructor({ parent, parameter }: Pick<ParameterNode, 'parent' | 'parameter'>) {
        this.parent = parent
        this.parameter = parameter
        this.children = []
    }

    render(context: Context): string {
        return Data.getValue(this.parameter, context.data)
    }
}