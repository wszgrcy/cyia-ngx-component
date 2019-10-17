import { Directive, Input, forwardRef, ElementRef } from '@angular/core';
// import { CustomControlBase } from '../form/class/custom-control.base';
import { MAT_INPUT_VALUE_ACCESSOR } from '@angular/material/input';
import { CustompickerWrapperComponent } from './custompicker-wrapper/custompicker-wrapper.component';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { filter } from 'rxjs/operators';
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
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => CustompickerInputDirective), multi: true },
    { provide: MAT_INPUT_VALUE_ACCESSOR, useExisting: CustompickerInputDirective }
  ],
  host: {
  }
})
export class CustompickerInputDirective {
  @Input() set cyiaCustompickerInput(val) {
    this._cyiaCustompickerInput = val
  }
  @Input() options: CyiaOption[] = []
  get cyiaCustompickerInput() {
    return this._cyiaCustompickerInput
  }
  _cyiaCustompickerInput: CustompickerWrapperComponent
  hostElement: HTMLInputElement
  constructor(private elementRef: ElementRef<HTMLInputElement>) {
    this.hostElement = this.elementRef.nativeElement
  }
  ngOnInit(): void {
    this.cyiaCustompickerInput.resultChange
      .pipe(filter((value) => value !== undefined))
      .subscribe((e: { value: string, display: string }) => {
        this.notifyValueChange(e.value)
        if (e.display != undefined)
          this.hostElement.value = e.display
      })
  }
  writeValue(val) {
    const option = this.options.find((option) => option.value == val)
    this.hostElement.value = option ? option.label : this.hostElement.value
  }

  value: any
  // disabled
  notifyValueChange(value) {
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
}
