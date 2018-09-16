import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Component, Input, ViewChild, ElementRef, forwardRef, ChangeDetectionStrategy, Renderer2 } from '@angular/core';


 const EXE_COUNTER_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => CyiaUploadComponent),
  multi: true
};
@Component({
  selector: 'cyia-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
  providers: [EXE_COUNTER_VALUE_ACCESSOR],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CyiaUploadComponent implements ControlValueAccessor {
  @ViewChild('input') inputRef: ElementRef
  @Input() acceptType: string = null;
  @Input() multiple: boolean = false;
  /**元素和父元素相隔的层数 */
  @Input() depth = 2

  /**任意值 */
  private _value: any = [];
  fatherButton: HTMLButtonElement;
  constructor(private renderer: Renderer2, private eleRef: ElementRef) { }

  ngOnInit() {
  }
  ngAfterViewInit(): void {
    let ele: HTMLInputElement = this.eleRef.nativeElement;
    for (let i = 0; i < this.depth; i++) {
      this.fatherButton = i == 0 ? this.renderer.parentNode(ele) : this.renderer.parentNode(this.fatherButton)
    }
    this.renderer.setStyle(this.fatherButton, 'overflow', 'hidden')
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

  setDisabledState(isDisabled) {
    // console.log('查看是否禁用', isDisabled);
    this.renderer.setAttribute(this.inputRef.nativeElement, 'disabled', isDisabled);
    this.renderer.setAttribute(this.fatherButton, 'disabled', isDisabled);
  }
  /**
   * @description 
   * @param value 参数是获得的文件列表
   * @memberof CyiaUploadComponent
   */
  @Input()
  fileOnBeforeUpload: (_value, value: FileList) => Promise<any> = (_value, value: FileList) => Promise.resolve(value)
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
  /**
   * @description 当上传变化时
   * @author cyia
   * @date 2018-09-15
   * @param event
   * @returns
   * @memberof CyiaUploadComponent
   */
  inputChange(event) {
    let fileList: FileList = event.target.files;
    if (!fileList.length) return;
    this.fileOnBeforeUpload(this._value, fileList).then((res) => {
      return this.fileOnUpload(this._value, res)
    }).then((res) => {
      return this.fileOnAfterUpload(this._value, res)
    }).then((res) => {
      this._value = res
      this.changeFn(this._value)
      this.touchedFn(this._value)
      this.inputRef.nativeElement.value = null;
    })

  }



}
