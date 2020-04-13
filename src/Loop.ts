import { ForNode } from "./nodes"

export class Loop {
    static current: ForNode | null
    static hasFinished: boolean
    static node?: DOCXTemplating.INode

    static init(node?: ForNode | null) {
        this.current = node || null
        this.hasFinished = false
    }
}