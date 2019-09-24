import { Component, Input, Renderer2, ViewChild, ElementRef, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
const EXE_COUNTER_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => CyiaUpload4ImageComponent),
  multi: true
};
@Component({
  selector: 'cyia-upload4image',
  templateUrl: './upload4image.component.html',
  styleUrls: ['./upload4image.component.scss'],
  providers: [EXE_COUNTER_VALUE_ACCESSOR],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class CyiaUpload4ImageComponent implements ControlValueAccessor {
  @ViewChild('img', { static: true }) img: ElementRef
  @Input() hasBtnView = false;
  /**同input标签的accept属性 */
  @Input() accept = 'image/gif,image/jpeg,image/jpg,image/png,image/svg'
  /**显示大小,value:b,kb,mb,gb;label为要显示的单位,例如:兆 */
  @Input() unit = {
    value: '',
    label: ''
  }
  @Input() depth = 3;
  @Input() multiple: boolean = false;
  files: File[] = []
  fatherElement: HTMLButtonElement;
  ele: HTMLElement;
  /**用来显示图片用的 */
  imageList: any[] = [];
  uploadDisabled = false
  // get imageList() {
  //   return this.imageList
  // }

  constructor(private renderer: Renderer2, private eleRef: ElementRef) { }

  ngOnInit() {
  }
  ngAfterViewInit(): void {
    this.ele = this.eleRef.nativeElement
    for (let i = 0; i < this.depth - 1; i++) {
      this.fatherElement = i == 0 ? this.renderer.parentNode(this.ele) : this.renderer.parentNode(this.fatherElement)
    }
    let nextEle = this.renderer.nextSibling(this.fatherElement)
    /**
     * doc 用来将显示图片的插入到相邻元素
     * 如果就是最后一个元素 */
    if (!nextEle) {
      this.renderer.appendChild(this.renderer.parentNode(this.fatherElement), this.img.nativeElement)
    } else {
      this.renderer.insertBefore(this.renderer.parentNode(this.fatherElement), this.img.nativeElement, nextEle)
    }
  }

  /**
   * !
   * 1.应该正常显示，2应该正常返回,显示和返回不是一个数组
   */

  afterChange = (fileList: File[]) => {
    this.setImage(fileList).then((res) => {
      return this.changeValue(fileList)
    }).then((res) => {
      this.changeFn(res)
      this.touchedFn(res)
    })
    return Promise.resolve(fileList);
  }

  /**
   * @description
   * @param _value 上传的原数据
   * @param fileList 单一本次上传的数据
   * @param result 设置图像的返回值
   * @memberof CyiaUpload4ImageComponent
   */
  @Input() changeValue = (fileList: File[]) => Promise.resolve(fileList)

  /**
   * @description 把图片读取出来用于显示,默认是文件格式,如果上传需要重写
   * @author cyia
   * @date 2018-09-16
   * @param _value 上传前的数据
   * @param fileList 单一本次上传的数据
   * @memberof CyiaUpload4ImageComponent
   */
  @Input() setImage = (fileList: File[]) => {
    for (let i = 0; i < fileList.length; i++) {
      !fileList.find((val) => {
        return this.queryImage(val, fileList[i])
      }) && fileList.push(fileList[i]);
    }
    return new Promise((pres) => {
      for (let i = 0, j = 0, length = fileList.length; i < length; i++) {
        const file = fileList[i];
        if (this.imageList[i] && this.queryImage(this.imageList[i], file)) continue;
        let reader = new FileReader();
        reader.readAsDataURL(file)
        reader.onloadend = () => {
          this.imageList.push({
            src: reader.result,
            name: file.name,
            size: file.size,
            type: file.type
          })
          j++;
          if (j == length) {
            pres(this.imageList)
          }
        }
      }

    })
  }
  /**
   * doc
   * @description 上传列表和图片列表一定是相同的长度和位置,所以一个定出来,另一个也定出来
   * @author cyia
   * @date 2018-09-16
   * @param imageItem
   * @memberof CyiaUpload4ImageComponent
   */
  deleteImage(i) {
    this.files.splice(i, 1)
    this.files = new Array().concat(this.files)
    this.imageList.splice(i, 1)
    this.changeFn(this.files)
    this.touchedFn(this.files)
  }
  private queryImage(item1, item2) {
    if (item1 && item2)
      if (item1.name == item2.name && item1.size == item2.size && item1.type == item2.type)
        return true;
    return false
  }
  /**
   * 查看图片大图,
   */
  @Input() view = (i, item) => {
    console.log(i, item)
  }
  private _value;
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
    console.log('禁止')
    this.uploadDisabled = isDisabled
    this.renderer.setAttribute(this.fatherElement, 'disabled', isDisabled);
  }
}
