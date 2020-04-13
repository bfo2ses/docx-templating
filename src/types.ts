namespace DOCXTemplating {

    export type Options = {
        tagParameter: { start: string, end: string }
        tagLoop: { start: string, end: string }
        tagImage: { start: string, end: string }
        tagLink: { start: string, end: string }
    }

    export interface INode {
        parent?: DOCXTemplating.INode
        children: DOCXTemplating.INode[]
        ignore: boolean
        render(context: Context): string
    }

    export interface IRootNode extends DOCXTemplating.INode {
        children: DOCXTemplating.INode[]
    }

    export interface ILinkNode extends DOCXTemplating.INode {
        id: string
        url: string

        render(): string
    }

    export interface WordNode extends DOCXTemplating.INode {
        tag: string | null
        attributes: any

        createTag(content: string): string
    }

    export interface ITextNode extends DOCXTemplating.INode {
        text: string
    }

    export type Context = {
        data: any
        medias: DOCXTemplating.IMedias
    }

    export interface IMedias {
        getLinkId(url: string): string
    }

    export type Link = {
        id: string
        url: string
    }
}
