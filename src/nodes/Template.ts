import _ from 'lodash'
import { INode, Context } from '../types'
import { Templates } from '../Templates'

export class TemplateNode implements INode {
    parent: INode
    children: INode[]
    ignore: boolean = false
    file: string

    constructor({ parent, file }: Pick<TemplateNode, 'parent' | 'file'>) {
        this.parent = parent
        this.file = file
        this.children = []
        Templates.getInstance().add(file)
    }

    render(context: Context): string {
        return Templates.getInstance().get(this.file).render(context)
    }
}