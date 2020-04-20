import _ from 'lodash'
export class Data {
    static getValue(parameter: string, data: any, defaultReturn: any = ''): any {
        return _.get(data, parameter) || defaultReturn
    }
}