import { Injectable } from '@angular/core';
import { LoadingServiceAbstract } from 'cyia-ngx-component';

@Injectable()
export class LoadingProgressService implements LoadingServiceAbstract {

  constructor() {
    // setInterval(() => {
    //   this._description = this.description + this.progress++
    //   console.log('测试', this.description)
    // }, 2000)
    console.log('实例化')
  }
  progress: number = 1;
  get description() {
    // console.log('读取', this._description)
    return this._description
  }
  set description(value) {
    this._description = this._description + value
    // console.log('设置', this._description)
  }
  _description = ''


}
