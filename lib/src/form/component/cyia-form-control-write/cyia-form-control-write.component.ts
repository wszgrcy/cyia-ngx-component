import { Component, OnInit, forwardRef, Input, ViewEncapsulation, ChangeDetectionStrategy, ChangeDetectorRef, NgZone, Output, EventEmitter, SimpleChanges, ViewChild } from '@angular/core';
import { NG_VALUE_ACCESSOR, FormControl, ValidationErrors } from '@angular/forms';
import { CyiaFormControl } from '../../class/cyia-form.class';
import { CyiaFormControlFlag } from '../../type/form-control.type';
import { take, filter } from "rxjs/operators";
import { FormControlType } from '../../enum/control-type.enum';
import { CyiaOption } from '../../type/options.type';
import { BehaviorSubject } from 'rxjs';
import { CyiaFormGroupService } from '../cyia-form-group/cyia-form-group.service';

@Component({
  selector: 'cyia-form-control-write',
  templateUrl: './cyia-form-control-write.component.html',
  styleUrls: ['./cyia-form-control-write.component.scss'],
  providers: [{
    useExisting: forwardRef(() => CyiaFormControlWriteComponent),
    provide: NG_VALUE_ACCESSOR,
    multi: true
  }],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': `cyiaFormControl&&(
      'label-position-'+cyiaFormControl.labelPosition+ ' '+cyiaFormControl.type+
      ' '+cyiaFormControl.class 
      )`,
    '[style.display]': `cyiaFormControl&&cyiaFormControl.hidden?'none':'' `

  }
})
export class CyiaFormControlWriteComponent {
  @ViewChild('pickerTemplate', { static: false }) set picker(val) {
    this._picker = val
    if (val) {
      this.cd.markForCheck()
      // this.cd.detectChanges()
    }
  }
  get picker() {
    return this._picker
  }
  _picker
  @Input() service: CyiaFormGroupService

  /**
   * 在只读情况下各种控件的处理
   */
  static index = 0
  id = `cyia-form-control-write-${CyiaFormControlWriteComponent.index++}`
  flag: CyiaFormControlFlag = {
    required: false,
    floatLabel: 'auto',
    formField: false
  }
  oldValue
  // _value
  errors
  nowError: string
  formControl: FormControl
  @Output() errorsChange = new EventEmitter()
  // @Output() statusChange = new EventEmitter()
  // readValue: string = ''
  options: CyiaOption[]
  /**
   * label显示,
   * 1.默认在左侧的 此时required用左侧,里面的required应该取消
   * 2.
   */
  /**
   * fill outline不能用 inline标签,显示不正常
   */
  @Input() set cyiaFormControl(value) {
    if (!value) return
    this.initFormControl(value)
    this.cyiaFormControlInput(value)
    //doc 取消上一次订阅
    this._cyiaFormControl && this._cyiaFormControl.change$.unsubscribe()
    //doc 订阅本次
    this.changeSubscribe(value)
    //doc 最后赋值
    this._cyiaFormControl = value
  }

  get cyiaFormControl() {
    return this._cyiaFormControl
  }
  _cyiaFormControl: CyiaFormControl

  private changeFn: Function
  private touchedFn: Function
  // valueInput$ = new BehaviorSubject(undefined)
  valueOutput$ = new BehaviorSubject(undefined)
  constructor(
    private cd: ChangeDetectorRef,
    private ngZone: NgZone
  ) { }


  /**
   * 改用响应式表单控制
   * 初始化表单控制
   * @author cyia
   * @date 2019-09-11
   * @param cyiaFormControl
   */
  initFormControl(cyiaFormControl: CyiaFormControl) {
    if (this.formControl) return
    let value = cyiaFormControl.inputPipe ? cyiaFormControl.inputPipe(cyiaFormControl, cyiaFormControl.value) : cyiaFormControl.value;
    this.formControl = new FormControl(
      value,
      cyiaFormControl.validator)
    this.formControl.valueChanges.subscribe(async (val) => {
      this.valueChange(cyiaFormControl, val)
    })
    //doc 初始化时向外界发送值,主要是为了,进行数据的级联
    this.valueChange(cyiaFormControl, value, true)
  }

  valueChange(cyiaFormControl: CyiaFormControl, val: any, init = false) {
    if ((val !== undefined && init) || !init) {
      //doc 错误提示
      this.errors = this.setErrorHint(this.formControl.errors)
      this.nowError = this.errors ? Object.values(this.errors)[0] as string : null
      //doc 如果允许输出错误,才输出
      cyiaFormControl.outputError && this.errorsChange.emit(this.errors)
    }
    //doc 控件值变更操作
    this.notifyValueChange(val, cyiaFormControl)
    //doc 如果是自动补全,那么需要计算出过滤的菜单
    if ([FormControlType.autocomplete, FormControlType.select, FormControlType.checkbox, FormControlType.slideToggle, FormControlType.radio].includes(cyiaFormControl.type)
    ) {
      cyiaFormControl.filterPipe && cyiaFormControl.filterPipe(cyiaFormControl, val).then((res) => {
        this.options = res || []
      })
    }
    if ((val !== undefined && init) || !init) {
      !this.formControl.touched && this.formControl.markAllAsTouched()
    }
    //doc 值变更外界调用(级联)
    cyiaFormControl.valueChange && this.service && cyiaFormControl.valueChange(cyiaFormControl, this.formControl, this.formControl.value).then((list) => this.service.event$.next(list))
  }

  registerOnChange(fn) {
    this.changeFn = fn;
    this.touchedFn && this.valueOutput()
  }
  registerOnTouched(fn) {
    this.touchedFn = fn;
    this.changeFn && this.valueOutput()
  }

  writeValue(value) {
    // this.valueInput$.next(value)
  }
  /**
   * 在控件的值变更时告知外界值变更
   *
   * @author cyia
   * @date 2019-09-12
   * @param value
   */
  notifyValueChange(value: string, cyiaFormControl: CyiaFormControl) {
    //doc 如果不允许输出,那么返回
    if (!cyiaFormControl.output) return
    //doc 如果有输出管道,先经过输出管道转化
    const outValue = cyiaFormControl.outputPipe ? cyiaFormControl.outputPipe(cyiaFormControl, value) : value;
    this.valueOutput$.next(outValue)
  }
  /**
   * 表单值输出订阅方法
   * 会在两个方法都赋值后,进行订阅
   * @memberof CyiaFormControlWriteComponent
   */
  valueOutput() {
    this.valueOutput$.pipe(
      // filter((value) => value !== undefined),
      filter(() => this.changeFn && !!this.touchedFn)).subscribe(async (outValue) => {
        if (!this.ngZone.isStable) {
          await this.ngZone.onStable.pipe(take(1)).toPromise()
        }
        this.changeFn(outValue)
        this.touchedFn(outValue)
      })
  }
  labelPositionChange(cyiaFormControl: CyiaFormControl) {
    if (cyiaFormControl.labelPosition == 'default') {
      this.flag.floatLabel = 'never'
      this.flag.required = false
    } else {
      this.flag.required = cyiaFormControl.required
    }
  }


  oldValueChange(cyiaFormControl: CyiaFormControl) {
    this.oldValue = cyiaFormControl.inputPipe ? cyiaFormControl.inputPipe(cyiaFormControl, cyiaFormControl.value) : cyiaFormControl.value
  }
  formFieldChange(cyiaFormControl: CyiaFormControl) {
    this.flag.formField = cyiaFormControl.type == FormControlType.input ||
      cyiaFormControl.type == FormControlType.select ||
      cyiaFormControl.type == FormControlType.autocomplete ||
      cyiaFormControl.type == FormControlType.datepicker
    // debugger
    // console.log(cyiaFormControl.type, this.flag.formField);
  }
  async optionsChange(cyiaFormControl: CyiaFormControl) {
    this.options = []
    this.options = (await cyiaFormControl.options(cyiaFormControl));
    let defaultVaule = this.options.find((option) => option.default);
    //doc 无默认值不不赋值
    if (defaultVaule === undefined) return
    //doc 如果已经设置值,不再替换
    if (cyiaFormControl.value !== undefined) return
    this.formControl.patchValue(defaultVaule.value)
    //doc 设置控件值
    cyiaFormControl.value = defaultVaule.value
  }
  inputValueChange(cyiaFormControl: CyiaFormControl) {
    if (cyiaFormControl.value === undefined) return
    this.formControl.patchValue(cyiaFormControl.inputPipe ? cyiaFormControl.inputPipe(cyiaFormControl, cyiaFormControl.value) : cyiaFormControl.value)
  }
  disabledChange(cyiaFormControl: CyiaFormControl) {
    cyiaFormControl.disabled && this.formControl.disable()
    !cyiaFormControl.disabled && this.formControl.enable()
  }
  validatorChange(cyiaFormControl: CyiaFormControl) {
    if (cyiaFormControl.validator && cyiaFormControl instanceof Array) {
      this.formControl.setValidators(cyiaFormControl.validator)
    }
  }
  /**
   * 每次类变更的操作
   *
   * @author cyia
   * @date 2019-09-07
   * @param cyiaFormControl
   */
  async cyiaFormControlInput(cyiaFormControl: CyiaFormControl) {
    // this.inputValueChange(cyiaFormControl)
    await this.labelPositionChange(cyiaFormControl)
    await this.optionsChange(cyiaFormControl)
    await this.oldValueChange(cyiaFormControl)
    await this.formFieldChange(cyiaFormControl)
    this.cd.markForCheck()
  }
  changeSubscribe(cyiaFormControl: CyiaFormControl) {
    cyiaFormControl.change$
      .pipe(filter((change) => !change.target))
      .subscribe((val) => {
        switch (val.type) {
          case 'labelPosition':
            this.labelPositionChange(cyiaFormControl)
            break;
          case 'pattern':
            break
          case 'value':
            this.inputValueChange(cyiaFormControl)
            this.oldValueChange(cyiaFormControl)
            break
          case 'required':
            this.labelPositionChange(cyiaFormControl)
            break
          case 'type':
            this.formFieldChange(cyiaFormControl)
            break
          case 'options':
            this.optionsChange(cyiaFormControl)
            break
          case 'disabled':
            this.disabledChange(cyiaFormControl)
            break
          case 'validator':
            this.validatorChange(cyiaFormControl)
            break
          default:
            break;
        }

        this.cd.markForCheck()
      })
  }

  /**
   * 目前是对于input,textarea,autocomplete的限制
   *
   * @author cyia
   * @date 2019-09-07
   * @param e
   */
  limit(e) {
    if (e.inputType == 'insertText' || e.inputType == 'insertCompositionText' && e.data.trim()) {
      if (this.cyiaFormControl.limit && this.cyiaFormControl.limit(this.cyiaFormControl, e.data, this.formControl.value)) {
        this.ngZone.onStable.pipe(take(1)).subscribe(() => {
          this.formControl.patchValue(this.oldValue)
          this.cd.detectChanges()
        })
      } else {
        this.oldValue = this.formControl.value;
        //doc 设置控件的值.
        // this.cyiaFormControl.value = this.formControl.value
      }
    }
  }
  setErrorHint(errors: ValidationErrors) {
    const obj = {}
    for (const key in errors) {
      if (!errors.hasOwnProperty(key)) continue
      const element = errors[key];
      switch (key) {
        case 'required':
          obj[key] = '该字段为必填项'
          break;
        case 'minlength':
          obj[key] = `最小长度为${element.requiredLength},实际长度为${element.actualLength}`
          break
        case 'maxlength':
          obj[key] = `最大长度为${element.requiredLength},实际长度为${element.actualLength}`
          break;
        case 'email':
          obj[key] = '电子邮件格式不正确'
          break
        case 'pattern':
          obj[key] = '正则表达式匹配不正确'
          break
        default:
          obj[key] = element
          break;
      }
    }
    return Object.values(obj).length ? obj : null
  }
  // /**
  //  *!  当writeValue传入值时触发订阅
  //  * 目前依靠传入的实例变更,
  //  * @author cyia
  //  * @date 2019-09-12
  //  */
  // valueInputSubscribe() {
  //   this.valueInput$.subscribe((value) => {
  //     if (value === undefined) return
  //     this.formControl.patchValue(this._cyiaFormControl.outputPipe ? this._cyiaFormControl.outputPipe(this._cyiaFormControl, value) : value)
  //     this.cd.markForCheck()
  //   })
  // }
}
