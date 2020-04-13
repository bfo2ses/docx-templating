import _ from 'lodash'

export class ForNode implements DOCXTemplating.INode {
    parent: DOCXTemplating.INode
    parentLoop: ForNode | null
    children: DOCXTemplating.INode[]
    parameters: { array: string, item: string }
    ignore: boolean = false

    constructor({ parent, parameters, parentLoop }: Pick<ForNode, 'parent' | 'parameters' | 'parentLoop'>) {
        this.parent = parent
        this.parentLoop = parentLoop
        this.parameters = parameters
        this.children = []
    }

    render(context: DOCXTemplating.Context): string {
        return _.get(context.data, this.parameters.array).map((item: any) => {
            context.data[this.parameters.item] = item
            return this.children.map(node => node.render(context)).join('')
        }).join('')
    }
}