import { FormControlType } from '../enum/control-type.enum'
import { CyiaOption } from '../type/options.type';
import { Validator, Validators, ValidatorFn, FormControl } from '@angular/forms'
import { CyiaFormControlChange } from '../type/change-type.type'
import { MatFormFieldAppearance } from '@angular/material/form-field'
import { TemplateRef } from '@angular/core';
import { Pattern, CyiaControlBase } from '../class/cyia-form.class';
/**
 * 传入参数根据不同控件,显示不同属性
 * todo 实现优先级低
 */
export interface CyiaSelectFormControl<T = any> {
    type: FormControlType.select
    options: (arg0: this) => Promise<CyiaOption<T>[]>
}
export class FormControlCommonField<T = any> extends CyiaControlBase {
    //doc 每一个都不同
    // type: FormControlType.input
    linkKey?: string
    /**值变化,控件内 */
    value?: T
    /**是否禁用,控件内 */
    disabled?: boolean
    /**占位符,控件内 */
    placeholder?: string
    /**是否显示错误,表单域内使用,控件内 */
    displayError?: boolean
    /**控件提示,表单域内使用,控件内 */
    hint?: string
    // labelPosition?: 'float' | 'inline' | 'default' | 'none'
    /**是否必须,控件内 */
    required?: boolean
    /**加入到表单控件中,如果是true,那么还需要再加入回来,group内 */
    join?: boolean
    /**用于区分不同控件,控件内 */
    /**
     * todo
     * 子类路径,控件内 */
    subType?: string
    /**模式,读,写,控件内 */
    pattern?: Pattern
    /**不同样式?,加载哪个样式上待商定,暂时不实现 */
    style?: Object
    /**类,加载在控件上 */
    class?: string
    /**验证器,控件内 */
    validator?: ValidatorFn[]
    /**限制输入,input,textarea,autocomplete,控件内 */
    // 
    // limit?: (arg0: this, now, value) => boolean;
    /**md特性 */
    // appearance?: MatFormFieldAppearance
    /**select.radio,slider,slidetoggle,autocomplete,控件内 */
    // options?: (arg0: this) => Promise<CyiaOption<T>[]>
    /**自定义选项的模板,控件内 */
    // optionTemplate?: TemplateRef<any>
    /**输入值管道转化,控件内
     * 输入的是a但是想进入后value赋值为b
     */
    inputPipe?: (arg0: this, value) => any
    /**输出值管道转化,控件内 */
    outputPipe?: (arg0: this, value) => any
    /**
     * todo 只要是options都应该可以用
     * autocomplete使用 */
    // filterPipe?: (arg0: this, value) => Promise<CyiaOption<T>[]>
    /**级联用 */
    valueChange?: (arg0: this, formControl: FormControl, value) => Promise<CyiaFormControlChange[]>
    height?: number | string
}
export class CyiaInputFormControl<T = any> extends FormControlCommonField {
    type: FormControlType.input
    /**限制输入,input,textarea,autocomplete,控件内 */
    limit?: (arg0: this, now, value) => boolean;
    labelPosition?: 'float' | 'inline' | 'default' | 'none'

}
export type CyiaFormControlType = CyiaSelectFormControl | CyiaInputFormControl


