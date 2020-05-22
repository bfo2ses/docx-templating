import { INode, Context } from '../types'
import { Data } from '../utils/Data'
import he from 'he'

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
        const val = Data.getValue(this.parameter, context.data)
        return he.escape(val.toString())
    }
}