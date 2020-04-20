
import { IMedias, Link } from './types'

export class Medias implements IMedias {
    static instance: Medias | null
    #links: Link[]

    private constructor() {
        this.#links = []
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new Medias()
        }
        return this.instance
    }

    static reset() {
        this.instance = null
    }

    hasLinks(): boolean {
        return this.#links.length > 0
    }
    getLinks() {
        return this.#links
    }

    getLinkId(url: string) {
        const id = `link${this.#links.length + 1}`
        this.#links.push({ id, url })
        return id
    }
}