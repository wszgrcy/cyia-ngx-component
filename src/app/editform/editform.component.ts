import { CyiaEditFormComponent, LOADING_PROGRESS } from 'cyia-ngx-component';
import { Component, OnInit, ChangeDetectionStrategy, Inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { T1_CONFIG } from '../configure/form.define';
import { _newArray } from 'cyia-ngx-form';
import { HttpRequestItem, CyiaHttpService } from 'cyia-ngx-common';
import { MessageService } from 'cyia-ngx-component';
import { LoadingProgressService } from '../services/loading-progress.service';
// import { _newArray } from 'cyia-ngx-form';

@Component({
  selector: 'cyia-editform',
  templateUrl: './editform.component.html',
  styleUrls: ['./editform.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditformComponent implements OnInit {

  constructor(private dialog: MatDialog,
    private http: CyiaHttpService,
    private message: MessageService,


    @Inject(LOADING_PROGRESS) private test: LoadingProgressService,
  ) {
    // test1.getserve()
  }

  ngOnInit() {
    // setInterval(() => {
    // this.test.description = '5'

    // }, 2000)
  }
  ngAfterContentInit(): void {
    let req: HttpRequestItem = {
      token: 't1',
      method: 'post',
      suffix: '/',
      options: {

      }
    }
    if (1) {
      return
    }
    // setTimeout(() => {
    //   this.message.showLoading()
    // }, 0);

    setTimeout(() => {
      this.dialog.open(CyiaEditFormComponent,
        {
          data: {
            list: null,
            config: _newArray(T1_CONFIG),
            title: '测试',
            buttons: [
              {
                label: '提交', type: 'submit'
              },
              {
                label: '返回', type: 'cancel'
              },
            ],
            req: req
          },
          width: '60%',
        })
    }, 200);


    // this.http.request({ token: 't1' }).subscribe({
    //   next: () => {
    //     console.log()
    //   }
    // })
  }
}
