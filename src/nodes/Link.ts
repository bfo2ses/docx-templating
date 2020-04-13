import _ from 'lodash'

export class LinkNode implements DOCXTemplating.INode {
    parent: DOCXTemplating.INode
    children: DOCXTemplating.INode[]
    ignore: boolean = false
    parameter: string

    constructor({ parent, parameter }: Pick<LinkNode, 'parent' | 'parameter'>) {
        this.parent = parent
        this.parameter = parameter
        this.children = []
    }

    render(context: DOCXTemplating.Context): string {
        const param = _.get(context.data, this.parameter)
        return `<w:hyperlink r:id="${context.medias.getLinkId(param.url)}"><w:r><w:t>${param.text || param.url}</w:t></w:r></w:hyperlink>`
    }
}