import JSZip, { JSZipObject } from "jszip"
import { readFile } from "fs-extra"

export class Files {
    #zip: JSZip

    static async from(filePath: string) {
        const files = new Files()
        const buffer = await readFile(filePath)
        files.#zip = await JSZip.loadAsync(buffer)
        return files
    }

    getXML() {
        return this.#zip.filter((path) => /word\/(document|footer([0-9]*)|header([0-9]*))+.xml/.test(path))
    }

    async getXMLForSubTemplate() {
        return this.readFile('word/document.xml')
    }

    async readFile(filePath: string): Promise<string> {
        return this.#zip.file(filePath).async('text')
    }

    writeTextFile(filePath: string, data: string | number[] | Uint8Array | ArrayBuffer | Blob | NodeJS.ReadableStream) {
        this.writeFile(filePath, data)
    }

    async save(): Promise<Uint8Array> {
        return this.#zip.generateAsync({
            type: 'uint8array',
            compression: 'DEFLATE',
            compressionOptions: { level: 1 }
        })
    }

    private writeFile(filePath: string, data: string | number[] | Uint8Array | ArrayBuffer | Blob | NodeJS.ReadableStream, options?: JSZip.JSZipFileOptions): void {
        this.#zip.file(filePath, data, options)
    }
}