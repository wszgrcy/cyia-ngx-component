import { TypeJudgment, jsNativeType } from 'cyia-ngx-common';
import { Component, ViewChild } from '@angular/core';
import { ModelViewPropertyConfig, componentType, FormPropertyValueObj, CyiaFormService } from 'cyia-ngx-form';
import { TEST_ARRAY } from './select-test/select-test.define';
import { FormBuilder } from '@angular/forms';
import { CyiaDatePickerComponent } from 'lib/src/lib/date-picker/date-picker.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('cyiadate') cyiadate: CyiaDatePickerComponent
  constructor(private fb: FormBuilder,
    private formB: CyiaFormService
  ) { }
  input1
  date = new Date().getTime();
  
  @ViewChild('picker2') picker
  list = []
  selvalue
  ngOnInit(): void {
    this.copyobj()

  }
  test() {
  }
  ngAfterViewInit(): void {
    console.log('!', this.cyiadate.empty)
  }
  copyobj() {
    /**配置的副本 */
    let configDuplicate: ModelViewPropertyConfig[] = _newArray(TEST_ARRAY);
    let obj = mixinMVPArray(configDuplicate, {
      name: '测试123',
      t2: { name: '对象内name' },
      t3: [{ name: '第一个' }, { name: '第二个' }],
      id: 1
    })
    console.log(configDuplicate)
    let selobj = obj.find((value) => {
      return value.token == 'select'
    })
    this.selvalue = selobj.value;
    selobj.dataSource.fn(selobj.value).then((res) => {
      console.log(res)
      this.list = res
    })
    let nameV = transform2FBConfig(obj);
    console.warn(nameV);
    // console.warn(this.fb.group(nameV))
    let bb = this.formB.object2Form({ value: nameV.id }, null, 2)
    console.log(bb)
  }
}
//获取的值要加入到配置中来
function creatNewConfig(obj, ) {

}

function transform2FormConfig(array: ModelViewPropertyConfig[]) {


}

/**
 * 键值混合
 *
 * @param {ModelViewPropertyConfig[]} configArray
 * @param {*} valueObj
 */
function mixinMVPArray(configArray: ModelViewPropertyConfig[], valueObj: any) {
  // console.log(configArray);
  configArray.map((val) => {
    val.key = val.key || val.keyPath[val.keyPath.length - 1]
    switch (val.type) {
      case componentType.ARRAY:
        val = mixinMVPArrayModel(val, valueObj)
        break;
      case componentType.OBJECT:
        val.children = mixinMVPArray(val.children as ModelViewPropertyConfig[], valueObj)
        break;
      default:
        // console.log(val.token)
        val.value = getValue(val.valuePath || val.keyPath, valueObj)
        break;
    }
    return val
  })
  return configArray
}

function mixinMVPArrayModel(configObject: ModelViewPropertyConfig, valueObj: any) {
  /**应该是个数组 */
  let value: any[] = getValue(configObject.valuePath || configObject.keyPath, valueObj);
  // console.log(value)
  /**保存元素模型供后来使用 */
  let childModel = _newArray(configObject.children[0])
  configObject.children = new Array(value.length);
  for (let i = 0; i < configObject.children.length; i++) {
    configObject.children[i] = _newArray(childModel);
    /**未填入数值的每一组元素 */
    let childValue: ModelViewPropertyConfig[] = configObject.children[i] as any;
    //todo 需要对数组进行赋值
    // console.log(childValue)
    childValue = mixinMVPArray(childValue, value[i])
  }
  return configObject
}
/**获得数值 */
function getValue(pathArray: any[], valueObj) {
  let value = null;
  for (let i = 0; i < pathArray.length; i++) {
    const val = pathArray[i];
    if (!value)
      value = valueObj[val];
    else
      value = value[val];
    if (!value) break;
  }
  return value;
}
function _newObj<T>(obj): T {
  let newObj = {} as any;
  for (const x in obj) {
    if (obj.hasOwnProperty(x)) {
      const element = obj[x];
      switch (TypeJudgment.getType(element)) {
        case jsNativeType.object:
          newObj[x] = _newObj(element)
          break;
        case jsNativeType.array:
          newObj[x] = _newArray(element)
          break;
        default:
          newObj[x] = element
          break;
      }
    }
  }
  return newObj
}
function _newArray(array: Array<any>) {
  let newArray = new Array();
  /**数组中的元素类型 */
  let arrayType = TypeJudgment.getArrayType(array)
  switch (arrayType) {
    case jsNativeType.object:
      (<any[]>array).forEach((val, i) => {
        newArray[i] = _newObj(val);
      })
      break;
    case jsNativeType.array:
      (<any[]>array).forEach((val, i) => {
        newArray[i] = _newArray(val)
      })
    default:
      newArray = (<any[]>array).concat()
      break;
  }
  return newArray;
}
/**
 *todo 1.将数组对象化
 * todo 2. 非children正常处理
 * todo 3. 有children 1.type为对象,children0直接处理,2.为数组,for后处理为数组
 * @param {ModelViewPropertyConfig[]} config
 */
function transform2FBConfig(config: ModelViewPropertyConfig[]) {
  return _getConfig2Object(config)
}
function _getConfig2Array(config: ModelViewPropertyConfig[][]) {
  let array = [];
  for (let i = 0; i < config.length; i++) {
    const element = config[i];
    array[i] = _getConfig2Object(element)
  }
  return array
}
function _getConfig2Object(config: ModelViewPropertyConfig[]) {
  let obj = {} as any;
  for (let i = 0; i < config.length; i++) {
    const configItem = config[i];
    switch (configItem.type) {

      case componentType.ARRAY:
        obj[configItem.key] = {
          value: _getConfig2Array(configItem.children as any),
          disabled: configItem.disabled,
          validatorList: configItem.validatorList
        }
        break;
      case componentType.OBJECT:
        obj[configItem.key] = {
          value: _getConfig2Object(configItem.children as any),
          disabled: configItem.disabled,
          validatorList: configItem.validatorList
        }
        console.log(configItem.key)
        break;

      default:
        obj[configItem.key] = {
          value: configItem.value,
          disabled: configItem.disabled,
          validatorList: configItem.validatorList
        }

        break;
    }

  }
  return obj
}