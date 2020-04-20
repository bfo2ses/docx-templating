import {VM} from 'vm2'
import _ from 'lodash'
import { INode, Context, IBlockNode } from '../types'

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
        const vm = new VM({
            sandbox: context.data
        })
        const bool = vm.run(this.parameter)
        if (bool) {
            return this.children.map(child => child.render(context)).join('')
        } else {
            return ''
        }

    }
}