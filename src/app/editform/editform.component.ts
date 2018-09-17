import { CyiaEditFormComponent } from 'cyia-component';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MatDialog } from '@angular/material';
import { T1_CONFIG } from '../configure/form.define';
import { _newArray } from 'cyia-ngx-form';
import { HttpRequestItem, CyiaHttpService } from 'cyia-ngx-common';
import { MessageService } from 'cyia-component';
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
    private message: MessageService
  ) { }

  ngOnInit() {
  }
  ngAfterContentInit(): void {
    let req: HttpRequestItem = {
      token: 't1',
      method: 'post',
      suffix: '/',
      options: {

      }
    }
    setTimeout(() => {
      this.message.showLoading()
      
    }, 3000);
    // setTimeout(() => {

    //   this.dialog.open(CyiaEditFormComponent,
    //     {
    //       data: {
    //         list: null,
    //         config: _newArray(T1_CONFIG),
    //         title: '测试',
    //         buttons: [
    //           {
    //             label: '提交', type: 'submit'
    //           },
    //           {
    //             label: '返回', type: 'cancel'
    //           },
    //         ],
    //         req: req

    //       },
    //       width: '60%',
    //     })
    // }, 0);
    this.http.request({ token: 't1' }).subscribe({
      next: () => {
        console.log()
      }
    })
  }
}
