import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Component, Input, ViewChild, ElementRef, forwardRef, ChangeDetectionStrategy, Renderer2, Output, EventEmitter } from '@angular/core';
import { fromEvent } from 'rxjs';


@Component({
  selector: 'cyia-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CyiaUploadComponent),
    multi: true
  }],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CyiaUploadComponent implements ControlValueAccessor {
  @ViewChild('input', { static: true }) inputRef: ElementRef
  @Input('accept') acceptType: string = null;
  @Input() multiple: boolean = false;
  /**
   * doc 对父元素设置禁用使用...
   * 元素和父元素相隔的层数 */
  @Input() depth = 2
  @Input() nameInput: HTMLInputElement
  @Output() fileChange = new EventEmitter()
  @Input() afterChange = (value) => Promise.resolve(value);
  /**任意值 */
  private _value: any = [];
  fatherButton: HTMLButtonElement;
  constructor(private renderer: Renderer2, private eleRef: ElementRef) { }

  ngOnInit() {
  }
  ngAfterViewInit(): void {
    this.getFatherButton()
  }

  getFatherButton() {
    if (this.fatherButton) return
    let ele: HTMLInputElement = this.eleRef.nativeElement;
    for (let i = 0; i < this.depth; i++) {
      this.fatherButton = i == 0 ? this.renderer.parentNode(ele) : this.renderer.parentNode(this.fatherButton)
    }

  }
  /**
   * @description 上传,不会有任何数据导入,同时,任何绑定不操作会维持原来的值
   * @author cyia
   * @date 2018-09-15
   * @param value
   * @memberof CyiaUploadComponent
   */
  writeValue(value) {
    if (value !== undefined) {
      this._value = value;
      // this.checkEmpty(value)
    }
  }
  private changeFn: Function = () => { };
  private touchedFn: Function = () => { };
  registerOnChange(fn) {
    this.changeFn = fn;
  }
  registerOnTouched(fn) {
    this.touchedFn = fn;
  }
  @Input() set disabled(isDisabled: boolean) {
    if (isDisabled === undefined) return
    this.setDisabledState(isDisabled)
  }
  setDisabledState(isDisabled) {
    this.renderer.setAttribute(this.inputRef.nativeElement, 'disabled', isDisabled);
    this.getFatherButton()
    this.renderer.setAttribute(this.fatherButton, 'disabled', isDisabled);
  }

  /**修改文件名时回传修改文件,仅在一个文件时生效,保存的_value数组必须是一个文件数组 */
  nameInputEventFunction = (function (this: CyiaUploadComponent, e) {
    this._value[0] = new File([this._value[0]], this.nameInput.value, { type: this._value[0].type })
  }).bind(this)
  /**
   * @description 当上传变化时
   * @author cyia
   * @date 2018-09-15
   * @param event
   * @returns
   * @memberof CyiaUploadComponent
   */
  async inputChange(event) {
    let fileList: File[] = Array.from(event.target.files);
    if (!fileList.length) return;
    //doc 当上传时显示输入值,如果input赋值使用,
    if (!this.multiple && this.nameInput) {
      this.nameInput.value = fileList[0].name;
      this.nameInput.addEventListener('input', this.nameInputEventFunction)
    }

    let result = await this.afterChange(!this.multiple ? fileList[0] : fileList)
    this._value = result;
    this.fileChange.next(this._value)
    this.changeFn(this._value)
    this.touchedFn(this._value)

  }
  ngOnDestroy(): void {
    this.fileChange.complete()
  }


}
