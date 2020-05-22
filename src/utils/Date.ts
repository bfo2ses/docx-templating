import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import fr from 'dayjs/locale/fr'
import it from 'dayjs/locale/it'
import es from 'dayjs/locale/es'

dayjs.extend(advancedFormat)

export class DateUtils {
    static instance: DateUtils

    #locales: any

    private constructor() {
        this.#locales = {
            'es': this.transform(es),
            'fr': this.transform(fr),
            'it': this.transform(it)
        }
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new DateUtils()
        }
        return this.instance
    }

    getLocale(locale?: string) {
        if(locale){
            return this.#locales[locale]
        }
        return null
    }

    private transform(locale: any) {
        return {
            ...locale,
            weekdays: locale.weekdays.map(this.upperCaseFirstChar),
            weekdaysShort: locale.weekdaysShort.map(this.upperCaseFirstChar),
            months: locale.months.map(this.upperCaseFirstChar),
            monthsShort: locale.monthsShort.map(this.upperCaseFirstChar)
        }
    }

    private upperCaseFirstChar(string: string) {
        if (typeof string !== 'string') return ''
        return string.charAt(0).toUpperCase() + string.slice(1)
    }


}