import { componentType, ModelViewPropertyConfig } from "cyia-ngx-form";

export const T1_CONFIG: ModelViewPropertyConfig[] = [
    {
        token: 'id', keyPath: ['id'], key: 'id', valuePath: ['id'], value: null, disabled: false, required: false, validatorList: null, label: '测试', sort: 1, type: componentType.UNDISPLAY, placeholder: '缺省提示', list: [], variety: null
    },
    {
        token: 'name', keyPath: ['name'], key: 'name', valuePath: ['name'], value: null, disabled: false, required: false, validatorList: null, label: '输入', sort: 1, type: componentType.INPUT, placeholder: '', list: [], variety: null
    }
]

function dataSourceFromSelf(value): Promise<any> {
    return new Promise((res) => {
        console.log(this)
        res([{ label: value, value: value }])
    })
}
function dataSourceFromList(value): Promise<any> {
    return new Promise((res) => {

        res(this.param[0])
    })
}
