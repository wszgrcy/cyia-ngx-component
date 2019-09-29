import { Component, OnInit, forwardRef, Input, ChangeDetectionStrategy, SimpleChanges, Renderer2, ViewChild, ViewContainerRef, ElementRef, ViewChildren, QueryList, Self, Host, SkipSelf, Optional, Injector, INJECTOR, EventEmitter, Output, ChangeDetectorRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { CyiaFormGroup, CyiaFormControl } from '../../class/cyia-form.class';
import { LayoutStyle } from '../../type/form-group.type';
import { CyiaFormGroupService } from './cyia-form-group.service';
import { fadeInItems } from '@angular/material/menu';

@Component({
  selector: 'cyia-form-group',
  templateUrl: './cyia-form-group.component.html',
  styleUrls: ['./cyia-form-group.component.scss'],
  providers: [{
    useExisting: forwardRef(() => CyiaFormGroupComponent),
    provide: NG_VALUE_ACCESSOR,
    multi: true
  }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'cyiaFormGroup&&cyiaFormGroup.layoutStyle'
  }
})
export class CyiaFormGroupComponent implements ControlValueAccessor {
  /**所有控件的元素列表,用于布局 */
  @ViewChildren('controlEl', { read: ElementRef }) controlList: QueryList<ElementRef>
  @ViewChild('wrapper', { static: false }) set wrapper(val: ElementRef<HTMLDivElement>) {
    if (!this.wrapperInit) {
      this.wrapperInit = true;
      this.setLayout(val);
    }
  }
  @Input() cyiaFormGroup: CyiaFormGroup
  @Input() deep: number = 0
  /**顶层用于处理事件变更的 */
  @Input() service: CyiaFormGroupService
  @Output() errorsChange = new EventEmitter()
  @Output() statusChange = new EventEmitter()
  errors = {}
  formGroup: FormGroup
  /**保证数据只初始化一次,其余交给控件处理 */
  private init = false
  wrapperInit = false
  private changeFn: Function = () => { };
  private touchedFn: Function = () => { };
  value
  notOutputKeyList: string[] = []
  tableFormatList: (CyiaFormControl | CyiaFormGroup)[][] = []
  constructor(
    private fb: FormBuilder,
    private renderer: Renderer2,
    private injector: Injector,
    private cd: ChangeDetectorRef
  ) {
  }
  ngOnChanges(changes: SimpleChanges): void {

    if (changes.cyiaFormGroup && !this.init) {
      if (!this.deep) this.service = new CyiaFormGroupService()
      let formGroup = new FormGroup({})
      this.cyiaFormGroup.controls.forEach((item) => {
        // !item.output && this.notOutputKeyList.push(item.key);
        if (item instanceof CyiaFormGroup) {
          formGroup.addControl(item.key, this.fb.control(undefined))
        } else if (item instanceof CyiaFormControl) {
          formGroup.addControl(item.key, this.fb.control(item.value, item.validator))
        }
        // else if (item instanceof CyiaFormArray) {
        //   formGroup.addControl(item.key, this.fb.control(undefined))
        // }
      })
      this.formGroup = formGroup
      this.valueChangeListener()
      this.controlEventSubscribe()
      this.init = true
    }

  }
  ngOnInit() {

  }
  registerOnChange(fn) {
    this.changeFn = fn;
  }
  registerOnTouched(fn) {
    this.touchedFn = fn;
  }

  writeValue(value) {
    if (value !== undefined) {
      this.value = value
    }
  }
  valueChange(value) {
    this.value = value
    this.changeFn(value)
    this.touchedFn(value)
  }
  getFormType(control) {
    if (control instanceof CyiaFormGroup) {
      return 'group'
    } else if (control instanceof CyiaFormControl) {
      return 'control'
    }
    // else if (control instanceof CyiaFormArray) {
    //   return 'array'
    // }
  }
  /**
   * 监听值变化,发送到上一级
   *
   * @memberof CyiaFormGroupComponent
   */
  valueChangeListener() {
    this.formGroup.valueChanges.subscribe((val) => {
      const notOutputKeyList = this.cyiaFormGroup.controls.map((item) => !item.output ? item.key : null).filter(Boolean)
      this.valueChange(this.outputFilter(val, notOutputKeyList))
    })
  }
  /**
   * 对不输出的字段过滤
   *
   * @returns
   * @memberof CyiaFormGroupComponent
   */
  outputFilter(val, filterList = []) {
    if (!val) return val;
    let obj = {}
    for (const key in val) {
      if (!val.hasOwnProperty(key) || filterList.find((notKey) => notKey == key)) continue
      obj[key] = val[key]
    }
    return obj
  }
  /**
   * 其他控件发送事件时调用
   *
   * @author cyia
   * @date 2019-09-14
   */
  controlEventSubscribe() {
    if (this.deep) return
    this.service.event$.subscribe((eList) => {
      for (let i = 0; i < eList.length; i++) {
        const e = eList[i];
        let control: CyiaFormGroup | CyiaFormControl<any> = this.cyiaFormGroup
        try {
          e.target.forEach((key) => {
            control = (<CyiaFormGroup>control).getControl(key)
          })
          control[e.type] = e.value
        } catch (error) {
          console.warn('发生事件路径错误')
        }
      }
    })
  }
  /**
   * 设置显示布局
   *
   * @author cyia
   * @date 2019-09-15
   * @param wrapper
   */
  setLayout(wrapper: ElementRef<HTMLDivElement>) {
    switch (this.cyiaFormGroup.layoutStyle) {
      case LayoutStyle.cssGrid:
        this.renderer.setStyle(wrapper.nativeElement, 'grid-template-areas', this.cyiaFormGroup.gridTemplateAreas.map((items) => `'${items.map((item) => item ? `a${item}` : '.').join(' ')}'`).join(' '))
        let percent = (100 / this.cyiaFormGroup.gridTemplateAreas[0].length).toFixed(4);
        this.renderer.setStyle(wrapper.nativeElement, 'grid-template-columns', `repeat(${this.cyiaFormGroup.gridTemplateAreas[0].length}, ${percent}%)`)
        this.controlList.forEach((item, i) => this.renderer.setStyle(item.nativeElement, 'grid-area', `a${i + 1}`))
        break;
      case LayoutStyle.htmlTable:
        let controlIndex = 0
        for (let i = 0; i < this.cyiaFormGroup.tableSize[0]; i++) {
          let list = []
          for (let j = 0; j < this.cyiaFormGroup.tableSize[1]; j++) {
            list.push(this.cyiaFormGroup.controls[controlIndex++])
          }
          this.tableFormatList.push(list)
        }
        this.cyiaFormGroup.controls.forEach((item) => {
          item.showLabel = false
        })
        break;
      default:

        break;
    }
    this.cd.detectChanges()
  }
  onErrorsChange(control: CyiaFormControl | CyiaFormGroup, e) {
    if (e) this.errors[control.key] = e;
    else delete this.errors[control.key]
    if (this.cyiaFormGroup.outputError) {
      const errors = Object.values(this.errors).length ? this.errors : null
      this.errorsChange.emit(errors)
      this.formGroup.setErrors(errors)
      // this.formGroup.va
      //todo 需要根据错误同时设定状态是否有效
    }
  }
  // hasError(errors = this.errors): Boolean {
  //   // let status = true
  //   for (const key in errors) {
  //     if (!errors.hasOwnProperty(key)) continue
  //     if (Object.values(errors[key]).length && typeof Object.values(errors[key])[0] == 'string') {
  //       // return false

  //     }


  //   }
  // }
}
