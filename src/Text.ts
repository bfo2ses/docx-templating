import { Command } from "./Command";

export class Text {
    static isCommand(text: string): boolean {
        return !!Command.typeOfCommand(text)
    }
}