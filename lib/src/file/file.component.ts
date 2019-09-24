import { Component, OnInit, ChangeDetectionStrategy, HostBinding, Input, ViewChild, ElementRef, Optional, Self, Inject, NgZone, SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs';
import { MatFormFieldControl } from '@angular/material/form-field';
import { NgControl } from '@angular/forms';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { FocusMonitor } from '@angular/cdk/a11y';
import { CyiaUploadComponent } from '../upload';
import { CustomControlBase } from '../form/class/custom-control.base';

@Component({
  selector: 'cyia-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: MatFormFieldControl, useExisting: FileComponent }
  ],
  host: {
    '[attr.aria-invalid]': 'errorState',
  }
})
export class FileComponent extends CustomControlBase implements MatFormFieldControl<FileComponent> {
  static nextId = 0;
  @HostBinding() id = `cyia-file-${FileComponent.nextId++}`;
  @ViewChild('input', { static: true }) input: ElementRef<HTMLInputElement>;
  @Input() cyiaUpload: CyiaUploadComponent
  /**通知表单字段执行变更检测 */
  stateChanges = new Subject<void>();

  controlType = 'cyia-file';
  /**当无效时,会变红,修改为invalid决定 */
  errorState: boolean = false;
  /**是否禁用 */
  @Input() get disabled() {
    return this._disabled
  }
  set disabled(value) {
    value = coerceBooleanProperty(value)
    if (value === this._disabled) return
    this._disabled = value;
    this.stateChanges.next()
  }
  private _disabled = false;
  /**占位符 */
  @Input()
  get placeholder() {
    return this._placeholder;
  }
  set placeholder(plh) {
    if (this._placeholder === plh) return
    this._placeholder = plh;
    this.stateChanges.next();
  }
  private _placeholder: string;
  // /**是否必填 */
  @Input()
  get required() {
    return this._required;
  }
  set required(req) {
    req = coerceBooleanProperty(req);
    if (req === this._required) return
    this._required = req
    this.stateChanges.next();
  }
  private _required = false;
  /**焦点 */
  focused = false;
  /**是否为空,应该是无文件时为空 */
  get empty(): boolean {
    return !this.value
  }

  /**是否应该把标签浮动到上面,获得焦点或者不为空 */
  @HostBinding('class.floating')
  get shouldLabelFloat() {
    return !this.empty || this.focused;
  }
  /**未知 */
  @HostBinding('attr.aria-describedby') describedBy = '';
  /**
 * ! 未知
 * @description 
 * @author cyia
 * @date 2018-09-15
 * @param ids
 * @memberof CyiaDatePickerComponent
 */
  setDescribedByIds(ids: string[]) {
    this.describedBy = ids.join(' ');
  }
  /**
 * @description 设置获取值用
 * @memberof DatePickerComponent
 */
  @Input()
  set value(val: any) {
    this._value = val
    this.stateChanges.next()
    this.notifyValueChange(val)
  };
  get value() {
    return this._value
  }
  _value: File | File[];
  filename: string
  filenameDisabled = true
  constructor(
    fm: FocusMonitor,
    elRef: ElementRef,
    @Optional() @Self() public ngControl: NgControl,
  ) {
    super()
    if (this.ngControl != null) this.ngControl.valueAccessor = this;
    fm.monitor(elRef.nativeElement, true).subscribe((origin) => {
      this.focused = !!origin
      this.stateChanges.next()
    })
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.cyiaUpload && this.cyiaUpload) {
      this.cyiaUpload.fileChange.subscribe((file) => this.fileChange(file))
    }
  }
  ngOnInit() {
  }

  /**
 * @description 点击表单字段,链接到点击input
 * @author cyia
 * @date 2018-09-15
 * @param event
 * @memberof CyiaDatePickerComponent
 */
  onContainerClick(event: MouseEvent) {
    const target: HTMLElement = event.target as any
    if (!/^(input|mat-icon|button)$/.test(target.tagName.toLowerCase())
    ) {
      this.input.nativeElement.focus()
    }
  }
  ngOnDestroy(): void {
    this.stateChanges.complete()
  }
  fileChange(file: File | File[]) {
    if (file instanceof File) {
      this.filename = file.name
      this.filenameDisabled = false
    } else {
      this.filename = file.map((item) => item.name).join(',')
      this.filenameDisabled = true
    }
    // this.file = file
    this.value = file
  }
  filenameChange(val: string) {
    if (!this.value) return
    const file = new File([(<File>this.value)], val, { type: (<File>this.value).type });
    this.value = file
  }
  writeValue(val) {
    if (val instanceof File || val instanceof Array && (val.length && val.filter((file) => file instanceof File).length || val.length == 0)) {
      this._value = val
      this.filenameDisabled = val instanceof Array ? true : false
      this.stateChanges.next()
    }
  }
}
