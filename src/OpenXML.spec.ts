import { OpenXML } from "./OpenXML"
import { Medias } from "./Medias"

describe('OpenXML', () => {

    describe('parser', () => {
        it('should return same thing without command', async () => {
            const template = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><body><p>Test</p></body>`
            const node = await OpenXML.parse(template)
            expect(node).not.toBeNull()
            const xml = node?.render({ data: { test: 'Test' }, medias: new Medias() })
            expect(xml).toEqual('<?xml version="1.0" encoding="UTF-8" standalone="yes"?><body><p>Test</p></body>')
        })
        it('partial command', async () => {
            const template = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><body><w:p w:rsidR="001D070B" w:rsidRDefault="009A3E0C"><w:r><w:t>{</w:t></w:r><w:r w:rsidR="00EB4B5F"><w:t>=</w:t></w:r><w:bookmarkStart w:id="0" w:name="_GoBack"/><w:bookmarkEnd w:id="0"/><w:proofErr w:type="spellStart"/><w:r><w:t>text</w:t></w:r><w:proofErr w:type="spellEnd"/><w:r><w:t>}</w:t></w:r></w:p></body>`
            const node = await OpenXML.parse(template)
            expect(node).not.toBeNull()
            const xml = node?.render({ data: { text: 'Test' }, medias: new Medias() })
            expect(xml).toEqual('<?xml version="1.0" encoding="UTF-8" standalone="yes"?><body><w:p w:rsidR="001D070B" w:rsidRDefault="009A3E0C"><w:r><w:t>Test</w:t></w:r></w:p></body>')
        })
        describe('{=}', () => {
            it('should replace a parameter command', async () => {
                const template = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><body><p>{=test}</p></body>`
                const node = await OpenXML.parse(template)
                expect(node).not.toBeNull()
                const xml = node?.render({ data: { test: 'Test' }, medias: new Medias() })
                expect(xml).toEqual('<?xml version="1.0" encoding="UTF-8" standalone="yes"?><body><p>Test</p></body>')
            })
            it('should replace a simple parameter in at the end of a sentence', async () => {
                const template = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><body><p>blabla {=test}</p></body>`
                const node = await OpenXML.parse(template)
                expect(node).not.toBeNull()
                const xml = node?.render({ data: { test: 'Test' }, medias: new Medias() })
                expect(xml).toEqual('<?xml version="1.0" encoding="UTF-8" standalone="yes"?><body><p>blabla Test</p></body>')
            })
            it('should replace a simple parameter in a middle of a sentence', async () => {
                const template = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><body><p>blabla {=test} blabla</p></body>`
                const node = await OpenXML.parse(template)
                expect(node).not.toBeNull()
                const xml = node?.render({ data: { test: 'Test' }, medias: new Medias() })
                expect(xml).toEqual('<?xml version="1.0" encoding="UTF-8" standalone="yes"?><body><p>blabla Test blabla</p></body>')
            })
            it('should replace multiple parameters in a sentence', async () => {
                const template = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><body><p>blabla {=test} blabla {=test} blabla</p></body>`
                const node = await OpenXML.parse(template)
                expect(node).not.toBeNull()
                const xml = node?.render({ data: { test: 'Test' }, medias: new Medias() })
                expect(xml).toEqual('<?xml version="1.0" encoding="UTF-8" standalone="yes"?><body><p>blabla Test blabla Test blabla</p></body>')
            })
        })
        describe('{L=}', () => {
            it('should replace a link command', async () => {
                const template = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><body><w:p><w:r><w:t xml:space="preserve">This is an external link to {L=link}</w:t></w:r></w:p></body>`
                const node = await OpenXML.parse(template)
                expect(node).not.toBeNull()
                const xml = node?.render({ data: { link: { url: 'https://google.com' } }, medias: new Medias() })
                expect(xml).toEqual(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><body><w:p><w:r><w:t xml:space="preserve">This is an external link to </w:t></w:r><w:hyperlink r:id="link1"><w:r><w:t>https://google.com</w:t></w:r></w:hyperlink></w:p></body>`)
            })
            it('should replace link commands', async () => {
                const template = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><body><w:p><w:r><w:t xml:space="preserve">This is an external link to {L=link1} or {L=link2}</w:t></w:r></w:p></body>`
                const node = await OpenXML.parse(template)
                expect(node).not.toBeNull()
                const xml = node?.render({ data: { link1: { url: 'https://google.com' }, link2: { text: 'Google', url: 'https://google.com' } }, medias: new Medias() })
                expect(xml).toEqual(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><body><w:p><w:r><w:t xml:space="preserve">This is an external link to </w:t></w:r><w:hyperlink r:id="link1"><w:r><w:t>https://google.com</w:t></w:r></w:hyperlink><w:r><w:t xml:space="preserve"> or </w:t></w:r><w:hyperlink r:id="link2"><w:r><w:t>Google</w:t></w:r></w:hyperlink></w:p></body>`)
            })
        })
        describe('{F=}', () => {
            it('should replace with multiples block in the loop', async () => {
                const template = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><body><w:p><w:r><w:t xml:space="preserve">{F=example in examples}</w:t></w:r></w:p><w:p><w:r><w:t xml:space="preserve">This is loop {=example}</w:t></w:r></w:p><w:p><w:r><w:t xml:space="preserve">{/F}</w:t></w:r></w:p></body>`
                const node = await OpenXML.parse(template)
                expect(node).not.toBeNull()
                const xml = node?.render({ data: { examples: ['one', 'two'] }, medias: new Medias() })
                expect(xml).toEqual(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><body><w:p><w:r><w:t xml:space="preserve">This is loop one</w:t></w:r></w:p><w:p><w:r><w:t xml:space="preserve">This is loop two</w:t></w:r></w:p></body>`)
            })
            it('should replace in a table', async () => {
                const template = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:wpc="http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas" xmlns:cx="http://schemas.microsoft.com/office/drawing/2014/chartex" xmlns:cx1="http://schemas.microsoft.com/office/drawing/2015/9/8/chartex" xmlns:cx2="http://schemas.microsoft.com/office/drawing/2015/10/21/chartex" xmlns:cx3="http://schemas.microsoft.com/office/drawing/2016/5/9/chartex" xmlns:cx4="http://schemas.microsoft.com/office/drawing/2016/5/10/chartex" xmlns:cx5="http://schemas.microsoft.com/office/drawing/2016/5/11/chartex" xmlns:cx6="http://schemas.microsoft.com/office/drawing/2016/5/12/chartex" xmlns:cx7="http://schemas.microsoft.com/office/drawing/2016/5/13/chartex" xmlns:cx8="http://schemas.microsoft.com/office/drawing/2016/5/14/chartex" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:aink="http://schemas.microsoft.com/office/drawing/2016/ink" xmlns:am3d="http://schemas.microsoft.com/office/drawing/2017/model3d" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:wp14="http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:w10="urn:schemas-microsoft-com:office:word" xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml" xmlns:w15="http://schemas.microsoft.com/office/word/2012/wordml" xmlns:w16cid="http://schemas.microsoft.com/office/word/2016/wordml/cid" xmlns:w16se="http://schemas.microsoft.com/office/word/2015/wordml/symex" xmlns:wpg="http://schemas.microsoft.com/office/word/2010/wordprocessingGroup" xmlns:wpi="http://schemas.microsoft.com/office/word/2010/wordprocessingInk" xmlns:wne="http://schemas.microsoft.com/office/word/2006/wordml" xmlns:wps="http://schemas.microsoft.com/office/word/2010/wordprocessingShape" mc:Ignorable="w14 w15 w16se w16cid wp14"><w:body><w:tbl><w:tblPr><w:tblStyle w:val="Grilledutableau"/><w:tblW w:w="0" w:type="auto"/><w:tblLook w:val="04A0" w:firstRow="1" w:lastRow="0" w:firstColumn="1" w:lastColumn="0" w:noHBand="0" w:noVBand="1"/></w:tblPr><w:tblGrid><w:gridCol w:w="4531"/><w:gridCol w:w="4531"/></w:tblGrid><w:tr w:rsidR="001D070B" w:rsidTr="001D070B"><w:tc><w:tcPr><w:tcW w:w="4531" w:type="dxa"/></w:tcPr><w:p w:rsidR="001D070B" w:rsidRDefault="001D070B"><w:r><w:t>Un tableau de tableau</w:t></w:r></w:p><w:p w:rsidR="001D070B" w:rsidRDefault="001D070B"/><w:p w:rsidR="001D070B" w:rsidRDefault="001D070B" w:rsidP="00A435CE"><w:r><w:t>Un lien</w:t></w:r></w:p><w:p w:rsidR="001D070B" w:rsidRDefault="001D070B"/><w:p w:rsidR="001D070B" w:rsidRDefault="001D070B"><w:r><w:t xml:space="preserve">Un lien dans une </w:t></w:r><w:proofErr w:type="gramStart"/><w:r><w:t>boucl</w:t></w:r><w:r w:rsidR="00E33E4D"><w:t>e</w:t></w:r><w:r><w:t>:</w:t></w:r><w:proofErr w:type="gramEnd"/><w:r><w:t xml:space="preserve"></w:t></w:r></w:p><w:p w:rsidR="00BE2791" w:rsidRDefault="001D070B"><w:r><w:t>{F=doc in documents}</w:t></w:r></w:p><w:p w:rsidR="00BE2791" w:rsidRPr="00BE2791" w:rsidRDefault="00BE2791"><w:pPr><w:rPr><w:b/><w:bCs/></w:rPr></w:pPr><w:bookmarkStart w:id="0" w:name="_GoBack"/><w:r w:rsidRPr="00BE2791"><w:rPr><w:b/><w:bCs/></w:rPr><w:t>{=doc.text}</w:t></w:r></w:p><w:bookmarkEnd w:id="0"/><w:p w:rsidR="001D070B" w:rsidRDefault="001D070B"><w:r><w:t>{/F}</w:t></w:r></w:p></w:tc><w:tc><w:tcPr><w:tcW w:w="4531" w:type="dxa"/></w:tcPr><w:p w:rsidR="001D070B" w:rsidRDefault="001D070B"><w:r><w:t>Un autre texte</w:t></w:r></w:p></w:tc></w:tr></w:tbl><w:p w:rsidR="00E95C5A" w:rsidRDefault="00E95C5A"/><w:sectPr w:rsidR="00E95C5A"><w:headerReference w:type="even" r:id="rId6"/><w:headerReference w:type="default" r:id="rId7"/><w:footerReference w:type="even" r:id="rId8"/><w:footerReference w:type="default" r:id="rId9"/><w:headerReference w:type="first" r:id="rId10"/><w:footerReference w:type="first" r:id="rId11"/><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1417" w:right="1417" w:bottom="1417" w:left="1417" w:header="708" w:footer="708" w:gutter="0"/><w:cols w:space="708"/><w:docGrid w:linePitch="360"/></w:sectPr></w:body></w:document>`
                const node = await OpenXML.parse(template)
                expect(node).not.toBeNull()
                const xml = node?.render({
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
                    }, medias: new Medias()
                })
                expect(xml).toEqual(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:wpc="http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas" xmlns:cx="http://schemas.microsoft.com/office/drawing/2014/chartex" xmlns:cx1="http://schemas.microsoft.com/office/drawing/2015/9/8/chartex" xmlns:cx2="http://schemas.microsoft.com/office/drawing/2015/10/21/chartex" xmlns:cx3="http://schemas.microsoft.com/office/drawing/2016/5/9/chartex" xmlns:cx4="http://schemas.microsoft.com/office/drawing/2016/5/10/chartex" xmlns:cx5="http://schemas.microsoft.com/office/drawing/2016/5/11/chartex" xmlns:cx6="http://schemas.microsoft.com/office/drawing/2016/5/12/chartex" xmlns:cx7="http://schemas.microsoft.com/office/drawing/2016/5/13/chartex" xmlns:cx8="http://schemas.microsoft.com/office/drawing/2016/5/14/chartex" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:aink="http://schemas.microsoft.com/office/drawing/2016/ink" xmlns:am3d="http://schemas.microsoft.com/office/drawing/2017/model3d" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:wp14="http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:w10="urn:schemas-microsoft-com:office:word" xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml" xmlns:w15="http://schemas.microsoft.com/office/word/2012/wordml" xmlns:w16cid="http://schemas.microsoft.com/office/word/2016/wordml/cid" xmlns:w16se="http://schemas.microsoft.com/office/word/2015/wordml/symex" xmlns:wpg="http://schemas.microsoft.com/office/word/2010/wordprocessingGroup" xmlns:wpi="http://schemas.microsoft.com/office/word/2010/wordprocessingInk" xmlns:wne="http://schemas.microsoft.com/office/word/2006/wordml" xmlns:wps="http://schemas.microsoft.com/office/word/2010/wordprocessingShape" mc:Ignorable="w14 w15 w16se w16cid wp14"><w:body><w:tbl><w:tblPr><w:tblStyle w:val="Grilledutableau"/><w:tblW w:w="0" w:type="auto"/><w:tblLook w:val="04A0" w:firstRow="1" w:lastRow="0" w:firstColumn="1" w:lastColumn="0" w:noHBand="0" w:noVBand="1"/></w:tblPr><w:tblGrid><w:gridCol w:w="4531"/><w:gridCol w:w="4531"/></w:tblGrid><w:tr w:rsidR="001D070B" w:rsidTr="001D070B"><w:tc><w:tcPr><w:tcW w:w="4531" w:type="dxa"/></w:tcPr><w:p w:rsidR="001D070B" w:rsidRDefault="001D070B"><w:r><w:t>Un tableau de tableau</w:t></w:r></w:p><w:p w:rsidR="001D070B" w:rsidRDefault="001D070B"/><w:p w:rsidR="001D070B" w:rsidRDefault="001D070B" w:rsidP="00A435CE"><w:r><w:t>Un lien</w:t></w:r></w:p><w:p w:rsidR="001D070B" w:rsidRDefault="001D070B"/><w:p w:rsidR="001D070B" w:rsidRDefault="001D070B"><w:r><w:t xml:space="preserve">Un lien dans une </w:t></w:r><w:proofErr w:type="gramStart"/><w:r><w:t>boucl</w:t></w:r><w:r w:rsidR="00E33E4D"><w:t>e</w:t></w:r><w:r><w:t>:</w:t></w:r><w:proofErr w:type="gramEnd"/><w:r><w:t xml:space="preserve"/></w:r></w:p><w:p w:rsidR="00BE2791" w:rsidRPr="00BE2791" w:rsidRDefault="00BE2791"><w:pPr><w:rPr><w:b/><w:bCs/></w:rPr></w:pPr><w:bookmarkStart w:id="0" w:name="_GoBack"/><w:r w:rsidRPr="00BE2791"><w:rPr><w:b/><w:bCs/></w:rPr><w:t>Test.txt</w:t></w:r></w:p><w:bookmarkEnd w:id="0"/><w:p w:rsidR="00BE2791" w:rsidRPr="00BE2791" w:rsidRDefault="00BE2791"><w:pPr><w:rPr><w:b/><w:bCs/></w:rPr></w:pPr><w:bookmarkStart w:id="0" w:name="_GoBack"/><w:r w:rsidRPr="00BE2791"><w:rPr><w:b/><w:bCs/></w:rPr><w:t>Test2.txt</w:t></w:r></w:p><w:bookmarkEnd w:id="0"/></w:tc><w:tc><w:tcPr><w:tcW w:w="4531" w:type="dxa"/></w:tcPr><w:p w:rsidR="001D070B" w:rsidRDefault="001D070B"><w:r><w:t>Un autre texte</w:t></w:r></w:p></w:tc></w:tr></w:tbl><w:p w:rsidR="00E95C5A" w:rsidRDefault="00E95C5A"/><w:sectPr w:rsidR="00E95C5A"><w:headerReference w:type="even" r:id="rId6"/><w:headerReference w:type="default" r:id="rId7"/><w:footerReference w:type="even" r:id="rId8"/><w:footerReference w:type="default" r:id="rId9"/><w:headerReference w:type="first" r:id="rId10"/><w:footerReference w:type="first" r:id="rId11"/><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1417" w:right="1417" w:bottom="1417" w:left="1417" w:header="708" w:footer="708" w:gutter="0"/><w:cols w:space="708"/><w:docGrid w:linePitch="360"/></w:sectPr></w:body></w:document>`)
            })
            it('should replace with multiples block in multiple loops', async () => {
                const template = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><body><w:p><w:r><w:t xml:space="preserve">{F=example in examples}</w:t></w:r></w:p><w:p><w:r><w:t xml:space="preserve">This is a multiple loop</w:t></w:r></w:p><w:p><w:r><w:t xml:space="preserve">{F=item in example}</w:t></w:r></w:p><w:p><w:r><w:t xml:space="preserve">Item </w:t></w:r><w:r><w:t xml:space="preserve">{=item}</w:t></w:r></w:p><w:p><w:r><w:t xml:space="preserve">{/F}</w:t></w:r></w:p><w:p><w:r><w:t xml:space="preserve">{/F}</w:t></w:r></w:p></body>`
                const node = await OpenXML.parse(template)
                expect(node).not.toBeNull()
                const xml = node?.render({ data: { examples: [['one', 'two'], ['three'], ['four']] }, medias: new Medias() })
                expect(xml).toEqual(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><body><w:p><w:r><w:t xml:space="preserve">This is a multiple loop</w:t></w:r></w:p><w:p><w:r><w:t xml:space="preserve">Item </w:t></w:r><w:r><w:t xml:space="preserve">one</w:t></w:r></w:p><w:p><w:r><w:t xml:space="preserve">Item </w:t></w:r><w:r><w:t xml:space="preserve">two</w:t></w:r></w:p><w:p><w:r><w:t xml:space="preserve">This is a multiple loop</w:t></w:r></w:p><w:p><w:r><w:t xml:space="preserve">Item </w:t></w:r><w:r><w:t xml:space="preserve">three</w:t></w:r></w:p><w:p><w:r><w:t xml:space="preserve">This is a multiple loop</w:t></w:r></w:p><w:p><w:r><w:t xml:space="preserve">Item </w:t></w:r><w:r><w:t xml:space="preserve">four</w:t></w:r></w:p></body>`)
            })
            it('should replace with multiples block in the loop and last block in place', async () => {
                const template = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:wpc="http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas" xmlns:cx="http://schemas.microsoft.com/office/drawing/2014/chartex" xmlns:cx1="http://schemas.microsoft.com/office/drawing/2015/9/8/chartex" xmlns:cx2="http://schemas.microsoft.com/office/drawing/2015/10/21/chartex" xmlns:cx3="http://schemas.microsoft.com/office/drawing/2016/5/9/chartex" xmlns:cx4="http://schemas.microsoft.com/office/drawing/2016/5/10/chartex" xmlns:cx5="http://schemas.microsoft.com/office/drawing/2016/5/11/chartex" xmlns:cx6="http://schemas.microsoft.com/office/drawing/2016/5/12/chartex" xmlns:cx7="http://schemas.microsoft.com/office/drawing/2016/5/13/chartex" xmlns:cx8="http://schemas.microsoft.com/office/drawing/2016/5/14/chartex" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:aink="http://schemas.microsoft.com/office/drawing/2016/ink" xmlns:am3d="http://schemas.microsoft.com/office/drawing/2017/model3d" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:wp14="http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:w10="urn:schemas-microsoft-com:office:word" xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml" xmlns:w15="http://schemas.microsoft.com/office/word/2012/wordml" xmlns:w16cid="http://schemas.microsoft.com/office/word/2016/wordml/cid" xmlns:w16se="http://schemas.microsoft.com/office/word/2015/wordml/symex" xmlns:wpg="http://schemas.microsoft.com/office/word/2010/wordprocessingGroup" xmlns:wpi="http://schemas.microsoft.com/office/word/2010/wordprocessingInk" xmlns:wne="http://schemas.microsoft.com/office/word/2006/wordml" xmlns:wps="http://schemas.microsoft.com/office/word/2010/wordprocessingShape" mc:Ignorable="w14 w15 w16se w16cid wp14"><w:body><w:p w:rsidR="001D070B" w:rsidRDefault="001D070B"><w:r><w:t>{F=doc in documents}</w:t></w:r></w:p><w:p w:rsidR="001D070B" w:rsidRDefault="009A3E0C"><w:r><w:t>{=doc.text}</w:t></w:r><w:bookmarkStart w:id="0" w:name="_GoBack"/><w:bookmarkEnd w:id="0"/></w:p><w:p w:rsidR="001D070B" w:rsidRDefault="001D070B"><w:r><w:t>{/F}</w:t></w:r></w:p><w:p w:rsidR="00E95C5A" w:rsidRDefault="00E95C5A"/><w:sectPr w:rsidR="00E95C5A"><w:headerReference w:type="even" r:id="rId6"/><w:headerReference w:type="default" r:id="rId7"/><w:footerReference w:type="even" r:id="rId8"/><w:footerReference w:type="default" r:id="rId9"/><w:headerReference w:type="first" r:id="rId10"/><w:footerReference w:type="first" r:id="rId11"/><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1417" w:right="1417" w:bottom="1417" w:left="1417" w:header="708" w:footer="708" w:gutter="0"/><w:cols w:space="708"/><w:docGrid w:linePitch="360"/></w:sectPr></w:body></w:document>`
                const node = await OpenXML.parse(template)
                expect(node).not.toBeNull()
                const xml = node?.render({ data: { documents: [{ text: 'Test.txt' }, { text: 'Test2.txt' }] }, medias: new Medias() })
                expect(xml).toEqual(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:wpc="http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas" xmlns:cx="http://schemas.microsoft.com/office/drawing/2014/chartex" xmlns:cx1="http://schemas.microsoft.com/office/drawing/2015/9/8/chartex" xmlns:cx2="http://schemas.microsoft.com/office/drawing/2015/10/21/chartex" xmlns:cx3="http://schemas.microsoft.com/office/drawing/2016/5/9/chartex" xmlns:cx4="http://schemas.microsoft.com/office/drawing/2016/5/10/chartex" xmlns:cx5="http://schemas.microsoft.com/office/drawing/2016/5/11/chartex" xmlns:cx6="http://schemas.microsoft.com/office/drawing/2016/5/12/chartex" xmlns:cx7="http://schemas.microsoft.com/office/drawing/2016/5/13/chartex" xmlns:cx8="http://schemas.microsoft.com/office/drawing/2016/5/14/chartex" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:aink="http://schemas.microsoft.com/office/drawing/2016/ink" xmlns:am3d="http://schemas.microsoft.com/office/drawing/2017/model3d" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:wp14="http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:w10="urn:schemas-microsoft-com:office:word" xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml" xmlns:w15="http://schemas.microsoft.com/office/word/2012/wordml" xmlns:w16cid="http://schemas.microsoft.com/office/word/2016/wordml/cid" xmlns:w16se="http://schemas.microsoft.com/office/word/2015/wordml/symex" xmlns:wpg="http://schemas.microsoft.com/office/word/2010/wordprocessingGroup" xmlns:wpi="http://schemas.microsoft.com/office/word/2010/wordprocessingInk" xmlns:wne="http://schemas.microsoft.com/office/word/2006/wordml" xmlns:wps="http://schemas.microsoft.com/office/word/2010/wordprocessingShape" mc:Ignorable="w14 w15 w16se w16cid wp14"><w:body><w:p w:rsidR="001D070B" w:rsidRDefault="009A3E0C"><w:r><w:t>Test.txt</w:t></w:r><w:bookmarkStart w:id="0" w:name="_GoBack"/><w:bookmarkEnd w:id="0"/></w:p><w:p w:rsidR="001D070B" w:rsidRDefault="009A3E0C"><w:r><w:t>Test2.txt</w:t></w:r><w:bookmarkStart w:id="0" w:name="_GoBack"/><w:bookmarkEnd w:id="0"/></w:p><w:p w:rsidR="00E95C5A" w:rsidRDefault="00E95C5A"/><w:sectPr w:rsidR="00E95C5A"><w:headerReference w:type="even" r:id="rId6"/><w:headerReference w:type="default" r:id="rId7"/><w:footerReference w:type="even" r:id="rId8"/><w:footerReference w:type="default" r:id="rId9"/><w:headerReference w:type="first" r:id="rId10"/><w:footerReference w:type="first" r:id="rId11"/><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1417" w:right="1417" w:bottom="1417" w:left="1417" w:header="708" w:footer="708" w:gutter="0"/><w:cols w:space="708"/><w:docGrid w:linePitch="360"/></w:sectPr></w:body></w:document>`)
            })
        })
        describe('{TF=}', () => {
            it('should replace the loop for a table', async () => {
                const template = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><body><w:tbl><w:tblPr><w:tblStyle w:val="Grilledutableau"/><w:tblW w:w="4300" w:type="dxa"/><w:tblLook w:val="04A0" w:firstRow="1" w:lastRow="0" w:firstColumn="1" w:lastColumn="0" w:noHBand="0" w:noVBand="1"/></w:tblPr><w:tblGrid><w:gridCol w:w="2150"/><w:gridCol w:w="2150"/></w:tblGrid><w:tr w:rsidR="001D070B" w:rsidTr="001D070B"><w:tc><w:tcPr><w:tcW w:w="2150" w:type="dxa"/></w:tcPr><w:p w:rsidR="001D070B" w:rsidRDefault="00E33E4D"><w:r><w:t>{TF=doc in documents}</w:t></w:r></w:p></w:tc><w:tc><w:tcPr><w:tcW w:w="2150" w:type="dxa"/></w:tcPr><w:p w:rsidR="001D070B" w:rsidRDefault="001D070B"/></w:tc></w:tr><w:tr w:rsidR="001D070B" w:rsidTr="001D070B"><w:tc><w:tcPr><w:tcW w:w="2150" w:type="dxa"/></w:tcPr><w:p w:rsidR="001D070B" w:rsidRDefault="006E7C02"><w:r><w:t>{=doc.text}</w:t></w:r></w:p></w:tc><w:tc><w:tcPr><w:tcW w:w="2150" w:type="dxa"/></w:tcPr><w:p w:rsidR="001D070B" w:rsidRDefault="006E7C02"><w:r><w:t>{=doc.url}</w:t></w:r></w:p></w:tc></w:tr><w:tr w:rsidR="001D070B" w:rsidTr="001D070B"><w:tc><w:tcPr><w:tcW w:w="2150" w:type="dxa"/></w:tcPr><w:p w:rsidR="001D070B" w:rsidRDefault="000B1528"><w:r><w:t>{/TF}</w:t></w:r></w:p></w:tc><w:tc><w:tcPr><w:tcW w:w="2150" w:type="dxa"/></w:tcPr><w:p w:rsidR="001D070B" w:rsidRDefault="001D070B"/></w:tc></w:tr></w:tbl></body>`
                const node = await OpenXML.parse(template)
                expect(node).not.toBeNull()
                const xml = node?.render({
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
                    }, medias: new Medias()
                })
                expect(xml).toEqual(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><body><w:tbl><w:tblPr><w:tblStyle w:val="Grilledutableau"/><w:tblW w:w="4300" w:type="dxa"/><w:tblLook w:val="04A0" w:firstRow="1" w:lastRow="0" w:firstColumn="1" w:lastColumn="0" w:noHBand="0" w:noVBand="1"/></w:tblPr><w:tblGrid><w:gridCol w:w="2150"/><w:gridCol w:w="2150"/></w:tblGrid><w:tr w:rsidR="001D070B" w:rsidTr="001D070B"><w:tc><w:tcPr><w:tcW w:w="2150" w:type="dxa"/></w:tcPr><w:p w:rsidR="001D070B" w:rsidRDefault="006E7C02"><w:r><w:t>Test.txt</w:t></w:r></w:p></w:tc><w:tc><w:tcPr><w:tcW w:w="2150" w:type="dxa"/></w:tcPr><w:p w:rsidR="001D070B" w:rsidRDefault="006E7C02"><w:r><w:t>https://bing.com</w:t></w:r></w:p></w:tc></w:tr><w:tr w:rsidR="001D070B" w:rsidTr="001D070B"><w:tc><w:tcPr><w:tcW w:w="2150" w:type="dxa"/></w:tcPr><w:p w:rsidR="001D070B" w:rsidRDefault="006E7C02"><w:r><w:t>Test2.txt</w:t></w:r></w:p></w:tc><w:tc><w:tcPr><w:tcW w:w="2150" w:type="dxa"/></w:tcPr><w:p w:rsidR="001D070B" w:rsidRDefault="006E7C02"><w:r><w:t>https://google.com</w:t></w:r></w:p></w:tc></w:tr></w:tbl></body>`)
            })
        })
    })
})