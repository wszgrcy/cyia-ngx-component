import { Component, forwardRef, Input, ChangeDetectionStrategy, ChangeDetectorRef, Output, EventEmitter, ViewChild } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { CyiaFormControl } from '../../class/cyia-form.class';
import { CyiaFormGroupService } from '../cyia-form-group/cyia-form-group.service';
import { CyiaFormControlWriteComponent } from '../cyia-form-control-write/cyia-form-control-write.component';
@Component({
  selector: 'cyia-form-control',
  templateUrl: './cyia-form-control.component.html',
  styleUrls: ['./cyia-form-control.component.scss'],
  providers: [{
    useExisting: forwardRef(() => CyiaFormControlComponent),
    provide: NG_VALUE_ACCESSOR,
    multi: true
  }],
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class CyiaFormControlComponent implements ControlValueAccessor {
  /**用于label关联 */
  @ViewChild(CyiaFormControlWriteComponent, { static: false }) writeControl: CyiaFormControlWriteComponent
  @Input() service: CyiaFormGroupService
  @Input() cyiaFormControl: CyiaFormControl
  @Output() errorsChange = new EventEmitter()
  @Output() statusChange = new EventEmitter()
  set value(value) {
    this._value = value
    this.notifyValueChange(value)
  }
  get value() {
    return this._value
  }
  _value
  private changeFn: Function = () => { };
  private touchedFn: Function = () => { };
  constructor(
    private cd: ChangeDetectorRef
  ) { }


  ngOnInit() {
  }

  registerOnChange(fn) {
    this.changeFn = fn;
  }
  registerOnTouched(fn) {
    this.touchedFn = fn;
  }

  writeValue(value) {
    this._value = value
    this.cd.markForCheck()
  }
  /**
   * 在valueChange时告知外界值变更
   *
   * @author cyia
   * @date 2019-09-12
   * @param value
   */
  notifyValueChange(value) {
    this.changeFn(value)
    this.touchedFn(value)
  }

}
