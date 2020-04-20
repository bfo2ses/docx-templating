import _ from 'lodash'
import { INode, Context } from '../types'
import { Data } from '../utils/Data'
import he from 'he'

export class NumberNode implements INode {
    parent: INode
    ignore: boolean = false
    children: INode[]
    parameter: string
    decimal: number
    currency: string | null = null

    constructor({ parent, parameter, decimal, currency }: Pick<NumberNode, 'parent' | 'parameter' | 'decimal' | 'currency'>) {
        this.parent = parent
        this.parameter = parameter
        this.decimal = decimal
        if (currency) {
            switch (currency) {
                case '%':
                    this.currency = '%'
                    break
                case '$':
                    this.currency = 'USD'
                    break
                case '€':
                    this.currency = 'EUR'
                    break
            }
        }
        this.children = []
    }

    render(context: Context): string {
        const value = Data.getValue(this.parameter, context.data)
        if (value !== '') {
            let number = parseFloat(value)
            let options = {}
            if (this.currency) {
                if (this.currency != '%') {
                    options = {
                        style: 'currency',
                        currency: this.currency,
                        minimumFractionDigits: 0
                    }
                } else {
                    number /= 100
                    options = {
                        style: 'percent',
                        minimumFractionDigits: this.decimal
                    }
                }
            }
            return he.escape(new Intl.NumberFormat(context.locale, { maximumFractionDigits: this.decimal, ...options }).format(number))
        } else {
            return value
        }
    }
}