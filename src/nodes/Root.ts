export class RootNode implements DOCXTemplating.IRootNode {
    children: DOCXTemplating.INode[]
    ignore: boolean = false

    constructor() {
        this.children = []
    }

    render(context: any): string {
        return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>${this.children.map(child => child.render(context)).join('')}`
    }

}