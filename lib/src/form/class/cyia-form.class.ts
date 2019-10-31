import { Subject } from 'rxjs'
import { ChangeEmit } from '../decorator/change-emit.decorator'
import { ReturnBoolean } from '../type/return-boolean'
import { Validator, Validators, ValidatorFn, FormControl } from '@angular/forms'
import { ReturnString } from '../type/return-string'
import { ReturnValue } from '../type/return-Value'
import { FormControlType } from '../enum/control-type.enum'
import { CyiaFormControlChange } from '../type/change-type.type'
import { ListenClass } from '../decorator/listen-class.decorator'
import { ChangeSubscribe } from '../decorator/change-subscribe.decorator'
import { MatFormFieldAppearance } from '@angular/material/form-field'
import { TemplateRef, Type } from '@angular/core';
import { CyiaOption } from '../type/options.type';
import { LayoutStyle } from '../type/form-group.type';
import { classClone } from 'cyia-ngx-component/common'
// @ListenClass()
export class CyiaControlBase {
    readonly key?: string = `${Math.random()}`
    /**显示标签,控件内 */
    @ChangeEmit()
    label?: string;
    /**是否输出,控件内/组过滤 */
    @ChangeEmit()
    output?: boolean = true
    /**是否输出错误,控件内 */
    @ChangeEmit()
    outputError?: boolean = true
    /**隐藏控件,控件内 */
    @ChangeEmit()
    hidden?: boolean = false
    showLabel?: boolean = true
    description?: string
}
export class _CyiaFormControl<T = any> extends CyiaControlBase {
    linkKey?: string
    // key?: string = `${Math.random()}`
    /**值变化,控件内 */
    @ChangeEmit()
    value?: T
    /**
     * doc 相关状态变化
     * 
     */
    /**是否禁用,控件内 */
    @ChangeEmit()
    disabled?: boolean = false
    /**占位符,控件内 */
    @ChangeEmit()
    placeholder?: string = ''
    // @ChangeEmit()
    // /**隐藏控件,控件内 */
    // hidden?: boolean = false
    // @ChangeEmit()
    // /**显示标签,控件内 */
    // label?: string;
    /**是否显示错误,表单域内使用,控件内 */
    displayError?: boolean = true
    /**控件提示,表单域内使用,控件内 */
    hint?: string
    /**标签位置,控件内 */
    @ChangeEmit()
    labelPosition?: 'float' | 'inline' | 'default' | 'none' = 'default'
    /**是否必须,控件内 */
    required?= false
    // @ChangeEmit()
    // /**是否输出,控件内/组过滤 */
    // output?: boolean = true
    // @ChangeEmit()
    // /**是否输出错误,控件内 */
    // outputError?: boolean = true
    /**加入到表单控件中,如果是true,那么还需要再加入回来,group内 */
    @ChangeEmit()
    join?: boolean = true
    /**用于区分不同控件,控件内 */
    @ChangeEmit()
    type?: FormControlType = FormControlType.input
    /**
     * todo
     * 子类路径,控件内 */
    @ChangeEmit()
    subType?: string
    @ChangeEmit()
    /**模式,读,写,控件内 */
    pattern?: Pattern = Pattern.r
    /**不同样式?,加载哪个样式上待商定,暂时不实现 */
    @ChangeEmit()
    style?: Object
    @ChangeEmit()
    /**类,加载在控件上 */
    class?: string = ''
    /**除了label外,还应该有其他的.比如是不是必须
     * 是不是:
     * 后缀template
     * 前缀template
     */
    // /**与隐藏冲突,废弃 */
    // @ChangeEmit()
    // display?: boolean = true
    /**验证器,控件内 */
    @ChangeEmit()
    validator?: ValidatorFn[]
    /**限制输入,input,textarea,autocomplete,控件内 */
    // @ChangeEmit()
    limit?: (arg0: this, now, value) => boolean;
    /**md特性 */
    appearance?: MatFormFieldAppearance = 'legacy'
    /**select.radio,slider,slidetoggle,autocomplete,控件内 */
    options?: (arg0: this) => Promise<CyiaOption<T>[]> = async () => []
    /**自定义选项的模板,控件内 */
    optionTemplate?: TemplateRef<any>
    /**输入值管道转化,控件内
     * 输入的是a但是想进入后value赋值为b
     */
    inputPipe?: (arg0: this, value) => any
    /**输出值管道转化,控件内 */
    outputPipe?: (arg0: this, value) => any
    /**
     * todo 只要是options都应该可以用
     * autocomplete使用 */
    filterPipe?: (arg0: this, value) => Promise<CyiaOption<T>[]>
    /**级联用 */
    valueChange?: (arg0: this, formControl: FormControl, value) => Promise<CyiaFormControlChange[]>
    height?: number | string
    /**自定义选择器传入组件 */
    component?: Type<any>
}
export class CyiaFormControl<T = any> extends _CyiaFormControl {
    change$: Subject<CyiaFormControlChange>

    constructor(cyiaFormControl?: _CyiaFormControl) {
        super()
        this.change$ = this._changeFn() as any
        // console.log(this.change$)
        // this._setValue(cyiaFormControl)
        classClone.call(this, cyiaFormControl)
    }

    /**控件路径,应该由grouop赋值 */
    path: string[]
    @ChangeSubscribe()
    private _changeFn() {

    }
}
export class _CyiaFormGroup extends CyiaControlBase {
    layoutStyle?: LayoutStyle = LayoutStyle.cssGrid
    gridTemplateAreas?: number[][] = [[]]
    /**表格的大小[2,3]2*3 */
    tableSize?: Number[] = []
    controls?: (_CyiaFormControl | _CyiaFormGroup)[] = []
}
export class CyiaFormGroup extends _CyiaFormGroup {
    controls?: (CyiaFormControl | CyiaFormGroup)[] = []
    // key?: string = `${Math.random()}`
    // output?: boolean = true
    // outputError?: boolean = true
    constructor(config: _CyiaFormControl) {
        super()
        classClone.call(this, config)
    }
    /**
     * 设置布局用
     * 通过设置列,快速设置布局
     * @param  column
     * @returns
     * @memberof CyiaFormGroup
     */
    setColumn(column: number) {
        let length = this.controls.length;
        let row = (length / column) | 0;
        switch (this.layoutStyle) {
            case LayoutStyle.cssGrid:
                this.gridTemplateAreas = []
                for (let i = 0; i < row; i++) {
                    this.gridTemplateAreas[i] = []
                    for (let j = 0; j < column; j++) {
                        let num = i * column + j + 1
                        if (num > length) num = 0
                        this.gridTemplateAreas[i][j] = num;
                    }
                }
                break;
            case LayoutStyle.htmlTable:
                this.tableSize = [row, column];
                break
            default:
                break;
        }
        return this
    }
    getControl(key: string, withLink = false) {
        return this.controls.find((control) => control.key == key || (withLink ? control['linkKey'] == key : false))
    }

    setPattern(pattern: Pattern) {
        this.controls.forEach((control) => {
            if (control instanceof CyiaFormControl) control.pattern = pattern
        })
        return this
    }
    setValue(obj) {
        for (const key in obj) {
            if (!obj.hasOwnProperty(key)) continue
            const value = obj[key];
            let control = this.getControl(key, true)
            if (control instanceof CyiaFormControl) {
                control.value = value
            } else if (control instanceof CyiaFormGroup) {
                control.setValue(value)
            }
        }
    }
}
// export class CyiaFormArray {
//     key: string = ''
//     list: (CyiaFormControl | CyiaFormGroup | CyiaFormArray)[]
// }
export enum Pattern {
    w = 'w', r = 'r'
}