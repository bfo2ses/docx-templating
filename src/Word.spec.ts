import { Word } from "./Word"
import { Files } from "./Files"
import { OpenXML } from "./OpenXML"
import { Medias } from "./Medias"
import { Templates } from "./Templates"

describe('Word', () => {
    let fromMock: jest.Mock
    let readMock: jest.Mock
    let writeMock: jest.Mock
    let saveMock: jest.Mock
    let parseMock: jest.Mock
    let renderMock: jest.Mock
    let resetMock: jest.Mock
    let generateMock: jest.Mock

    beforeEach(() => {
        readMock = jest.fn()
        readMock
            .mockResolvedValueOnce('plop')
            .mockRejectedValueOnce('plop')
        writeMock = jest.fn()
        saveMock = jest.fn()
        saveMock.mockResolvedValue('Uint8Array')
        fromMock = jest.fn()
        fromMock.mockResolvedValue({
            getXML: () => [{ name: 'document.xml' }],
            readFile: readMock,
            writeTextFile: writeMock,
            save: saveMock
        })
        Files.from = fromMock
        parseMock = jest.fn()
        renderMock = jest.fn()
        renderMock
            .mockReturnValueOnce('xml')
            .mockReturnValueOnce('links')
        parseMock.mockResolvedValue({
            render: renderMock
        })
        OpenXML.parse = parseMock


        const instanceMock = jest.fn()
        generateMock = jest.fn()
        instanceMock.mockReturnValue({
            generateTemplates: generateMock,
        })
        Templates.getInstance = instanceMock
        resetMock = jest.fn()
        Templates.reset = resetMock
    })

    it('default locale, zero link', async () => {
        const data = { plop: 'plop' }
        const result = await Word
            .fromTemplate('toto', {
                path: 'path'
            })
            .setData(data)
            .generate()

        expect(fromMock).toBeCalledWith('pathtoto')
        expect(readMock).toBeCalledWith('document.xml')
        expect(parseMock).toBeCalledWith('plop')
        expect(renderMock).toBeCalledWith({ data, locale: 'en' })
        expect(writeMock).toBeCalledWith('document.xml', 'xml')
        expect(saveMock).toBeCalled()
        expect(resetMock).toBeCalled()
        expect(generateMock).toBeCalledWith('path')
        expect(result).toBe('Uint8Array')
    })

    it('locale fr, 1 link', async () => {
        const data = { plop: 'plop' }
        const template = Word
            .fromTemplate('toto', {
                path: 'path'
            })
            .setLocale('fr')
            .setData(data)

        Medias.getInstance().getLinkId('toto')
        const result = await template.generate()

        expect(fromMock).toBeCalledWith('pathtoto')
        expect(readMock).toBeCalledWith('document.xml')
        expect(parseMock).toBeCalledWith('plop')
        expect(renderMock).toBeCalledWith({ data, locale: 'fr' })
        expect(writeMock).toBeCalledWith('document.xml', 'xml')
        expect(readMock).toBeCalledWith('word/_rels/document.xml.rels')
        expect(writeMock).toBeCalledWith('word/_rels/document.xml.rels', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="link1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink" Target="toto" TargetMode="External" /></Relationships>')
        expect(saveMock).toBeCalled()
        expect(resetMock).toBeCalled()
        expect(generateMock).toBeCalledWith('path')
        expect(result).toBe('Uint8Array')
    })
})