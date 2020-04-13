import _ from 'lodash'

export class ParameterNode implements DOCXTemplating.INode {
    parent: DOCXTemplating.INode
    ignore: boolean = false
    children: DOCXTemplating.INode[]
    parameter: string

    constructor({ parent, parameter }: Pick<ParameterNode, 'parent' | 'parameter'>) {
        this.parent = parent
        this.parameter = parameter
        this.children = []
    }

    render(context: DOCXTemplating.Context): string {
        return _.get(context.data, this.parameter)
    }
}