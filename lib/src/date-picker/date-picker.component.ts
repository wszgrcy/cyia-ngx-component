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
  providers: [
    { provide: MatFormFieldControl, useExisting: CyiaDatePickerComponent }
  ],
  encapsulation: ViewEncapsulation.None,
  host: {
    '[attr.aria-invalid]': 'errorState',
  }
})
export class CyiaDatePickerComponent implements MatFormFieldControl<CyiaDatePickerComponent>, ControlValueAccessor {
  /**用来决定是否显示小时,分钟 */
  @Input() accurate: boolean = false;
  _value: Moment;
  @Input() matDatepicker: MatDatepicker<any>;
  /**用来给组件加id,但是能编译成功? */
  static nextId = 0;
  @HostBinding() id = `cyia-datepicker-${CyiaDatePickerComponent.nextId++}`;
  stateChanges = new Subject<void>();

  controlType = 'cyia-datepicker';

  @Input() matDatepickerFilter;
  /**是否禁用 */
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
  /**
   * @description 设置获取值用
   * @memberof DatePickerComponent
   */
  @Input()
  set value(time: any) {
    // console.log(time)
    this.checkEmpty(time)
    this._value = coerceMoment(time as any);
    if (this._value.isValid()) {
      this.errorState = false
      //doc,反馈给外层变动的时间
      this.changeFn(this._value.unix() * 1000);
      this.touchedFn(this._value.unix() * 1000);
      this.time.hour = this._value.hour();
      this.time.minute = this._value.minute();
      //doc 值变动时使用
      this.stateChanges.next()
    } else {
      this.errorState = true
    }
  };
  get value() {
    // console.log('get', this._value)
    return this._value;
  }

  /**精确时间值 */
  time: AccurateTime = {
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
    //doc 焦点
    fm.monitor(elRef.nativeElement, true).subscribe((origin) => {
      this.focused = !!origin
      this.stateChanges.next()
    })
    //doc 用于防止循环依赖
    if (this.ngControl != null) { this.ngControl.valueAccessor = this; }
  }
  ngOnInit() {
    let strategy = this.overlay.position().
      connectedTo(this.input, { originX: 'end', originY: 'top' }, { overlayX: 'start', overlayY: 'top' })
      .withOffsetX(24)
      // .withFallbackPosition({ originX: 'end', originY: 'top' }, { overlayX: 'start', overlayY: 'top' })
      .withFallbackPosition({ originX: 'start', originY: 'bottom' }, { overlayX: 'start', overlayY: 'top' }, 0, 10)

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
  // ngOnChanges() {
  //   this.stateChanges.next();
  // }
  /**占位符 */
  @Input()
  get placeholder() {
    return this._placeholder;
  }
  set placeholder(plh) {
    this._placeholder = plh;
    this.stateChanges.next();
  }
  private _placeholder: string;
  /**是否必须 */
  @Input()
  get required() {
    return this._required;
  }
  set required(req) {
    this._required = coerceBooleanProperty(req);
    this.stateChanges.next();
  }
  private _required = false;
  /**焦点 */
  focused = false;
  /**是否为空,但是日期是否为空不太好判断,无效和为空叠在一块,是否为空决定是不是浮动 */
  get empty(): boolean {
    // console.log(this._empty, this.focused)
    return this._empty || this.focused
    // return false
  }

  private _empty = true;
  /**是否应该把标签浮动到上面 */
  @HostBinding('class.floating')
  get shouldLabelFloat() {
    return !this.empty || this.focused;
    // return this.focused;
  }

  /**未知 */
  @HostBinding('attr.aria-describedby') describedBy = '';
  /**当无效时,会变红 */
  errorState: boolean = false;

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
   * @description 点击时调用
   * @author cyia
   * @date 2018-09-15
   * @param event
   * @memberof CyiaDatePickerComponent
   */
  onContainerClick(event: MouseEvent) {
    if ((event.target as Element).tagName.toLowerCase() != 'input') {
      this.elRef.nativeElement.querySelector('input').focus();
    }
    if (!this.overlayRef.hasAttached())
      this.overlayRef.attach(new TemplatePortal(this.accurateTime, this.viewContainerRef))
  }
  /**
   * @description 外部调用时响应
   * @author cyia
   * @date 2018-09-15
   * @param value
   * @memberof CyiaDatePickerComponent
   */
  writeValue(value) {
    if (value !== undefined) {
      this.value = value;
      // this.checkEmpty(value)
    }
  }
  changeFn: Function = () => { };
  touchedFn: Function = () => { };

  /**
   * 初始化注册
   *
   * @param  fn
   * @memberof DatePickerComponent
   */
  registerOnChange(fn) {
    this.changeFn = fn
  }
  /**
 * 初始化注册
 *
 * @param  fn
 * @memberof DatePickerComponent
 */
  registerOnTouched(fn) {
    this.touchedFn = fn
  }
  ngOnDestroy(): void {
    this.stateChanges.complete()
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

  /**
   * @description 检查值是否为空
   * @author cyia
   * @date 2018-09-15
   * @param value
   * @memberof CyiaDatePickerComponent
   */
  checkEmpty(value) {
    this._empty = !!!value
    this.stateChanges.next();
  }

  /**
   * @description 输入时判断值是否存在
   * @author cyia
   * @date 2018-09-15
   * @param data
   * @memberof CyiaDatePickerComponent
   */
  valueInput(data) {
    this._empty = !!!data;
    this.stateChanges.next();
  }
  /**
   * todo 分为值为空,值有效,值无效
   * 1.为空控制浮动和浮动显示
   * 2.无效控制红字
   * 
   */
}
