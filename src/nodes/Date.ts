import dayjs from 'dayjs'
import { INode, Context } from '../types'
import { Data } from '../utils/Data'
import { DateUtils } from '../utils/Date'


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
        const data = this.parameter !== 'now' ? Data.getValue(this.parameter, context.data) : new Date()
        if(!data) return ''
        const date = dayjs(data)
        return date.locale(DateUtils.getInstance().getLocale(context.locale) || 'en').format(this.format)
    }
}