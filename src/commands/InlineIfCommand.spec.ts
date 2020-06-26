import { RootNode, TextNode, DateNode, InlineIfNode } from "../nodes"
import { InlineIfCommand } from "./InlineIfCommand"

describe('InlineIfCommand', () => {
    const command = InlineIfCommand.getInstance()

    it('{IF=(serviceContract.options.coverBarrel,=ok,!no)}', () => {
        const text = '{IF=(serviceContract.options.coverBarrel,=ok,!ko)}'
        const node = new RootNode()

        expect(command.is(text)).toBe(true)
        command.process(text, node)
        expect(node.children).toEqual([
            new InlineIfNode({
                parent: node,
                parameter: 'serviceContract.options.coverBarrel',
                trueValue: 'ok',
                falseValue: 'ko'
            })
        ])
    })
    it('{IF=(serviceContract.options.coverBarrel,=★,!-)}', () => {
        const text = '{IF=(serviceContract.options.coverBarrel,=★,!-)}'
        const node = new RootNode()

        expect(command.is(text)).toBe(true)
        command.process(text, node)
        expect(node.children).toEqual([
            new InlineIfNode({
                parent: node,
                parameter: 'serviceContract.options.coverBarrel',
                trueValue: '★',
                falseValue: '-'
            })
        ])
    })
})