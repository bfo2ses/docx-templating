import { INode, IRootNode } from '../types'
export class SubTemplateRootNode implements IRootNode {
    parent: INode
    children: INode[]
    ignore: boolean = false

    constructor() {
        this.children = []
    }

    render(context: any): string {
        return `${this.children.map(child => child.render(context)).join('')}`
    }

}