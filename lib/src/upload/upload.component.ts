import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Component, Input, ViewChild, ElementRef, forwardRef, ChangeDetectionStrategy, Renderer2 } from '@angular/core';
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
  @ViewChild('input') inputRef: ElementRef
  @Input('accept') acceptType: string = null;
  @Input() multiple: boolean = false;
  /**元素和父元素相隔的层数 */
  @Input() depth = 2
  @Input() nameInput: HTMLInputElement
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
      console.log('zhibiangeng', value)
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
  /**
   * @description 
   * @param value 参数是获得的文件列表
   * @memberof CyiaUploadComponent
   */
  @Input()
  fileOnBeforeUpload: (_value, value: File[]) => Promise<any> = (_value, value: File[]) => Promise.resolve(value)
  /**
   * @description 需要请求请重写此方法
   * @param value fileOnBeforeUpload返回的值
   * @memberof CyiaUploadComponent
   */
  @Input()
  fileOnUpload = (_value, value) => Promise.resolve(value)

  /**
   * @description 请求后的值返回在这里进行处理,最后返回的值将输出到外界
   * @param value fileOnUpload返回的值
   * 
   * @memberof CyiaUploadComponent
   */
  @Input()
  fileOnAfterUpload = (_value, value) => Promise.resolve(value)
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
  inputChange(event) {
    let fileList: File[] = Array.from(event.target.files);
    if (!fileList.length) return;
    //doc 当上传时显示输入值,
    if (fileList.length == 1 && this.nameInput) {
      this.nameInput.value = fileList[0].name;
      this.nameInput.addEventListener('input', this.nameInputEventFunction)
    }
    //doc 点击上传时是不是触发什么操作,比如请求服务器
    this.fileOnBeforeUpload(this._value, fileList).then((res) => {
      return this.fileOnUpload(this._value, res)
    }).then((res) => {
      return this.fileOnAfterUpload(this._value, res)
    }).then((res) => {
      this._value = res
      this.changeFn(this._value)
      this.touchedFn(this._value)

      // this.inputRef.nativeElement.value = null;
    })

  }



}
