import { CyiaHttpService } from 'cyia-ngx-common';
import { FormGroup } from '@angular/forms';
import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { configValueInit, transform2FBConfig, CyiaFormService, ModelViewPropertyConfig } from "cyia-ngx-form";
import ImageCompressor from 'image-compressor.js';
import { MessageService } from '../services/message.service';
import { DialogData } from '../define/dialog-data.define';
@Component({
  selector: 'cyia-editor-form-dialog',
  templateUrl: './cyia-edit-form.component.html',
  styleUrls: ['./cyia-edit-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CyiaEditFormComponent {
  form: FormGroup;
  config: ModelViewPropertyConfig[];

  /**
   * @description 最终请求之前触发
   * @param value 表单的值
   * @memberof CyiaEditFormComponent
   */
  submitOnBefore = (value) => Promise.resolve(value)

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private http: CyiaHttpService,
    private message: MessageService,
    private formService: CyiaFormService,
    private dialogRef: MatDialogRef<CyiaEditFormComponent>,
  ) {
    console.log('测试', http)
  }
  ngOnInit(): void {
    this.config = this.data.config;
    if (this.data.list)
      this.config = configValueInit(this.data.config, this.data.list)
    let formobj = transform2FBConfig(this.config)
    this.form = this.formService.object2Form({ value: formobj }, null, 2)
    this.initValueByFunction()

    this.data.submitOnBefore && (this.submitOnBefore = this.data.submitOnBefore)
  }

  /**
   * 
   * @description 提交表单
   * @author cyia
   * @date 2018-09-17
   * @memberof CyiaEditFormComponent
   */
  async submit() {
    this.data.req.options.body = this.form.value;
    this.message.showLoading()
    let bfres = await this.submitOnBefore(this.form.value);
    this.data.req.options.body = bfres;
    this.http.request(this.data.req).subscribe({
      next: (res) => {
        this.message.hideLoading()
        this.dialogRef.close()
      }
    })
  }

  /**
   * doc 上传文件用,多个也可以
   * todo 没有处理当在里面的时候如何处理,目前只考虑在表层
   * @param  event
   * @param  item
   * @memberof EditorDialogComponent
   */
  uploadFile(event, item: ModelViewPropertyConfig) {
    console.log(event, item)
    let fileList: FileList = event.target.files;
    if (!fileList.length) return
    let formdata: FormData = new FormData();
    compressImage(fileList).then((fileList) => {
      for (let i = 0; i < fileList.length; i++) {
        const element = fileList[i];
        formdata.append('file', element);
      }
      this.http.request({
        token: 'upload', options: {
          body: formdata,
          headers: {
            Authorization: localStorage.getItem('token'),
          }
        },
        suffix: '/'
      }).subscribe({
        next: (res) => {
          this.form.patchValue({ [item.key]: res.result })
        }
      })
    })

  }
  /**
   * doc 上传文件用,多个也可以
   * todo 没有处理当在里面的时候如何处理,目前只考虑在表层
   * @param  event
   * @param  item
   * @memberof EditorDialogComponent
   */
  uploadFileM(event, item: ModelViewPropertyConfig) {
    let fileList: FileList = event.target.files;
    if (!fileList.length) return
    this.message.showLoading()
    compressImage(fileList).then((fileList) => {
      this.message.hideLoading()
      this.form.patchValue({ [item.key]: fileList })

    })
  }

  /**
   * @description 根据函数初始化(可选)
   * @author cyia
   * @date 2018-09-17
   * @memberof CyiaEditFormComponent
   */
  initValueByFunction() {

    for (let i = 0; i < this.config.length; i++) {
      const element = this.config[i];
      if (!(element.dataSource && element.dataSource.fn)) continue;
      if (element.dataSource.delay) continue;
      this.reqValue(element, this.config).then((res) => {
      })

    }
  }

  /**
   * @description 通过函数获得值
   * @author cyia
   * @date 2018-09-17
   * @param element
   * @param config
   * @param [param=null]
   * @returns
   * @memberof CyiaEditFormComponent
   */
  private reqValue(element: ModelViewPropertyConfig, config: ModelViewPropertyConfig[], param = null) {
    return element.dataSource.fn(...element.dataSource.param, param).then((res) => {
      switch (element.dataSource.target) {
        case 'both':
          [element.value, element.list] = res.result;
          break;
        case 'list':
          element.list = res.result
          break;
        case 'value':
          element.value = res.result
          break;
        default:
          break;
      }
      if (element.dataSource.nextToken) {
        let nextElement = config.find((val) => {
          return val.token == element.dataSource.nextToken
        })
        this.reqValue(nextElement, config, res.param)
      }
      // return res.param
    })
  }
}


export function compressImage(fileList: FileList): Promise<File[]> {

  console.log('文件列表', fileList.length)
  if (!fileList.length) {
    return;
  }
  let j = 0;
  let newFileList = new Array<File>();
  return new Promise((pres) => {
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      console.log('压缩前文件', file)
      new ImageCompressor(file, {
        quality: .8,
        maxHeight: 600,
        maxWidth: 800,
        success(result) {
          console.log('压缩完后', result)
          newFileList.push(new File([result], file.name, { type: file.type }))
          j++;
          if (j == fileList.length) {
            pres(newFileList)

          }
        },
        error(e) {
          console.log(e.message);
        },
      });
    }
  })
}
