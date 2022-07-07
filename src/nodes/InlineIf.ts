import he from 'he'
import { INode, Context } from '../types'
import { Data } from '../utils/Data'

export class InlineIfNode implements INode {
    parent: INode
    children: INode[]
    parameter: string
    trueValue: string
    falseValue: string
    ignore: boolean = false

    constructor({ parent, parameter, trueValue, falseValue }: Pick<InlineIfNode, 'parent' | 'parameter' | 'trueValue' | 'falseValue'>) {
        this.parent = parent
        this.parameter = parameter
        this.trueValue = trueValue
        this.falseValue = falseValue
        this.children = []
    }

    render(context: Context): string {
        const bool = Data.getValue(this.parameter, context.data)
        if (bool) {
            return Data.getValue(this.trueValue, context.data, this.trueValue)
        } else {
            return Data.getValue(this.falseValue, context.data, this.falseValue)
        }

    }
}