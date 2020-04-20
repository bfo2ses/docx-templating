import { Tags } from "./enums"

export type Options = {
    numberFormat?: {

    }
    path: string
}

export interface INode {
    parent: INode
    tag?: string | Tags
    children: INode[]
    ignore: boolean
    render(context: Context): string
}

export interface ITagNode extends INode {
    parent: INode
    tag: string | Tags
    children: INode[]
}

export interface IBlockNode extends INode {
    parent: INode
    parentBlock: IBlockNode | null
}

export interface IRootNode extends INode {
    parent: INode
}

export interface ILinkNode extends INode {
    id: string
    url: string

    render(): string
}

export interface ITextNode extends INode {
    text: string
}

export type Context = {
    locale?: string,
    data: any
}

export interface ICommand {
    is(text: string): boolean
    process(text: string, node: INode): string
}

export interface IMedias {
    getLinkId(url: string): string
    hasLinks(): boolean
    getLinks(): Link[]
}

export type Link = {
    id: string
    url: string
}
