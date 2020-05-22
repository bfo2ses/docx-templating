import { VM } from 'vm2'
import _ from 'lodash'

export class Data {
    static getValue(parameter: string, data: any, defaultReturn: any = ''): any {
        const vm = new VM({
            sandbox: data
        })
        let value = defaultReturn
        try {
            value = vm.run(parameter)
        } catch (e) {

        } finally {
            return value || defaultReturn
        }
    }
}