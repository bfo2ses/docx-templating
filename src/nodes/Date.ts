import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import { INode, Context } from '../types'
import { Data } from '../utils/Data'
import 'dayjs/locale/fr'
import 'dayjs/locale/it'
import 'dayjs/locale/es'

dayjs.extend(advancedFormat)

export class DateNode implements INode {
    parent: INode
    ignore: boolean = false
    children: INode[]
    parameter: string
    format: string

    constructor({ parent, parameter, format }: Pick<DateNode, 'parent' | 'parameter' | 'format'>) {
        this.parent = parent
        this.parameter = parameter
        this.format = format
        this.children = []
    }

    render(context: Context): string {
        const date = this.parameter !== 'now' ? dayjs(Data.getValue(this.parameter, context.data)) : dayjs()
        return date.locale(context.locale || 'en').format(this.format)
    }
}