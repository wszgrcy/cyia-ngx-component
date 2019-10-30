import { Directive, Input, forwardRef, ElementRef, Inject, Optional } from '@angular/core';
// import { CustomControlBase } from '../form/class/custom-control.base';
import { MAT_INPUT_VALUE_ACCESSOR } from '@angular/material/input';
import { CustompickerWrapperComponent } from './custompicker-wrapper/custompicker-wrapper.component';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { filter } from 'rxjs/operators';
import { MatFormField } from '@angular/material/form-field';
/**
 * todo 后期抽出公共
 */
interface CyiaOption<T = any> {
  label: string
  value: T
  default?: T
  disabled?: boolean
  [name: string]: any
}
@Directive({
  selector: '[cyiaCustompickerInput]',
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => CustompickerInput), multi: true },
    { provide: MAT_INPUT_VALUE_ACCESSOR, useExisting: CustompickerInput }
  ],
  host: {
  }
})
export class CustompickerInput {
  @Input() set cyiaCustompickerInput(val) {
    this._cyiaCustompickerInput = val
    val.custompickerInput = this
  }
  @Input() options: CyiaOption[] = []
  get cyiaCustompickerInput() {
    return this._cyiaCustompickerInput
  }
  _cyiaCustompickerInput: CustompickerWrapperComponent
  hostElement: HTMLInputElement
  constructor(
    private elementRef: ElementRef<HTMLInputElement>,
    @Optional() private matFiled: MatFormField
  ) {
    this.hostElement = this.elementRef.nativeElement
  }
  ngOnInit(): void {
    this.cyiaCustompickerInput.resultChange
      .pipe(filter((value) => value !== undefined))
      .subscribe((e: { value: any, display: string }) => {
        this.notifyValueChange(e.value)
        if (e.display != undefined)
          this.hostElement.value = e.display
      })
  }
  writeValue(val) {
    if (val === null) return
    this.value = val
    //doc 保存从外界输入的,并在打开弹窗是赋值
    this.cyiaCustompickerInput.inputChange.next(this.value)
    const option = this.options.find((option) => option.value == val)
    this.hostElement.value = option ? option.label : this.hostElement.value
  }

  value: any
  // disabled
  notifyValueChange(value) {
    this.value = value
    this.changeFn(value)
    this.touchedFn(value)
  }

  changeFn: Function = () => { };
  touchedFn: Function = () => { };
  registerOnChange(fn) {
    this.changeFn = fn
  }
  registerOnTouched(fn) {
    this.touchedFn = fn
  }
  getConnectedOverlayOrigin() {
    return this.matFiled ? this.matFiled.getConnectedOverlayOrigin() : this.elementRef
  }
}
