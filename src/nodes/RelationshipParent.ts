import { RelationshipNode } from "./Relationship"
import { INode } from '../types'

export class RelationshipsNode implements INode {
    parent: INode
    children: RelationshipNode[] = []
    ignore: boolean = false

    render(): string {
        return `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${this.children.map(child => child.render()).join('')}</Relationships>`
    }

}