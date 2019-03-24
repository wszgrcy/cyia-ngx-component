import { componentType, ModelViewPropertyConfig } from "cyia-ngx-form";

export const T1_CONFIG: ModelViewPropertyConfig[] = [
    {
        token: 'id', keyPath: ['id'], key: 'id', valuePath: ['id'], value: null, disabled: false, required: false, validatorList: null, label: '测试', sort: 1, type: componentType.UNDISPLAY, placeholder: '缺省提示', list: [], variety: null
    },
    {
        token: 'name', keyPath: ['name'], key: 'name', valuePath: ['name'], value: null, disabled: false, required: false, validatorList: null, label: '输入', sort: 1, type: componentType.INPUT, placeholder: '', list: [], variety: null
    },
    {
        token: 'name', keyPath: ['name'], key: 'name', valuePath: ['name'], value: null, disabled: false, required: false, validatorList: null, label: '密码', sort: 1, type: componentType.INPUT, placeholder: '', list: [], variety: null,
        controlType: 'password'
    },
    {
        token: 'name', keyPath: ['name'], key: 'name', valuePath: ['name'], value: null, disabled: false, required: false, validatorList: null, label: '上传单一', sort: 1, type: componentType.UPLOAD_ONE, placeholder: '', list: [], variety: null,
        controlType: 'image/gif,image/jpeg,image/jpg,image/png,image/svg'
    },
    {
        token: 'name', keyPath: ['name'], key: 'name', valuePath: ['name'], value: null, disabled: false, required: false, validatorList: null, label: '上传多个', sort: 1, type: componentType.UPLOAD_MULTI, placeholder: '', list: [], variety: null,
        controlType: 'image/gif,image/jpeg,image/jpg,image/png,image/svg'
    },
    {
        token: 'name', keyPath: ['name'], key: 'name', valuePath: ['name'], value: null, disabled: false, required: false, validatorList: null, label: '选项', sort: 1, type: componentType.SELECT_ONE, placeholder: '', list: [], variety: null,
        dataSource: {
            fn: dataSourceFromList,
            target: 'list'
        }
    },
    {
        token: 'name', keyPath: ['name'], key: 'name', valuePath: ['name'], value: null, disabled: false, required: false, validatorList: null, label: '选项', sort: 1, type: componentType.SELECT_MULTI, placeholder: '', list: [], variety: null,
        dataSource: {
            fn: dataSourceFromList,
            target: 'list'
        }
    },
    {
        token: 'date', keyPath: ['date'], key: 'date', valuePath: ['date'], value: null, disabled: false, required: false, validatorList: null, label: '日期', sort: 1, type: 6, placeholder: '', list: [], variety: null,
        dataSource: {
            fn: dataSourceFromList,
            target: 'list'
        }
    },
]

function dataSourceFromSelf(value): Promise<any> {
    return new Promise((res) => {
        console.log(this)
        res([{ label: value, value: value }])
    })
}
function dataSourceFromList(value): Promise<any> {
    console.log('参数', value)
    return new Promise((res) => {
        let value = [
            { label: '选项1', value: 1 },
            { label: '选项2', value: 2 },
            { label: '选项3', value: 3 },
        ]
        res({
            result: value
        })
    })
}
