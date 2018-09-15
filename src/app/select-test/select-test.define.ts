import { ModelViewPropertyConfig, componentType } from "cyia-ngx-form";
export const TEST_ARRAY: ModelViewPropertyConfig[] = [
    {
        token: 'sel', keyPath: ['name'], valuePath: ['name'], value: 123, disabled: false, required: false, validatorList: null, label: '测试', sort: 1, type: componentType.INPUT, placeholder: '缺省提示', dataSource: {
            fn: dataSourceFromSelf,
            param: [],
            nextToken: '',
            delay: false
        }, list: [], variety: null
    },
    {
        token: 'select', keyPath: ['id'], valuePath: ['id'], value: null, disabled: false, required: false, validatorList: null, label: '测试', sort: 1, type: componentType.INPUT, placeholder: '缺省提示', dataSource: {
            fn: dataSourceFromSelf,
            param: [],
            nextToken: '',
            delay: false
        }, list: [], variety: null
    },
    {
        token: 'sel2', keyPath: ['t2'], valuePath: ['t2'], disabled: false, required: false, validatorList: null, label: '测试', sort: 1, type: componentType.OBJECT, placeholder: '缺省提示', dataSource: {
            fn: dataSourceFromSelf,
            param: [],
            nextToken: '',
            delay: false
        }, list: [], variety: null, children: [
            {
                token: 'sel21', keyPath: ['t2', 'name'], valuePath: ['t2', 'name'], value: 123, disabled: false, required: false, validatorList: null, label: '测试', sort: 1, type: componentType.INPUT, placeholder: '缺省提示', dataSource: {
                    fn: dataSourceFromSelf,
                    param: [],
                    nextToken: '',
                    delay: false
                }, list: [], variety: null
            },
        ]
    },
    {
        token: 'sel3', keyPath: ['t3'], valuePath: ['t3'], disabled: false, required: false, validatorList: null, label: '测试', sort: 1, type: componentType.ARRAY, placeholder: '缺省提示', dataSource: {
            fn: dataSourceFromSelf,
            param: [],
            nextToken: '',
            delay: false
        }, list: [], variety: null, children: [
            [{
                token: 'sel31', keyPath: ['name'], valuePath: ['name'], value: 123, disabled: false, required: false, validatorList: null, label: '测试', sort: 1, type: componentType.INPUT, placeholder: '缺省提示', dataSource: {
                    fn: dataSourceFromSelf,
                    param: [],
                    nextToken: '',
                    delay: false
                }, list: [], variety: null
            }]

        ]
    }
]



function dataSourceFromSelf(value): Promise<any> {
    return new Promise((res) => {
        console.log(this)
        res([{ label: value, value: value }])
    })
}
