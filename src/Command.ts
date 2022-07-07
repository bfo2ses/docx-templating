import { ICommand, INode } from "./types";
import { PartialCommand } from "./PartialCommand";

export class Command {
    private static instance: Command
    #commands: ICommand[]

    constructor(commands: ICommand[]) {
        this.#commands = commands
    }

    static init(commands: ICommand[]) {
        if (!Command.instance) {
            Command.instance = new Command(commands)
        }
    }


    static getInstance() {
        if (!Command.instance) {
            throw new Error('init it please')
        }
        return Command.instance
    }

    add(command: ICommand) {
        this.#commands.push(command)
    }

    hasCommand(text: string) {
        return this.getCommand(text) !== null
    }

    private getCommand(text: string) {
        return this.#commands.filter(command => command.is(text))[0] || null
    }

    process(text: string, node: INode): string {
        return this.getCommand(text)?.process(text, node)
    }
}