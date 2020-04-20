import { SubTemplateRootNode } from "./nodes";
import { Files } from "./Files";
import { OpenXML } from "./OpenXML";

export class Templates {
    static instance: Templates | null
    #templateFiles: string[]
    #templates: { [key: string]: SubTemplateRootNode }

    private constructor() {
        this.#templates = {}
        this.#templateFiles = []
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new Templates()
        }
        return this.instance
    }

    static reset() {
        this.instance = null
    }

    add(filePath: string) {
        this.#templateFiles.push(filePath)
    }

    get(filePath: string) {
        return this.#templates[filePath]
    }

    async generateTemplates(path: string) {
        if (this.#templateFiles.length > 0) {
            const promisesT = this.#templateFiles.map(async (filePath) => {
                this.#templates[filePath] = await this.buildSubTemplateXML(path + filePath)
                return
            })
            await Promise.all(promisesT)
        }
        return
    }


    private async buildSubTemplateXML(filePath: string): Promise<SubTemplateRootNode> {
        const files = await Files.from(filePath)
        const file = await files.getXMLForSubTemplate()
        return OpenXML.parseForSubTemplate(file)
    }

}