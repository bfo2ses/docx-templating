
export class Medias implements DOCXTemplating.IMedias {
    #links: DOCXTemplating.Link[] = []
    hasLinks(): boolean {
        return this.#links.length > 0
    }
    get links() {
        return this.#links
    }

    getLinkId(url: string) {
        const id = `link${this.#links.length + 1}`
        this.#links.push({ id, url })
        return id
    }
}