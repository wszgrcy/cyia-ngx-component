import { Moment } from 'moment';
import { Input, HostBinding, ElementRef, Optional, Self, Output, EventEmitter, ViewChild, ViewContainerRef, TemplateRef, Component, ViewEncapsulation } from '@angular/core';
import { MatFormFieldControl, MatDatepickerInputEvent, MatDatepicker } from '@angular/material';
import { coerceMoment } from '../cdk/cyia-coercion';
import { Subject } from 'rxjs';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { FocusMonitor } from '@angular/cdk/a11y';
import { coerceBooleanProperty, coerceNumberProperty } from '@angular/cdk/coercion';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { AccurateTime } from '../define/date-picker.define';


@Component({
  selector: 'cyia-datepicker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
  providers: [{ provide: MatFormFieldControl, useExisting: DatePickerComponent }],
  encapsulation: ViewEncapsulation.None,

})
export class DatePickerComponent implements MatFormFieldControl<any>, ControlValueAccessor {
  /**用来决定是否显示小时,分钟 */
  @Input() accurate: boolean = false;
  _value: Moment;
  @Input() matDatepicker: MatDatepicker<any>;
  static nextId = 0;
  @HostBinding() id = `cyia-datepicker-${DatePickerComponent.nextId++}`;
  stateChanges = new Subject<void>();
  @Input() matDatepickerFilter;
  @Input() get disabled() {
    return this._disabled
  }
  set disabled(value) {
    this._disabled = coerceBooleanProperty(value)
  }
  private _disabled = false;
  @Input() get max() {
    return this._max
  }
  set max(value) {
    this._max = coerceNumberProperty(value)
  }
  private _max
  @Input() get min() {
    return this._min
  }
  set min(value) {
    this._min = coerceNumberProperty(value)
  }
  private _min;
  @Output()
  dateChange: EventEmitter<MatDatepickerInputEvent<any>>
  @Output()
  dateInput: EventEmitter<MatDatepickerInputEvent<any>>
  @ViewChild('input') input;
  @ViewChild('accurateTime') accurateTime: TemplateRef<any>;
  overlayRef: OverlayRef;
  @Input()
  set value(time: any) {
    this._value = coerceMoment(time as any);
    if (this._value.isValid()) {
      this.changeFn(this._value.unix() * 1000);
      this.touchedFn(this._value.unix() * 1000);
      this.time.hour = this._value.hour();
      this.time.minute = this._value.minute();
      this.stateChanges.next()
    }
  };
  get value() {
    return this._value;
  }


  private time: AccurateTime = {
    hour: null,
    minute: null
  }
  constructor(
    private fm: FocusMonitor,
    private elRef: ElementRef,
    @Optional() @Self() public ngControl: NgControl,
    private overlay: Overlay,
    private viewContainerRef: ViewContainerRef
  ) {
    fm.monitor(elRef.nativeElement, true).subscribe((origin) => {
      this.focused = !!origin
    })
    if (this.ngControl != null) { this.ngControl.valueAccessor = this; }
  }
  ngOnInit() {
    let strategy = this.overlay.position().
      connectedTo(this.input, { originX: 'end', originY: 'top' }, { overlayX: 'start', overlayY: 'top' }).withOffsetX(24);
    this.overlayRef = this.overlay.create({
      hasBackdrop: true,
      backdropClass: 'mat-overlay-transparent-backdrop',
      positionStrategy: strategy
    })

    this.overlayRef.backdropClick().subscribe({
      next: (res) => {
        this.overlayRef.detach()
      }
    })

  }


  @Input() placeholder = '';
  @Input() required;

  focused = false;
  get empty(): boolean {
    return !!this.value
  }
  @HostBinding('class.floating')
  get shouldLabelFloat() {
    return this.focused || !this.empty;
  }

  @HostBinding('attr.aria-describedby') describedBy = '';


  errorState: boolean;
  setDescribedByIds(ids: string[]) {
    this.describedBy = ids.join(' ');
  }

  onContainerClick(event: MouseEvent) {
    if ((event.target as Element).tagName.toLowerCase() != 'input') {
      this.elRef.nativeElement.querySelector('input').focus();
    }
    if (!this.overlayRef.hasAttached())
      this.overlayRef.attach(new TemplatePortal(this.accurateTime, this.viewContainerRef))
  }
  /**写入值 */
  writeValue(value) {
    if (value !== undefined) {
      this.value = value;
    }
  }
  changeFn: Function = () => { };
  touchedFn: Function = () => { };

  /**
   * 初始化注册
   *
   * @param {*} fn
   * @memberof DatePickerComponent
   */
  registerOnChange(fn) {
    this.changeFn = fn
  }
  /**
 * 初始化注册
 *
 * @param {*} fn
 * @memberof DatePickerComponent
 */
  registerOnTouched(fn) {
    this.touchedFn = fn
  }
  ngOnDestroy(): void {
    this.stateChanges.unsubscribe();
    this.fm.stopMonitoring(this.elRef.nativeElement);
  }

  timeChange({ value, type }) {
    switch (type) {
      case 1:
        this._value.hour(value)
        break;
      case 2:
        this._value.minute(value)
        break;
      default:
        break;
    }
    this.changeFn(this._value.unix() * 1000);
    this.touchedFn(this._value.unix() * 1000);
  }
}
