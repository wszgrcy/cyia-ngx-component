import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LoadingData } from '../define/loading-data.define';
import { LoadingServiceAbstract } from '../services/loading.servicce';
import { LOADING_PROGRESS } from '../define/token';



@Component({
  selector: 'cyia-loading-dialog',
  templateUrl: './loading-dialog.component.html',
  styleUrls: ['./loading-dialog.component.scss'],
  // encapsulation: ViewEncapsulation.None,
  // changeDetection: ChangeDetectionStrategy.OnPush
})

export class LoadingDialogComponent implements OnInit {

  data: LoadingData
  constructor(
    public dialogRef: MatDialogRef<LoadingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: LoadingData,
    @Inject(LOADING_PROGRESS) public service: LoadingServiceAbstract
  ) {
    for (const x in data) {
      if (data.hasOwnProperty(x) && !data[x])
        delete data[x]
    }
    let init: LoadingData = {
      mode: 'indeterminate',
      diameter: 70,
      color: 'primary',
      // strokeWidth: 10
    }
    this.data = Object.assign({}, init, data)
    console.log(this.service)
  }
  ngOnInit() {
  }


}
