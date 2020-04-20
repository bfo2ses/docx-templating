import { JSZipObject } from 'jszip'
import path from 'path'
import { Files } from './Files'
import { OpenXML } from './OpenXML'
import { RelationshipNode, RelationshipsNode, RootNode, SubTemplateRootNode } from './nodes'
import { Medias } from './Medias'
import { IRootNode, IMedias, ICommand } from './types'
import { Templates } from './Templates'
import { Command } from './Command'
import { EndBlockCommand, ForCommand, IfCommand, LinkCommand, NumberCommand, ParameterCommand, TableForCommand, TemplateCommand, InlineIfCommand, DateCommand } from "./commands"

export class Word {
    
    #data: any
    #locale: string
    #filePath: string
    #options: any

    private constructor(filepath: string, options: any) {
        this.#filePath = filepath
        this.#options = options
        this.#locale = 'en'
        Command.init([
            EndBlockCommand.getInstance(),
            ForCommand.getInstance(),
            IfCommand.getInstance(),
            LinkCommand.getInstance(),
            NumberCommand.getInstance(),
            ParameterCommand.getInstance(),
            TableForCommand.getInstance(),
            TemplateCommand.getInstance(),
            InlineIfCommand.getInstance(),
            DateCommand.getInstance()
        ])
    }

    static fromTemplate(filePath: string, options: any): Word {
        return new Word(filePath, options)
    }

    setData(data: any): Word {
        this.#data = data
        return this
    }

    setLocale(locale: string): Word {
        this.#locale = locale
        return this
    }

    addCommand(command: ICommand): Word {
        Command.getInstance().add(command)
        return this
    }

    async generate(): Promise<Uint8Array> {
        const files = await Files.from(this.#options.path + this.#filePath)
        const promises = files.getXML()
            .map(async (file: JSZipObject) => {
                Templates.reset()
                Medias.reset()
                const openXML = await OpenXML.parse(await files.readFile(file.name))
                await Templates.getInstance().generateTemplates(this.#options.path)
                if (openXML) {
                    files.writeTextFile(file.name, openXML.render({ data: this.#data, locale: this.#locale }))
                    await this.addLinks({ file, files })
                }
                return true
            })
        await Promise.all(promises)
        return files.save()
    }

    private async addLinks({ file, files }: { file: JSZipObject, files: Files }) {
        if (Medias.getInstance().hasLinks()) {
            let rootNode: IRootNode = new RootNode()
            const filepath = `word/_rels/${path.basename(file.name)}.rels`
            try {
                rootNode = await OpenXML.parse(await files.readFile(filepath))
            } catch (e) {
                rootNode.children.push(new RelationshipsNode())
            } finally {
                Medias.getInstance().getLinks().forEach(link => {
                    rootNode.children[rootNode.children.length - 1].children.push(
                        new RelationshipNode(link)
                    )
                })
                files.writeTextFile(filepath, rootNode.render({ data: this.#data }))
            }
        }
        return true
    }

}