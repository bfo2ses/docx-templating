import { JSZipObject } from 'jszip'
import path from 'path'
import { Files } from './Files'
import { OpenXML } from './OpenXML'
import { RelationshipNode, RelationshipsNode, RootNode } from './nodes'
import { Medias } from './Medias'

export class Word {
    #data: any
    #filePath: string

    constructor(filepath: string) {
        this.#filePath = filepath
    }

    static fromTemplate(filePath: string): Word {
        return new Word(filePath)
    }

    setData(data: any): Word {
        this.#data = data
        return this
    }

    async generate(): Promise<Uint8Array> {
        const files = await Files.from(this.#filePath)
        const promises = files.getXML()
            .map(async (file: JSZipObject) => {
                const medias = new Medias()
                const openXML = await OpenXML.parse(await files.getFile(file.name))
                if (openXML) {
                    files.setTextFile(file.name, openXML.render({ data: this.#data, medias }))
                    await this.addLinks({ medias, file, files })
                }
                return true
            })
        await Promise.all(promises)
        return files.save()
    }

    private async addLinks({ medias, file, files }: { medias: Medias, file: JSZipObject, files: Files }) {
        if (medias.hasLinks()) {
            let rootNode: DOCXTemplating.IRootNode = new RootNode()
            const filepath = `word/_rels/${path.basename(file.name)}.rels`
            try {
                rootNode = await OpenXML.parse(await files.getFile(filepath))
            } catch (e) {
                rootNode.children.push(new RelationshipsNode())
            } finally {
                medias.links.forEach(link => {
                    rootNode?.children[rootNode.children.length - 1].children.push(
                        new RelationshipNode(link)
                    )
                })
                files.setTextFile(filepath, rootNode.render({ data: this.#data, medias }))
            }
        }
        return true
    }

}
