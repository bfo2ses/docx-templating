export class RelationshipNode implements DOCXTemplating.INode {
    id: string
    url: string
    children: any = null
    ignore: boolean = false
    parent: DOCXTemplating.INode

    constructor(link: DOCXTemplating.Link) {
        this.id = link.id
        this.url = link.url
    }

    render(): string {
        return `<Relationship Id="${this.id}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink" Target="${this.url}" TargetMode="External" />`
    }

}