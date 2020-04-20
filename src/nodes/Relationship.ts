import { INode, Context, Link } from '../types'
export class RelationshipNode implements INode {
    id: string
    url: string
    children: any = null
    ignore: boolean = false
    parent: INode

    constructor(link: Link) {
        this.id = link.id
        this.url = link.url
    }

    render(): string {
        return `<Relationship Id="${this.id}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink" Target="${this.url}" TargetMode="External" />`
    }

}