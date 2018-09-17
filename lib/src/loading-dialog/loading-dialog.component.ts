import { Component, OnInit, Inject, ViewEncapsulation, ChangeDetectionStrategy, Injector } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LoadingData } from '../define/loading-data.define';
import { LoadingServiceAbstract } from '../services/loading.servicce';
import { LOADING_SERVICE } from '../define/token';



@Component({
  selector: 'cyia-loading-dialog',
  templateUrl: './loading-dialog.component.html',
  styleUrls: ['./loading-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class LoadingDialogComponent implements OnInit {
  /**
   * ! 使用前需要注入token
   */
  service: LoadingServiceAbstract
  ngOnInit() {
  }

  constructor(
    public dialogRef: MatDialogRef<LoadingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: LoadingData,
    injector: Injector
  ) {
    let init: LoadingData = {
      mode: 'indeterminate',
      diameter: 40,
      color: 'primary'
    }
    data = Object.assign({}, init, data)
    this.service = injector.get(LOADING_SERVICE);
  }

  /**
   * @description 获得上传百分比,非必须
   * @author cyia
   * @date 2018-09-17
   * @returns
   * @memberof LoadingDialogComponent
   */
  getPercent() {
    // return this.data.loading ? `${(HTTP_PROGRESS.loaded / HTTP_PROGRESS.total * 100).toFixed(2)}%` : '';
  }
}
