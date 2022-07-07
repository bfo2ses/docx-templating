import { DateCommand } from "./DateCommand"
import { RootNode, TextNode, DateNode } from "../nodes"

describe('DateCommand', () => {
    const command = DateCommand.getInstance()

    it('{D=(now,YYYY)}', () => {
        const text = '{D=(now,YYYY)}'
        const node = new RootNode()

        expect(command.is(text)).toBe(true)
        command.process(text, node)
        expect(node.children).toEqual([
            new TextNode({ parent: node, text: '' }),
            new DateNode({
                parent: node,
                parameter: 'now',
                format: 'YYYY'
            })
        ])
    })
    it('{D=(now,YYYY)}-{D=(test,YYYY)}', () => {
        const text = '{D=(now,YYYY)}-{D=(test,YYYY)}'
        const node = new RootNode()

        const restingText = command.process(text, node)
        expect(command.is(text)).toBe(true)
        expect(node.children).toEqual([
            new TextNode({ parent: node, text: '' }),
            new DateNode({
                parent: node,
                parameter: 'now',
                format: 'YYYY'
            })
        ])
        expect(restingText).toEqual('-{D=(test,YYYY)}')
    })
})