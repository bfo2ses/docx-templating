import sinon from 'sinon'
import { OpenXML } from "./OpenXML"
import { Templates } from "./Templates"
import { Command } from "./Command"
import { EndBlockCommand, ForCommand, IfCommand, LinkCommand, NumberCommand, ParameterCommand, TableForCommand, TemplateCommand, InlineIfCommand, DateCommand } from "./commands"
import { Medias } from './Medias'

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

describe('OpenXML', () => {
    beforeEach(() => {
        Medias.reset()
    })

    describe('parser', () => {
        it('should return same thing without command', async () => {
            const template = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><body><w:p><w:r><w:t xml:space="preserve">Test & test</w:t></w:r></w:p></body>`
            const node = await OpenXML.parse(template)

            const xml = node.render({ data: { test: 'Test' } })
            expect(xml).toEqual('<?xml version="1.0" encoding="UTF-8" standalone="yes"?><body><w:p><w:r><w:t xml:space="preserve">Test &amp; test</w:t></w:r></w:p></body>')
        })
        describe('{=}', () => {
            it('should replace a parameter command', async () => {
                const template = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><body><w:p><w:r><w:t xml:space="preserve">{=test}</w:t></w:r></w:p></body>`
                const node = await OpenXML.parse(template)
                const xml = node.render({ data: { test: 'Test' } })
                expect(xml).toEqual('<?xml version="1.0" encoding="UTF-8" standalone="yes"?><body><w:p><w:r><w:t xml:space="preserve">Test</w:t></w:r></w:p></body>')
            })
            it('should replace with an empty string if not found in data', async () => {
                const template = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><body><w:p><w:r><w:t xml:space="preserve">{=test}</w:t></w:r></w:p></body>`
                const node = await OpenXML.parse(template)
                const xml = node.render({ data: { testa: 'Test' } })
                expect(xml).toEqual('<?xml version="1.0" encoding="UTF-8" standalone="yes"?><body><w:p><w:r><w:t xml:space="preserve"/></w:r></w:p></body>')
            })
            it('should replace a simple parameter in at the end of a sentence', async () => {
                const template = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><body><w:p><w:r><w:t xml:space="preserve">blabla {=test}</w:t></w:r></w:p></body>`
                const node = await OpenXML.parse(template)
                const xml = node.render({ data: { test: 'Test' } })
                expect(xml).toEqual('<?xml version="1.0" encoding="UTF-8" standalone="yes"?><body><w:p><w:r><w:t xml:space="preserve">blabla Test</w:t></w:r></w:p></body>')
            })
            it('should replace a simple parameter in a middle of a sentence', async () => {
                const template = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><body><w:p><w:r><w:t xml:space="preserve">blabla {=test} blabla</w:t></w:r></w:p></body>`
                const node = await OpenXML.parse(template)
                const xml = node.render({ data: { test: 'Test' } })
                expect(xml).toEqual('<?xml version="1.0" encoding="UTF-8" standalone="yes"?><body><w:p><w:r><w:t xml:space="preserve">blabla Test</w:t><w:t xml:space="preserve"> blabla</w:t></w:r></w:p></body>')
            })
            it('should replace multiple parameters in a sentence', async () => {
                const template = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><body><w:p><w:r><w:t xml:space="preserve">blabla {=test} blabla {=test} blabla</w:t></w:r></w:p></body>`
                const node = await OpenXML.parse(template)
                const xml = node.render({ data: { test: 'Test' } })
                expect(xml).toEqual('<?xml version="1.0" encoding="UTF-8" standalone="yes"?><body><w:p><w:r><w:t xml:space="preserve">blabla Test</w:t><w:t xml:space="preserve"> blabla Test</w:t><w:t xml:space="preserve"> blabla</w:t></w:r></w:p></body>')
            })
            it('partial simple', async () => {
                const template = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><body><w:p w:rsidR="001D070B" w:rsidRDefault="009A3E0C"><w:r><w:t xml:space="preserve">{</w:t></w:r><w:r w:rsidR="00EB4B5F"><w:t xml:space="preserve">=</w:t></w:r><w:bookmarkStart w:id="0" w:name="_GoBack"/><w:bookmarkEnd w:id="0"/><w:proofErr w:type="spellStart"/><w:r><w:t xml:space="preserve">text</w:t></w:r><w:proofErr w:type="spellEnd"/><w:r><w:t xml:space="preserve">}</w:t></w:r></w:p></body>`
                const node = await OpenXML.parse(template)
                const xml = node.render({ data: { text: 'Test' } })
                expect(xml).toEqual('<?xml version="1.0" encoding="UTF-8" standalone="yes"?><body><w:p w:rsidR="001D070B" w:rsidRDefault="009A3E0C"><w:r><w:t xml:space="preserve">Test</w:t></w:r></w:p></body>')
            })
            it('partial with styles', async () => {
                const template = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><body><w:p w:rsidR="00B2223B" w:rsidRPr="002C51A1" w:rsidRDefault="00B2223B" w:rsidP="00B2223B"><w:pPr><w:pStyle w:val="Corpsdetexte"/><w:spacing w:line="261" w:lineRule="exact"/><w:rPr><w:rFonts w:asciiTheme="minorHAnsi" w:hAnsiTheme="minorHAnsi" w:cstheme="minorHAnsi"/><w:b/><w:bCs/></w:rPr></w:pPr><w:bookmarkStart w:id="16" w:name="OLE_LINK13"/><w:bookmarkStart w:id="17" w:name="OLE_LINK14"/><w:r w:rsidRPr="002C51A1"><w:rPr><w:rFonts w:asciiTheme="minorHAnsi" w:hAnsiTheme="minorHAnsi" w:cstheme="minorHAnsi"/><w:b/><w:bCs/></w:rPr><w:t xml:space="preserve">Part for {=</w:t></w:r><w:proofErr w:type="spellStart"/><w:proofErr w:type="gramStart"/><w:r w:rsidRPr="002C51A1"><w:rPr><w:rFonts w:asciiTheme="minorHAnsi" w:hAnsiTheme="minorHAnsi" w:cstheme="minorHAnsi"/><w:b/><w:bCs/></w:rPr><w:t xml:space="preserve">text</w:t></w:r><w:proofErr w:type="spellEnd"/><w:proofErr w:type="gramEnd"/><w:r w:rsidRPr="002C51A1"><w:rPr><w:rFonts w:asciiTheme="minorHAnsi" w:hAnsiTheme="minorHAnsi" w:cstheme="minorHAnsi"/><w:b/><w:bCs/></w:rPr><w:t xml:space="preserve">}</w:t></w:r><w:bookmarkEnd w:id="16"/><w:bookmarkEnd w:id="17"/></w:p></body>`
                const node = await OpenXML.parse(template)
                const xml = node.render({ data: { text: 'Test' } })
                expect(xml).toEqual('<?xml version="1.0" encoding="UTF-8" standalone="yes"?><body><w:p w:rsidR="00B2223B" w:rsidRPr="002C51A1" w:rsidRDefault="00B2223B" w:rsidP="00B2223B"><w:pPr><w:pStyle w:val="Corpsdetexte"/><w:spacing w:line="261" w:lineRule="exact"/><w:rPr><w:rFonts w:asciiTheme="minorHAnsi" w:hAnsiTheme="minorHAnsi" w:cstheme="minorHAnsi"/><w:b/><w:bCs/></w:rPr></w:pPr><w:bookmarkStart w:id="16" w:name="OLE_LINK13"/><w:bookmarkStart w:id="17" w:name="OLE_LINK14"/><w:r w:rsidRPr="002C51A1"><w:rPr><w:rFonts w:asciiTheme="minorHAnsi" w:hAnsiTheme="minorHAnsi" w:cstheme="minorHAnsi"/><w:b/><w:bCs/></w:rPr><w:t xml:space="preserve">Part for Test</w:t></w:r></w:p></body>')
            })
        })
        describe('LINK {L=}', () => {
            it('one', async () => {
                const template = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><body><w:p><w:r><w:t xml:space="preserve">This is an external link to {L=link}</w:t></w:r></w:p></body>`
                const node = await OpenXML.parse(template)
                const xml = node.render({ data: { link: { url: 'https://google.com' } } })
                expect(xml).toEqual(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><body><w:p><w:r><w:t xml:space="preserve">This is an external link to </w:t></w:r><w:hyperlink r:id="link1"><w:r><w:t xml:space="preserve">https://google.com</w:t></w:r></w:hyperlink></w:p></body>`)
            })
            it('with styles', async () => {
                const template = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><body><w:p><w:r><w:pPr><w:rPr><w:b/><w:bCs/></w:rPr></w:pPr><w:t xml:space="preserve">This is an external link to {L=link}</w:t></w:r></w:p></body>`
                const node = await OpenXML.parse(template)
                const xml = node.render({ data: { link: { text: 'Google & co', url: 'https://google.com' } } })
                expect(xml).toEqual(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><body><w:p><w:r><w:pPr><w:rPr><w:b/><w:bCs/></w:rPr></w:pPr><w:t xml:space="preserve">This is an external link to </w:t></w:r><w:hyperlink r:id="link1"><w:r><w:pPr><w:rPr><w:b/><w:bCs/></w:rPr></w:pPr><w:t xml:space="preserve">Google &amp; co</w:t></w:r></w:hyperlink></w:p></body>`)
            })
            it('multiple', async () => {
                const template = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><body><w:p><w:r><w:t xml:space="preserve">This is an external link to {L=link1} or {L=link2}</w:t></w:r></w:p></body>`
                const node = await OpenXML.parse(template)
                const xml = node.render({ data: { link1: { url: 'https://google.com' }, link2: { text: 'Google', url: 'https://google.com' } } })
                expect(xml).toEqual(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><body><w:p><w:r><w:t xml:space="preserve">This is an external link to </w:t></w:r><w:hyperlink r:id="link1"><w:r><w:t xml:space="preserve">https://google.com</w:t></w:r></w:hyperlink><w:r><w:t xml:space="preserve"> or </w:t></w:r><w:hyperlink r:id="link2"><w:r><w:t xml:space="preserve">Google</w:t></w:r></w:hyperlink></w:p></body>`)
            })
        })
        describe('IF {IF=}', () => {
            it('block =', async () => {
                const template = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><body><w:p><w:r><w:t xml:space="preserve">{IF=document.text == 'Microsoft'}</w:t></w:r></w:p><w:p><w:r><w:t xml:space="preserve">This is Microsoft</w:t></w:r></w:p><w:p><w:r><w:t xml:space="preserve">{/IF}</w:t></w:r></w:p></body>`
                const node = await OpenXML.parse(template)
                const xml = node.render({ data: { document: { text: 'Microsoft' } } })
                expect(xml).toEqual(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><body><w:p><w:r><w:t xml:space="preserve">This is Microsoft</w:t></w:r></w:p></body>`)
            })
            it('block !=', async () => {
                const template = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><body><w:p><w:r><w:t xml:space="preserve">{IF=document.text != 'Microsoft'}</w:t></w:r></w:p><w:p><w:r><w:t xml:space="preserve">This is not Microsoft</w:t></w:r></w:p><w:p><w:r><w:t xml:space="preserve">{/IF}</w:t></w:r></w:p></body>`
                const node = await OpenXML.parse(template)
                const xml = node.render({ data: { document: { text: 'Google' } } })
                expect(xml).toEqual(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><body><w:p><w:r><w:t xml:space="preserve">This is not Microsoft</w:t></w:r></w:p></body>`)
            })
            it('block &&', async () => {
                const template = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><body><w:p><w:r><w:t xml:space="preserve">{IF=document.text != 'Microsoft' &amp;&amp; document.text != 'Google'}</w:t></w:r></w:p><w:p><w:r><w:t xml:space="preserve">This is not Microsoft nor Google</w:t></w:r></w:p><w:p><w:r><w:t xml:space="preserve">{/IF}</w:t></w:r></w:p></body>`
                const node = await OpenXML.parse(template)
                const xml = node.render({ data: { document: { text: 'Facebook' } } })
                expect(xml).toEqual(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><body><w:p><w:r><w:t xml:space="preserve">This is not Microsoft nor Google</w:t></w:r></w:p></body>`)
            })
            it('inline =', async () => {
                const template = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><body><w:p><w:r><w:t xml:space="preserve">{IF=(document.text == 'Microsoft',= This is Microsoft)}</w:t></w:r></w:p></body>`
                const node = await OpenXML.parse(template)
                const xml = node.render({ data: { document: { text: 'Microsoft' } } })
                expect(xml).toEqual(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><body><w:p><w:r><w:t xml:space="preserve">This is Microsoft</w:t></w:r></w:p></body>`)
            })
            it('inline !=', async () => {
                const template = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><body><w:p><w:r><w:t xml:space="preserve">{IF=(document.text != 'Microsoft',=This is not Microsoft)}</w:t></w:r></w:p></body>`
                const node = await OpenXML.parse(template)
                const xml = node.render({ data: { document: { text: 'Google' } } })
                expect(xml).toEqual(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><body><w:p><w:r><w:t xml:space="preserve">This is not Microsoft</w:t></w:r></w:p></body>`)
            })
            it('inline &&', async () => {
                const template = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><body><w:p><w:r><w:t xml:space="preserve">{IF=(document.text != 'Microsoft' &amp;&amp; document.text != 'Google',= This is not Microsoft nor Google)}</w:t></w:r></w:p></body>`
                const node = await OpenXML.parse(template)
                const xml = node.render({ data: { document: { text: 'Facebook' } } })
                expect(xml).toEqual(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><body><w:p><w:r><w:t xml:space="preserve">This is not Microsoft nor Google</w:t></w:r></w:p></body>`)
            })
            it('inline multiple', async () => {
                const template = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><body><w:p w:rsidR="00B2223B" w:rsidRPr="00EE4ABE" w:rsidRDefault="00B2223B" w:rsidP="00B2223B"><w:pPr><w:pStyle w:val="Corpsdetexte"/><w:spacing w:after="120" w:line="262" w:lineRule="exact"/><w:rPr><w:rFonts w:asciiTheme="minorHAnsi" w:hAnsiTheme="minorHAnsi" w:cstheme="minorHAnsi"/><w:w w:val="105"/></w:rPr></w:pPr><w:r w:rsidRPr="00EE4ABE"><w:rPr><w:rFonts w:asciiTheme="minorHAnsi" w:hAnsiTheme="minorHAnsi" w:cstheme="minorHAnsi"/><w:w w:val="105"/></w:rPr><w:t>Description: {</w:t></w:r><w:r w:rsidR="000E5C76"><w:rPr><w:rFonts w:asciiTheme="minorHAnsi" w:hAnsiTheme="minorHAnsi" w:cstheme="minorHAnsi"/><w:w w:val="105"/></w:rPr><w:t>IF</w:t></w:r><w:r w:rsidRPr="00EE4ABE"><w:rPr><w:rFonts w:asciiTheme="minorHAnsi" w:hAnsiTheme="minorHAnsi" w:cstheme="minorHAnsi"/><w:w w:val="105"/></w:rPr><w:t>=</w:t></w:r><w:r w:rsidR="000E5C76"><w:rPr><w:rFonts w:asciiTheme="minorHAnsi" w:hAnsiTheme="minorHAnsi" w:cstheme="minorHAnsi"/><w:w w:val="105"/></w:rPr><w:t>(</w:t></w:r><w:proofErr w:type="spellStart"/><w:r w:rsidR="000E5C76"><w:rPr><w:rFonts w:asciiTheme="minorHAnsi" w:hAnsiTheme="minorHAnsi" w:cstheme="minorHAnsi"/><w:w w:val="105"/></w:rPr><w:t>test</w:t></w:r><w:proofErr w:type="spellEnd"/><w:r w:rsidR="000E5C76"><w:rPr><w:rFonts w:asciiTheme="minorHAnsi" w:hAnsiTheme="minorHAnsi" w:cstheme="minorHAnsi"/><w:w w:val="105"/></w:rPr><w:t xml:space="preserve"> == </w:t></w:r><w:r w:rsidR="00E64803" w:rsidRPr="00E64803"><w:rPr><w:rFonts w:asciiTheme="minorHAnsi" w:hAnsiTheme="minorHAnsi" w:cstheme="minorHAnsi"/><w:w w:val="105"/></w:rPr><w:t>'</w:t></w:r><w:bookmarkStart w:id="13" w:name="_GoBack"/><w:bookmarkEnd w:id="13"/><w:r w:rsidR="000E5C76"><w:rPr><w:rFonts w:asciiTheme="minorHAnsi" w:hAnsiTheme="minorHAnsi" w:cstheme="minorHAnsi"/><w:w w:val="105"/></w:rPr><w:t>Google</w:t></w:r><w:r w:rsidR="00E64803" w:rsidRPr="00E64803"><w:rPr><w:rFonts w:asciiTheme="minorHAnsi" w:hAnsiTheme="minorHAnsi" w:cstheme="minorHAnsi"/><w:w w:val="105"/></w:rPr><w:t>'</w:t></w:r><w:r w:rsidR="00010CA3"><w:rPr><w:rFonts w:asciiTheme="minorHAnsi" w:hAnsiTheme="minorHAnsi" w:cstheme="minorHAnsi"/><w:w w:val="105"/></w:rPr><w:t>,= Google & co</w:t></w:r><w:r w:rsidR="00010CA3"><w:rPr><w:rFonts w:asciiTheme="minorHAnsi" w:hAnsiTheme="minorHAnsi" w:cstheme="minorHAnsi"/><w:w w:val="105"/></w:rPr><w:t>,! Microsoft Inc</w:t></w:r><w:r w:rsidR="00010CA3"><w:rPr><w:rFonts w:asciiTheme="minorHAnsi" w:hAnsiTheme="minorHAnsi" w:cstheme="minorHAnsi"/><w:w w:val="105"/></w:rPr><w:t>)</w:t></w:r><w:r w:rsidRPr="00EE4ABE"><w:rPr><w:rFonts w:asciiTheme="minorHAnsi" w:hAnsiTheme="minorHAnsi" w:cstheme="minorHAnsi"/><w:w w:val="105"/></w:rPr><w:t>}</w:t></w:r></w:p></body>`
                const node = await OpenXML.parse(template)
                const xml = node.render({ data: { test: 'Google' } })
                expect(xml).toEqual(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><body><w:p w:rsidR="00B2223B" w:rsidRPr="00EE4ABE" w:rsidRDefault="00B2223B" w:rsidP="00B2223B"><w:pPr><w:pStyle w:val="Corpsdetexte"/><w:spacing w:after="120" w:line="262" w:lineRule="exact"/><w:rPr><w:rFonts w:asciiTheme="minorHAnsi" w:hAnsiTheme="minorHAnsi" w:cstheme="minorHAnsi"/><w:w w:val="105"/></w:rPr></w:pPr><w:r w:rsidRPr="00EE4ABE"><w:rPr><w:rFonts w:asciiTheme="minorHAnsi" w:hAnsiTheme="minorHAnsi" w:cstheme="minorHAnsi"/><w:w w:val="105"/></w:rPr><w:t xml:space="preserve">Description: Google &amp; co</w:t></w:r></w:p></body>`)
            })
            it('should not print if false', async () => {
                const template = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><body><w:p><w:r><w:t xml:space="preserve">{IF=document.text == 'Microsoft'}</w:t></w:r></w:p><w:p><w:r><w:t xml:space="preserve">This is Microsoft</w:t></w:r></w:p><w:p><w:r><w:t xml:space="preserve">{/IF}</w:t></w:r></w:p></body>`
                const node = await OpenXML.parse(template)
                const xml = node.render({ data: { document: { text: 'Google' } } })
                expect(xml).toEqual(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><body/>`)
            })
        })
        describe('FOR {D=}', () => {
            it('format', async () => {
                const template = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><body><w:p><w:r><w:t xml:space="preserve">{D=(test, DD/MM/YYYY)}</w:t></w:r></w:p></body>`
                const node = await OpenXML.parse(template)
                const xml = node.render({ data: { test: '2019-05-27' } })
                expect(xml).toEqual('<?xml version="1.0" encoding="UTF-8" standalone="yes"?><body><w:p><w:r><w:t xml:space="preserve">27/05/2019</w:t></w:r></w:p></body>')
            })
            it('format without date', async () => {
                const fake = sinon.useFakeTimers(1483228800000)
                const template = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><body><w:p><w:r><w:t xml:space="preserve">{D=(now, DD/MM/YYYY)}</w:t></w:r></w:p></body>`
                const node = await OpenXML.parse(template)
                const xml = node.render({ data: { test: '2019-05-27' } })
                expect(xml).toEqual('<?xml version="1.0" encoding="UTF-8" standalone="yes"?><body><w:p><w:r><w:t xml:space="preserve">01/01/2017</w:t></w:r></w:p></body>')
                fake.restore()
            })
            it('format with locale', async () => {
                const template = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><body><w:p><w:r><w:t xml:space="preserve">{D=(test, MMMM)}</w:t></w:r></w:p></body>`
                const node = await OpenXML.parse(template)
                const xml = node.render({ locale: 'fr', data: { test: '2019-05-27' } })
                expect(xml).toEqual('<?xml version="1.0" encoding="UTF-8" standalone="yes"?><body><w:p><w:r><w:t xml:space="preserve">Mai</w:t></w:r></w:p></body>')
            })
            it('partial', async () => {
                const template = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><body><w:p w:rsidR="001D070B" w:rsidRDefault="009A3E0C"><w:r><w:t xml:space="preserve">A date: {D</w:t></w:r><w:r w:rsidR="00EB4B5F"><w:t xml:space="preserve">=</w:t></w:r><w:bookmarkStart w:id="0" w:name="_GoBack"/><w:bookmarkEnd w:id="0"/><w:proofErr w:type="spellStart"/><w:r><w:t xml:space="preserve">(text,</w:t></w:r><w:proofErr w:type="spellEnd"/><w:r><w:t xml:space="preserve">MM-DD-YYYY)}</w:t></w:r></w:p></body>`
                const node = await OpenXML.parse(template)
                const xml = node.render({ data: { text: '2019-05-27' } })
                expect(xml).toEqual('<?xml version="1.0" encoding="UTF-8" standalone="yes"?><body><w:p w:rsidR="001D070B" w:rsidRDefault="009A3E0C"><w:r><w:t xml:space="preserve">A date: 05-27-2019</w:t></w:r></w:p></body>')
            })
        })
        describe('FOR {F=}', () => {
            it('should replace with multiples block in the loop', async () => {
                const template = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><body><w:p><w:r><w:t xml:space="preserve">{F=example IN examples}</w:t></w:r></w:p><w:p><w:r><w:t xml:space="preserve">This is loop {=example}</w:t></w:r></w:p><w:p><w:r><w:t xml:space="preserve">{/F}</w:t></w:r></w:p></body>`
                const node = await OpenXML.parse(template)
                const xml = node.render({ data: { examples: ['one', 'two'] } })
                expect(xml).toEqual(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><body><w:p><w:r><w:t xml:space="preserve">This is loop one</w:t></w:r></w:p><w:p><w:r><w:t xml:space="preserve">This is loop two</w:t></w:r></w:p></body>`)
            })
            it('should replace in a table', async () => {
                const template = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:wpc="http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas" xmlns:cx="http://schemas.microsoft.com/office/drawing/2014/chartex" xmlns:cx1="http://schemas.microsoft.com/office/drawing/2015/9/8/chartex" xmlns:cx2="http://schemas.microsoft.com/office/drawing/2015/10/21/chartex" xmlns:cx3="http://schemas.microsoft.com/office/drawing/2016/5/9/chartex" xmlns:cx4="http://schemas.microsoft.com/office/drawing/2016/5/10/chartex" xmlns:cx5="http://schemas.microsoft.com/office/drawing/2016/5/11/chartex" xmlns:cx6="http://schemas.microsoft.com/office/drawing/2016/5/12/chartex" xmlns:cx7="http://schemas.microsoft.com/office/drawing/2016/5/13/chartex" xmlns:cx8="http://schemas.microsoft.com/office/drawing/2016/5/14/chartex" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:aink="http://schemas.microsoft.com/office/drawing/2016/ink" xmlns:am3d="http://schemas.microsoft.com/office/drawing/2017/model3d" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:wp14="http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:w10="urn:schemas-microsoft-com:office:word" xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml" xmlns:w15="http://schemas.microsoft.com/office/word/2012/wordml" xmlns:w16cid="http://schemas.microsoft.com/office/word/2016/wordml/cid" xmlns:w16se="http://schemas.microsoft.com/office/word/2015/wordml/symex" xmlns:wpg="http://schemas.microsoft.com/office/word/2010/wordprocessingGroup" xmlns:wpi="http://schemas.microsoft.com/office/word/2010/wordprocessingInk" xmlns:wne="http://schemas.microsoft.com/office/word/2006/wordml" xmlns:wps="http://schemas.microsoft.com/office/word/2010/wordprocessingShape" mc:Ignorable="w14 w15 w16se w16cid wp14"><w:body><w:tbl><w:tblPr><w:tblStyle w:val="Grilledutableau"/><w:tblW w:w="0" w:type="auto"/><w:tblLook w:val="04A0" w:firstRow="1" w:lastRow="0" w:firstColumn="1" w:lastColumn="0" w:noHBand="0" w:noVBand="1"/></w:tblPr><w:tblGrid><w:gridCol w:w="4531"/><w:gridCol w:w="4531"/></w:tblGrid><w:tr w:rsidR="001D070B" w:rsidTr="001D070B"><w:tc><w:tcPr><w:tcW w:w="4531" w:type="dxa"/></w:tcPr><w:p w:rsidR="001D070B" w:rsidRDefault="001D070B"><w:r><w:t xml:space="preserve">Un tableau de tableau</w:t></w:r></w:p><w:p w:rsidR="001D070B" w:rsidRDefault="001D070B"/><w:p w:rsidR="001D070B" w:rsidRDefault="001D070B" w:rsidP="00A435CE"><w:r><w:t xml:space="preserve">Un lien</w:t></w:r></w:p><w:p w:rsidR="001D070B" w:rsidRDefault="001D070B"/><w:p w:rsidR="001D070B" w:rsidRDefault="001D070B"><w:r><w:t xml:space="preserve">Un lien dans une </w:t></w:r><w:proofErr w:type="gramStart"/><w:r><w:t xml:space="preserve">boucl</w:t></w:r><w:r w:rsidR="00E33E4D"><w:t xml:space="preserve">e</w:t></w:r><w:r><w:t xml:space="preserve">:</w:t></w:r><w:proofErr w:type="gramEnd"/><w:r><w:t xml:space="preserve"></w:t></w:r></w:p><w:p w:rsidR="00BE2791" w:rsidRDefault="001D070B"><w:r><w:t xml:space="preserve">{F=doc IN documents}</w:t></w:r></w:p><w:p w:rsidR="00BE2791" w:rsidRPr="00BE2791" w:rsidRDefault="00BE2791"><w:pPr><w:rPr><w:b/><w:bCs/></w:rPr></w:pPr><w:bookmarkStart w:id="0" w:name="_GoBack"/><w:r w:rsidRPr="00BE2791"><w:rPr><w:b/><w:bCs/></w:rPr><w:t xml:space="preserve">{=doc.text}</w:t></w:r></w:p><w:bookmarkEnd w:id="0"/><w:p w:rsidR="001D070B" w:rsidRDefault="001D070B"><w:r><w:t xml:space="preserve">{/F}</w:t></w:r></w:p></w:tc><w:tc><w:tcPr><w:tcW w:w="4531" w:type="dxa"/></w:tcPr><w:p w:rsidR="001D070B" w:rsidRDefault="001D070B"><w:r><w:t xml:space="preserve">Un autre texte</w:t></w:r></w:p></w:tc></w:tr></w:tbl><w:p w:rsidR="00E95C5A" w:rsidRDefault="00E95C5A"/><w:sectPr w:rsidR="00E95C5A"><w:headerReference w:type="even" r:id="rId6"/><w:headerReference w:type="default" r:id="rId7"/><w:footerReference w:type="even" r:id="rId8"/><w:footerReference w:type="default" r:id="rId9"/><w:headerReference w:type="first" r:id="rId10"/><w:footerReference w:type="first" r:id="rId11"/><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1417" w:right="1417" w:bottom="1417" w:left="1417" w:header="708" w:footer="708" w:gutter="0"/><w:cols w:space="708"/><w:docGrid w:linePitch="360"/></w:sectPr></w:body></w:document>`
                const node = await OpenXML.parse(template)
                const xml = node.render({
                    data: {
                        lien: {
                            url: 'https://nas.famillefosses.fr',
                            text: 'nas'
                        },
                        documents: [
                            {
                                text: 'Test.txt',
                                url: 'https://bing.com',
                                pj: [
                                    'toto'
                                ]
                            },
                            {
                                text: 'Test2.txt',
                                url: 'https://google.com',
                                pj: [
                                    'tata'
                                ]
                            },
                        ]
                    }
                })
                expect(xml).toEqual(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:wpc="http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas" xmlns:cx="http://schemas.microsoft.com/office/drawing/2014/chartex" xmlns:cx1="http://schemas.microsoft.com/office/drawing/2015/9/8/chartex" xmlns:cx2="http://schemas.microsoft.com/office/drawing/2015/10/21/chartex" xmlns:cx3="http://schemas.microsoft.com/office/drawing/2016/5/9/chartex" xmlns:cx4="http://schemas.microsoft.com/office/drawing/2016/5/10/chartex" xmlns:cx5="http://schemas.microsoft.com/office/drawing/2016/5/11/chartex" xmlns:cx6="http://schemas.microsoft.com/office/drawing/2016/5/12/chartex" xmlns:cx7="http://schemas.microsoft.com/office/drawing/2016/5/13/chartex" xmlns:cx8="http://schemas.microsoft.com/office/drawing/2016/5/14/chartex" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:aink="http://schemas.microsoft.com/office/drawing/2016/ink" xmlns:am3d="http://schemas.microsoft.com/office/drawing/2017/model3d" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:wp14="http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:w10="urn:schemas-microsoft-com:office:word" xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml" xmlns:w15="http://schemas.microsoft.com/office/word/2012/wordml" xmlns:w16cid="http://schemas.microsoft.com/office/word/2016/wordml/cid" xmlns:w16se="http://schemas.microsoft.com/office/word/2015/wordml/symex" xmlns:wpg="http://schemas.microsoft.com/office/word/2010/wordprocessingGroup" xmlns:wpi="http://schemas.microsoft.com/office/word/2010/wordprocessingInk" xmlns:wne="http://schemas.microsoft.com/office/word/2006/wordml" xmlns:wps="http://schemas.microsoft.com/office/word/2010/wordprocessingShape" mc:Ignorable="w14 w15 w16se w16cid wp14"><w:body><w:tbl><w:tblPr><w:tblStyle w:val="Grilledutableau"/><w:tblW w:w="0" w:type="auto"/><w:tblLook w:val="04A0" w:firstRow="1" w:lastRow="0" w:firstColumn="1" w:lastColumn="0" w:noHBand="0" w:noVBand="1"/></w:tblPr><w:tblGrid><w:gridCol w:w="4531"/><w:gridCol w:w="4531"/></w:tblGrid><w:tr w:rsidR="001D070B" w:rsidTr="001D070B"><w:tc><w:tcPr><w:tcW w:w="4531" w:type="dxa"/></w:tcPr><w:p w:rsidR="001D070B" w:rsidRDefault="001D070B"><w:r><w:t xml:space="preserve">Un tableau de tableau</w:t></w:r></w:p><w:p w:rsidR="001D070B" w:rsidRDefault="001D070B"/><w:p w:rsidR="001D070B" w:rsidRDefault="001D070B" w:rsidP="00A435CE"><w:r><w:t xml:space="preserve">Un lien</w:t></w:r></w:p><w:p w:rsidR="001D070B" w:rsidRDefault="001D070B"/><w:p w:rsidR="001D070B" w:rsidRDefault="001D070B"><w:r><w:t xml:space="preserve">Un lien dans une </w:t></w:r><w:proofErr w:type="gramStart"/><w:r><w:t xml:space="preserve">boucl</w:t></w:r><w:r w:rsidR="00E33E4D"><w:t xml:space="preserve">e</w:t></w:r><w:r><w:t xml:space="preserve">:</w:t></w:r><w:proofErr w:type="gramEnd"/><w:r><w:t xml:space="preserve"/></w:r></w:p><w:p w:rsidR="00BE2791" w:rsidRPr="00BE2791" w:rsidRDefault="00BE2791"><w:pPr><w:rPr><w:b/><w:bCs/></w:rPr></w:pPr><w:bookmarkStart w:id="0" w:name="_GoBack"/><w:r w:rsidRPr="00BE2791"><w:rPr><w:b/><w:bCs/></w:rPr><w:t xml:space="preserve">Test.txt</w:t></w:r></w:p><w:bookmarkEnd w:id="0"/><w:p w:rsidR="00BE2791" w:rsidRPr="00BE2791" w:rsidRDefault="00BE2791"><w:pPr><w:rPr><w:b/><w:bCs/></w:rPr></w:pPr><w:bookmarkStart w:id="0" w:name="_GoBack"/><w:r w:rsidRPr="00BE2791"><w:rPr><w:b/><w:bCs/></w:rPr><w:t xml:space="preserve">Test2.txt</w:t></w:r></w:p><w:bookmarkEnd w:id="0"/></w:tc><w:tc><w:tcPr><w:tcW w:w="4531" w:type="dxa"/></w:tcPr><w:p w:rsidR="001D070B" w:rsidRDefault="001D070B"><w:r><w:t xml:space="preserve">Un autre texte</w:t></w:r></w:p></w:tc></w:tr></w:tbl><w:p w:rsidR="00E95C5A" w:rsidRDefault="00E95C5A"/><w:sectPr w:rsidR="00E95C5A"><w:headerReference w:type="even" r:id="rId6"/><w:headerReference w:type="default" r:id="rId7"/><w:footerReference w:type="even" r:id="rId8"/><w:footerReference w:type="default" r:id="rId9"/><w:headerReference w:type="first" r:id="rId10"/><w:footerReference w:type="first" r:id="rId11"/><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1417" w:right="1417" w:bottom="1417" w:left="1417" w:header="708" w:footer="708" w:gutter="0"/><w:cols w:space="708"/><w:docGrid w:linePitch="360"/></w:sectPr></w:body></w:document>`)
            })
            it('should replace with multiples block in multiple loops', async () => {
                const template = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><body><w:p><w:r><w:t xml:space="preserve">{F=example IN examples}</w:t></w:r></w:p><w:p><w:r><w:t xml:space="preserve">This is a multiple loop</w:t></w:r></w:p><w:p><w:r><w:t xml:space="preserve">{F=item IN example}</w:t></w:r></w:p><w:p><w:r><w:t xml:space="preserve">Item </w:t></w:r><w:r><w:t xml:space="preserve">{=item}</w:t></w:r></w:p><w:p><w:r><w:t xml:space="preserve">{/F}</w:t></w:r></w:p><w:p><w:r><w:t xml:space="preserve">{/F}</w:t></w:r></w:p></body>`
                const node = await OpenXML.parse(template)
                const xml = node.render({ data: { examples: [['one', 'two'], ['three'], ['four']] } })
                expect(xml).toEqual(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><body><w:p><w:r><w:t xml:space="preserve">This is a multiple loop</w:t></w:r></w:p><w:p><w:r><w:t xml:space="preserve">Item one</w:t></w:r></w:p><w:p><w:r><w:t xml:space="preserve">Item two</w:t></w:r></w:p><w:p><w:r><w:t xml:space="preserve">This is a multiple loop</w:t></w:r></w:p><w:p><w:r><w:t xml:space="preserve">Item three</w:t></w:r></w:p><w:p><w:r><w:t xml:space="preserve">This is a multiple loop</w:t></w:r></w:p><w:p><w:r><w:t xml:space="preserve">Item four</w:t></w:r></w:p></body>`)
            })
            it('should replace with multiples block in the loop and last block in place', async () => {
                const template = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:wpc="http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas" xmlns:cx="http://schemas.microsoft.com/office/drawing/2014/chartex" xmlns:cx1="http://schemas.microsoft.com/office/drawing/2015/9/8/chartex" xmlns:cx2="http://schemas.microsoft.com/office/drawing/2015/10/21/chartex" xmlns:cx3="http://schemas.microsoft.com/office/drawing/2016/5/9/chartex" xmlns:cx4="http://schemas.microsoft.com/office/drawing/2016/5/10/chartex" xmlns:cx5="http://schemas.microsoft.com/office/drawing/2016/5/11/chartex" xmlns:cx6="http://schemas.microsoft.com/office/drawing/2016/5/12/chartex" xmlns:cx7="http://schemas.microsoft.com/office/drawing/2016/5/13/chartex" xmlns:cx8="http://schemas.microsoft.com/office/drawing/2016/5/14/chartex" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:aink="http://schemas.microsoft.com/office/drawing/2016/ink" xmlns:am3d="http://schemas.microsoft.com/office/drawing/2017/model3d" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:wp14="http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:w10="urn:schemas-microsoft-com:office:word" xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml" xmlns:w15="http://schemas.microsoft.com/office/word/2012/wordml" xmlns:w16cid="http://schemas.microsoft.com/office/word/2016/wordml/cid" xmlns:w16se="http://schemas.microsoft.com/office/word/2015/wordml/symex" xmlns:wpg="http://schemas.microsoft.com/office/word/2010/wordprocessingGroup" xmlns:wpi="http://schemas.microsoft.com/office/word/2010/wordprocessingInk" xmlns:wne="http://schemas.microsoft.com/office/word/2006/wordml" xmlns:wps="http://schemas.microsoft.com/office/word/2010/wordprocessingShape" mc:Ignorable="w14 w15 w16se w16cid wp14"><w:body><w:p w:rsidR="001D070B" w:rsidRDefault="001D070B"><w:r><w:t xml:space="preserve">{F=doc IN documents}</w:t></w:r></w:p><w:p w:rsidR="001D070B" w:rsidRDefault="009A3E0C"><w:r><w:t xml:space="preserve">{=doc.text}</w:t></w:r><w:bookmarkStart w:id="0" w:name="_GoBack"/><w:bookmarkEnd w:id="0"/></w:p><w:p w:rsidR="001D070B" w:rsidRDefault="001D070B"><w:r><w:t xml:space="preserve">{/F}</w:t></w:r></w:p><w:p w:rsidR="00E95C5A" w:rsidRDefault="00E95C5A"/><w:sectPr w:rsidR="00E95C5A"><w:headerReference w:type="even" r:id="rId6"/><w:headerReference w:type="default" r:id="rId7"/><w:footerReference w:type="even" r:id="rId8"/><w:footerReference w:type="default" r:id="rId9"/><w:headerReference w:type="first" r:id="rId10"/><w:footerReference w:type="first" r:id="rId11"/><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1417" w:right="1417" w:bottom="1417" w:left="1417" w:header="708" w:footer="708" w:gutter="0"/><w:cols w:space="708"/><w:docGrid w:linePitch="360"/></w:sectPr></w:body></w:document>`
                const node = await OpenXML.parse(template)
                const xml = node.render({ data: { documents: [{ text: 'Test.txt' }, { text: 'Test2.txt' }] } })
                expect(xml).toEqual(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:wpc="http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas" xmlns:cx="http://schemas.microsoft.com/office/drawing/2014/chartex" xmlns:cx1="http://schemas.microsoft.com/office/drawing/2015/9/8/chartex" xmlns:cx2="http://schemas.microsoft.com/office/drawing/2015/10/21/chartex" xmlns:cx3="http://schemas.microsoft.com/office/drawing/2016/5/9/chartex" xmlns:cx4="http://schemas.microsoft.com/office/drawing/2016/5/10/chartex" xmlns:cx5="http://schemas.microsoft.com/office/drawing/2016/5/11/chartex" xmlns:cx6="http://schemas.microsoft.com/office/drawing/2016/5/12/chartex" xmlns:cx7="http://schemas.microsoft.com/office/drawing/2016/5/13/chartex" xmlns:cx8="http://schemas.microsoft.com/office/drawing/2016/5/14/chartex" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:aink="http://schemas.microsoft.com/office/drawing/2016/ink" xmlns:am3d="http://schemas.microsoft.com/office/drawing/2017/model3d" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:wp14="http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:w10="urn:schemas-microsoft-com:office:word" xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml" xmlns:w15="http://schemas.microsoft.com/office/word/2012/wordml" xmlns:w16cid="http://schemas.microsoft.com/office/word/2016/wordml/cid" xmlns:w16se="http://schemas.microsoft.com/office/word/2015/wordml/symex" xmlns:wpg="http://schemas.microsoft.com/office/word/2010/wordprocessingGroup" xmlns:wpi="http://schemas.microsoft.com/office/word/2010/wordprocessingInk" xmlns:wne="http://schemas.microsoft.com/office/word/2006/wordml" xmlns:wps="http://schemas.microsoft.com/office/word/2010/wordprocessingShape" mc:Ignorable="w14 w15 w16se w16cid wp14"><w:body><w:p w:rsidR="001D070B" w:rsidRDefault="009A3E0C"><w:r><w:t xml:space="preserve">Test.txt</w:t></w:r></w:p><w:p w:rsidR="001D070B" w:rsidRDefault="009A3E0C"><w:r><w:t xml:space="preserve">Test2.txt</w:t></w:r></w:p><w:p w:rsidR="00E95C5A" w:rsidRDefault="00E95C5A"/><w:sectPr w:rsidR="00E95C5A"><w:headerReference w:type="even" r:id="rId6"/><w:headerReference w:type="default" r:id="rId7"/><w:footerReference w:type="even" r:id="rId8"/><w:footerReference w:type="default" r:id="rId9"/><w:headerReference w:type="first" r:id="rId10"/><w:footerReference w:type="first" r:id="rId11"/><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1417" w:right="1417" w:bottom="1417" w:left="1417" w:header="708" w:footer="708" w:gutter="0"/><w:cols w:space="708"/><w:docGrid w:linePitch="360"/></w:sectPr></w:body></w:document>`)
            })
        })
        describe('TABLE FOR {TF=}', () => {
            it('should replace the loop for a table', async () => {
                const template = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><body><w:tbl><w:tblPr><w:tblStyle w:val="Grilledutableau"/><w:tblW w:w="4300" w:type="dxa"/><w:tblLook w:val="04A0" w:firstRow="1" w:lastRow="0" w:firstColumn="1" w:lastColumn="0" w:noHBand="0" w:noVBand="1"/></w:tblPr><w:tblGrid><w:gridCol w:w="2150"/><w:gridCol w:w="2150"/></w:tblGrid><w:tr w:rsidR="001D070B" w:rsidTr="001D070B"><w:tc><w:tcPr><w:tcW w:w="2150" w:type="dxa"/></w:tcPr><w:p w:rsidR="001D070B" w:rsidRDefault="00E33E4D"><w:r><w:t xml:space="preserve">{TF=doc IN documents}</w:t></w:r></w:p></w:tc><w:tc><w:tcPr><w:tcW w:w="2150" w:type="dxa"/></w:tcPr><w:p w:rsidR="001D070B" w:rsidRDefault="001D070B"/></w:tc></w:tr><w:tr w:rsidR="001D070B" w:rsidTr="001D070B"><w:tc><w:tcPr><w:tcW w:w="2150" w:type="dxa"/></w:tcPr><w:p w:rsidR="001D070B" w:rsidRDefault="006E7C02"><w:r><w:t xml:space="preserve">{=doc.text}</w:t></w:r></w:p></w:tc><w:tc><w:tcPr><w:tcW w:w="2150" w:type="dxa"/></w:tcPr><w:p w:rsidR="001D070B" w:rsidRDefault="006E7C02"><w:r><w:t xml:space="preserve">{=doc.url}</w:t></w:r></w:p></w:tc></w:tr><w:tr w:rsidR="001D070B" w:rsidTr="001D070B"><w:tc><w:tcPr><w:tcW w:w="2150" w:type="dxa"/></w:tcPr><w:p w:rsidR="001D070B" w:rsidRDefault="000B1528"><w:r><w:t xml:space="preserve">{/TF}</w:t></w:r></w:p></w:tc><w:tc><w:tcPr><w:tcW w:w="2150" w:type="dxa"/></w:tcPr><w:p w:rsidR="001D070B" w:rsidRDefault="001D070B"/></w:tc></w:tr></w:tbl></body>`
                const node = await OpenXML.parse(template)
                const xml = node.render({
                    data: {
                        lien: {
                            url: 'https://nas.famillefosses.fr',
                            text: 'nas'
                        },
                        documents: [
                            {
                                text: 'Test.txt',
                                url: 'https://bing.com',
                                pj: [
                                    'toto'
                                ]
                            },
                            {
                                text: 'Test2.txt',
                                url: 'https://google.com',
                                pj: [
                                    'tata'
                                ]
                            },
                        ]
                    }
                })
                expect(xml).toEqual(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><body><w:tbl><w:tblPr><w:tblStyle w:val="Grilledutableau"/><w:tblW w:w="4300" w:type="dxa"/><w:tblLook w:val="04A0" w:firstRow="1" w:lastRow="0" w:firstColumn="1" w:lastColumn="0" w:noHBand="0" w:noVBand="1"/></w:tblPr><w:tblGrid><w:gridCol w:w="2150"/><w:gridCol w:w="2150"/></w:tblGrid><w:tr w:rsidR="001D070B" w:rsidTr="001D070B"><w:tc><w:tcPr><w:tcW w:w="2150" w:type="dxa"/></w:tcPr><w:p w:rsidR="001D070B" w:rsidRDefault="006E7C02"><w:r><w:t xml:space="preserve">Test.txt</w:t></w:r></w:p></w:tc><w:tc><w:tcPr><w:tcW w:w="2150" w:type="dxa"/></w:tcPr><w:p w:rsidR="001D070B" w:rsidRDefault="006E7C02"><w:r><w:t xml:space="preserve">https://bing.com</w:t></w:r></w:p></w:tc></w:tr><w:tr w:rsidR="001D070B" w:rsidTr="001D070B"><w:tc><w:tcPr><w:tcW w:w="2150" w:type="dxa"/></w:tcPr><w:p w:rsidR="001D070B" w:rsidRDefault="006E7C02"><w:r><w:t xml:space="preserve">Test2.txt</w:t></w:r></w:p></w:tc><w:tc><w:tcPr><w:tcW w:w="2150" w:type="dxa"/></w:tcPr><w:p w:rsidR="001D070B" w:rsidRDefault="006E7C02"><w:r><w:t xml:space="preserve">https://google.com</w:t></w:r></w:p></w:tc></w:tr></w:tbl></body>`)
            })
        })
    })
    describe('TEMPLATE {T=}', () => {
        it('simple', async () => {
            const template = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><body><w:p><w:r><w:t xml:space="preserve">{T=/another_template.docx}</w:t></w:r></w:p></body>`

            const mockInstance = jest.fn()
            const mockAdd = jest.fn()
            const mockGet = jest.fn()
            mockGet.mockReturnValue({
                render: () => 'Template'
            })
            mockInstance.mockReturnValue({
                add: mockAdd,
                get: mockGet
            })
            Templates.getInstance = mockInstance
            const node = await OpenXML.parse(template)

            const xml = node.render({ data: {} })
            expect(xml).toEqual('<?xml version="1.0" encoding="UTF-8" standalone="yes"?><body>Template</body>')
        })

    })
    describe('Number {N=}', () => {
        it('no value', async () => {
            const template = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><body><w:p><w:r><w:t xml:space="preserve">{N=(test)}</w:t></w:r></w:p></body>`
            const node = await OpenXML.parse(template)

            const xml = node.render({ data: { text: '123.560' } })
            expect(xml).toEqual('<?xml version="1.0" encoding="UTF-8" standalone="yes"?><body><w:p><w:r><w:t xml:space="preserve"/></w:r></w:p></body>')
        })
        it('no options', async () => {
            const template = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><body><w:p><w:r><w:t xml:space="preserve">{N=(test)}</w:t></w:r></w:p></body>`
            const node = await OpenXML.parse(template)

            const xml = node.render({ data: { test: '123.560' } })
            expect(xml).toEqual('<?xml version="1.0" encoding="UTF-8" standalone="yes"?><body><w:p><w:r><w:t xml:space="preserve">123.56</w:t></w:r></w:p></body>')
        })
        it('locale fr', async () => {
            const template = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><body><w:p><w:r><w:t xml:space="preserve">{N=(test)}</w:t></w:r></w:p></body>`
            const node = await OpenXML.parse(template)

            const xml = node.render({ locale: 'fr', data: { test: '123.560' } })
            expect(xml).toEqual('<?xml version="1.0" encoding="UTF-8" standalone="yes"?><body><w:p><w:r><w:t xml:space="preserve">123,56</w:t></w:r></w:p></body>')
        })
        it('currency $', async () => {
            const template = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><body><w:p><w:r><w:t xml:space="preserve">{N=(test,$)}</w:t></w:r></w:p></body>`
            const node = await OpenXML.parse(template)

            const xml = node.render({ data: { test: '123.560' } })
            expect(xml).toEqual('<?xml version="1.0" encoding="UTF-8" standalone="yes"?><body><w:p><w:r><w:t xml:space="preserve">$123.56</w:t></w:r></w:p></body>')
        })
        it('currency €', async () => {
            const template = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><body><w:p><w:r><w:t xml:space="preserve">{N=(test,€)}</w:t></w:r></w:p></body>`
            const node = await OpenXML.parse(template)

            const xml = node.render({ locale: 'fr', data: { test: '123.560' } })
            expect(xml).toEqual('<?xml version="1.0" encoding="UTF-8" standalone="yes"?><body><w:p><w:r><w:t xml:space="preserve">123,56\xa0€</w:t></w:r></w:p></body>')
        })
        it('%', async () => {
            const template = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><body><w:p><w:r><w:t xml:space="preserve">{N=(test, 5,%)}</w:t></w:r></w:p></body>`
            const node = await OpenXML.parse(template)
            const xml = node.render({ locale: 'fr', data: { test: '5.5' } })
            expect(xml).toEqual('<?xml version="1.0" encoding="UTF-8" standalone="yes"?><body><w:p><w:r><w:t xml:space="preserve">5,50000\xa0%</w:t></w:r></w:p></body>')
        })
        it('partial', async () => {
            const template = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><body><w:p w:rsidR="001D070B" w:rsidRDefault="009A3E0C"><w:r><w:t xml:space="preserve">A number: {N</w:t></w:r><w:r w:rsidR="00EB4B5F"><w:t xml:space="preserve">=</w:t></w:r><w:bookmarkStart w:id="0" w:name="_GoBack"/><w:bookmarkEnd w:id="0"/><w:proofErr w:type="spellStart"/><w:r><w:t xml:space="preserve">(text,</w:t></w:r><w:proofErr w:type="spellEnd"/><w:r><w:t xml:space="preserve">1,$)}</w:t></w:r></w:p></body>`
            const node = await OpenXML.parse(template)
            const xml = node.render({ data: { text: '123.59' } })
            expect(xml).toEqual('<?xml version="1.0" encoding="UTF-8" standalone="yes"?><body><w:p w:rsidR="001D070B" w:rsidRDefault="009A3E0C"><w:r><w:t xml:space="preserve">A number: $123.6</w:t></w:r></w:p></body>')
        })
    })
    describe('subTemplateParser', () => {
        it('should return without document body and root node', async () => {
            const template = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:wpc="http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas" xmlns:cx="http://schemas.microsoft.com/office/drawing/2014/chartex" xmlns:cx1="http://schemas.microsoft.com/office/drawing/2015/9/8/chartex" xmlns:cx2="http://schemas.microsoft.com/office/drawing/2015/10/21/chartex" xmlns:cx3="http://schemas.microsoft.com/office/drawing/2016/5/9/chartex" xmlns:cx4="http://schemas.microsoft.com/office/drawing/2016/5/10/chartex" xmlns:cx5="http://schemas.microsoft.com/office/drawing/2016/5/11/chartex" xmlns:cx6="http://schemas.microsoft.com/office/drawing/2016/5/12/chartex" xmlns:cx7="http://schemas.microsoft.com/office/drawing/2016/5/13/chartex" xmlns:cx8="http://schemas.microsoft.com/office/drawing/2016/5/14/chartex" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:aink="http://schemas.microsoft.com/office/drawing/2016/ink" xmlns:am3d="http://schemas.microsoft.com/office/drawing/2017/model3d" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:wp14="http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:w10="urn:schemas-microsoft-com:office:word" xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml" xmlns:w15="http://schemas.microsoft.com/office/word/2012/wordml" xmlns:w16cid="http://schemas.microsoft.com/office/word/2016/wordml/cid" xmlns:w16se="http://schemas.microsoft.com/office/word/2015/wordml/symex" xmlns:wpg="http://schemas.microsoft.com/office/word/2010/wordprocessingGroup" xmlns:wpi="http://schemas.microsoft.com/office/word/2010/wordprocessingInk" xmlns:wne="http://schemas.microsoft.com/office/word/2006/wordml" xmlns:wps="http://schemas.microsoft.com/office/word/2010/wordprocessingShape" mc:Ignorable="w14 w15 w16se w16cid wp14"><w:body><w:p w:rsidR="00845133" w:rsidRPr="00EE4ABE" w:rsidRDefault="00845133" w:rsidP="00321585"><w:pPr><w:jc w:val="right"/><w:rPr><w:rFonts w:cstheme="minorHAnsi"/></w:rPr></w:pPr><w:r w:rsidRPr="00EE4ABE"><w:rPr><w:rFonts w:cstheme="minorHAnsi"/></w:rPr><w:t xml:space="preserve">Tuesday, April 14th 2020</w:t></w:r></w:p><w:bookmarkEnd w:id="0"/><w:p w:rsidR="004A714F" w:rsidRPr="00EE4ABE" w:rsidRDefault="001841D0" w:rsidP="00321585"><w:pPr><w:rPr><w:rFonts w:cstheme="minorHAnsi"/></w:rPr></w:pPr><w:proofErr w:type="spellStart"/><w:r w:rsidRPr="00EE4ABE"><w:rPr><w:rFonts w:cstheme="minorHAnsi"/></w:rPr><w:t xml:space="preserve">Please</w:t></w:r><w:proofErr w:type="spellEnd"/><w:r w:rsidRPr="00EE4ABE"><w:rPr><w:rFonts w:cstheme="minorHAnsi"/></w:rPr><w:t xml:space="preserve"></w:t></w:r><w:proofErr w:type="spellStart"/><w:r w:rsidRPr="00EE4ABE"><w:rPr><w:rFonts w:cstheme="minorHAnsi"/></w:rPr><w:t xml:space="preserve">find</w:t></w:r><w:proofErr w:type="spellEnd"/><w:r w:rsidRPr="00EE4ABE"><w:rPr><w:rFonts w:cstheme="minorHAnsi"/></w:rPr><w:t xml:space="preserve"></w:t></w:r><w:proofErr w:type="spellStart"/><w:r w:rsidRPr="00EE4ABE"><w:rPr><w:rFonts w:cstheme="minorHAnsi"/></w:rPr><w:t xml:space="preserve">enclosed</w:t></w:r><w:proofErr w:type="spellEnd"/><w:r w:rsidRPr="00EE4ABE"><w:rPr><w:rFonts w:cstheme="minorHAnsi"/></w:rPr><w:t xml:space="preserve"> all </w:t></w:r><w:proofErr w:type="spellStart"/><w:r w:rsidRPr="00EE4ABE"><w:rPr><w:rFonts w:cstheme="minorHAnsi"/></w:rPr><w:t xml:space="preserve">details</w:t></w:r><w:proofErr w:type="spellEnd"/><w:r w:rsidRPr="00EE4ABE"><w:rPr><w:rFonts w:cstheme="minorHAnsi"/></w:rPr><w:t xml:space="preserve"> for the </w:t></w:r><w:proofErr w:type="spellStart"/><w:r w:rsidRPr="00EE4ABE"><w:rPr><w:rFonts w:cstheme="minorHAnsi"/></w:rPr><w:t xml:space="preserve">following</w:t></w:r><w:proofErr w:type="spellEnd"/><w:r w:rsidRPr="00EE4ABE"><w:rPr><w:rFonts w:cstheme="minorHAnsi"/></w:rPr><w:t xml:space="preserve"> transaction :</w:t></w:r></w:p><w:sectPr w:rsidR="00B2223B" w:rsidRPr="00EE4ABE" w:rsidSect="00C1786A"><w:headerReference w:type="default" r:id="rId8"/><w:footerReference w:type="default" r:id="rId9"/><w:pgSz w:w="12240" w:h="15840" w:code="1"/><w:pgMar w:top="720" w:right="720" w:bottom="720" w:left="720" w:header="426" w:footer="464" w:gutter="0"/><w:cols w:space="708"/><w:docGrid w:linePitch="360"/></w:sectPr></w:body></w:document>`
            const node = await OpenXML.parseForSubTemplate(template)
            const xml = node.render({ data: {} })
            expect(xml).toEqual('<w:p w:rsidR="00845133" w:rsidRPr="00EE4ABE" w:rsidRDefault="00845133" w:rsidP="00321585"><w:pPr><w:jc w:val="right"/><w:rPr><w:rFonts w:cstheme="minorHAnsi"/></w:rPr></w:pPr><w:r w:rsidRPr="00EE4ABE"><w:rPr><w:rFonts w:cstheme="minorHAnsi"/></w:rPr><w:t xml:space="preserve">Tuesday, April 14th 2020</w:t></w:r></w:p><w:p w:rsidR="004A714F" w:rsidRPr="00EE4ABE" w:rsidRDefault="001841D0" w:rsidP="00321585"><w:pPr><w:rPr><w:rFonts w:cstheme="minorHAnsi"/></w:rPr></w:pPr><w:proofErr w:type="spellStart"/><w:r w:rsidRPr="00EE4ABE"><w:rPr><w:rFonts w:cstheme="minorHAnsi"/></w:rPr><w:t xml:space="preserve">Please</w:t></w:r><w:proofErr w:type="spellEnd"/><w:r w:rsidRPr="00EE4ABE"><w:rPr><w:rFonts w:cstheme="minorHAnsi"/></w:rPr><w:t xml:space="preserve"/></w:r><w:proofErr w:type="spellStart"/><w:r w:rsidRPr="00EE4ABE"><w:rPr><w:rFonts w:cstheme="minorHAnsi"/></w:rPr><w:t xml:space="preserve">find</w:t></w:r><w:proofErr w:type="spellEnd"/><w:r w:rsidRPr="00EE4ABE"><w:rPr><w:rFonts w:cstheme="minorHAnsi"/></w:rPr><w:t xml:space="preserve"/></w:r><w:proofErr w:type="spellStart"/><w:r w:rsidRPr="00EE4ABE"><w:rPr><w:rFonts w:cstheme="minorHAnsi"/></w:rPr><w:t xml:space="preserve">enclosed</w:t></w:r><w:proofErr w:type="spellEnd"/><w:r w:rsidRPr="00EE4ABE"><w:rPr><w:rFonts w:cstheme="minorHAnsi"/></w:rPr><w:t xml:space="preserve"> all </w:t></w:r><w:proofErr w:type="spellStart"/><w:r w:rsidRPr="00EE4ABE"><w:rPr><w:rFonts w:cstheme="minorHAnsi"/></w:rPr><w:t xml:space="preserve">details</w:t></w:r><w:proofErr w:type="spellEnd"/><w:r w:rsidRPr="00EE4ABE"><w:rPr><w:rFonts w:cstheme="minorHAnsi"/></w:rPr><w:t xml:space="preserve"> for the </w:t></w:r><w:proofErr w:type="spellStart"/><w:r w:rsidRPr="00EE4ABE"><w:rPr><w:rFonts w:cstheme="minorHAnsi"/></w:rPr><w:t xml:space="preserve">following</w:t></w:r><w:proofErr w:type="spellEnd"/><w:r w:rsidRPr="00EE4ABE"><w:rPr><w:rFonts w:cstheme="minorHAnsi"/></w:rPr><w:t xml:space="preserve"> transaction :</w:t></w:r></w:p>')
        })
    })
    it('multiple inline commands', async () => {
        const template = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><body><w:p><w:r><w:t xml:space="preserve">{N=(test, 5,%)}</w:t></w:r><w:r><w:t xml:space="preserve">{=test}</w:t></w:r></w:p></body>`
        const node = await OpenXML.parse(template)
        const xml = node.render({ locale: 'fr', data: { test: '5.5' } })
        expect(xml).toEqual('<?xml version="1.0" encoding="UTF-8" standalone="yes"?><body><w:p><w:r><w:t xml:space="preserve">5,50000\xa0%</w:t><w:t xml:space="preserve">5.5</w:t></w:r></w:p></body>')
    })
})