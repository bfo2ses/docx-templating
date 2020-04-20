import { INode, IBlockNode } from './types'

export class Block {
    static current: IBlockNode | null
    static hasFinished: boolean
    static node: INode | null

    static init(node?: IBlockNode | null) {
        this.current = node || null
        this.hasFinished = false
    }
}