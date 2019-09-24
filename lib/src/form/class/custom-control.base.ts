import { ControlValueAccessor } from '@angular/forms';

export class CustomControlBase<T = any> implements ControlValueAccessor {
    value: T
    // disabled
    notifyValueChange(value) {
        this.changeFn(value)
        this.touchedFn(value)
    }
    /**实现的方法 */
    writeValue(value) {
        if (value !== undefined) {
            this.value = value;
        }
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