import JSZip from "jszip"
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

    async getFile(filePath: string) {
        return this.#zip.file(filePath).async('text')
    }

    setTextFile(filePath: string, data: string | number[] | Uint8Array | ArrayBuffer | Blob | NodeJS.ReadableStream) {
        this.setFile(filePath, data)
    }
    setBinaryFile(filePath: string, data: string | number[] | Uint8Array | ArrayBuffer | Blob | NodeJS.ReadableStream) {
        this.setFile(filePath, data, { binary: true })
    }
    setBase64File(filePath: string, data: string | number[] | Uint8Array | ArrayBuffer | Blob | NodeJS.ReadableStream) {
        this.setFile(filePath, data, { base64: true })
    }

    save(): Promise<Uint8Array> {
        return this.#zip.generateAsync({
            type: 'uint8array',
            compression: 'DEFLATE',
            compressionOptions: { level: 1 }
        })
    }

    private setFile(filePath: string, data: string | number[] | Uint8Array | ArrayBuffer | Blob | NodeJS.ReadableStream, options?: JSZip.JSZipFileOptions): void {
        this.#zip.file(filePath, data, options)
    }
}