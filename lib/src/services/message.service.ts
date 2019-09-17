import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LoadingDialogComponent } from '../loading-dialog/loading-dialog.component';
import { SPINNER_CONFIG } from '../define/token';
import { SpinnerCoreConfig } from '../define/loading-data.define';

@Injectable()
export class MessageService {
  loadDialog: MatDialogRef<any, any>
  /**默认false未加载 */
  private isloading = false;
  constructor(
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    @Inject(SPINNER_CONFIG) private config: SpinnerCoreConfig
  ) { }


  showToast(content: string, action = '确认', config: MatSnackBarConfig = {
    duration: 2000,
    horizontalPosition: 'center',
    verticalPosition: 'top',
  }) {
    return this.snackBar.open(content, action, config);
  }

  /**
   * !当返回出现问题是调用
   *
   * @memberof MessageService
   */
  showWhenHttpError(rej: HttpErrorResponse, a = '', ) {
    if (rej.error instanceof Object) {
      for (const x in rej.error) {
        if (rej.error.hasOwnProperty(x)) {
          const element = rej.error[x];
          this.showToast(`${element}`, a)
        }
      }
    } else {
      this.showToast(rej.error)
    }
  }

  showLoading(content: string = '正在加载中', progress = false) {
    if (this.isloading) return;
    this.isloading = true;
    this.loadDialog = this.dialog.open(LoadingDialogComponent, {
      data: {
        content: content,
        mode: progress ? 'determinate' : 'indeterminate',
        diameter: this.config.diameter,
        color: this.config.color,
        strokeWidth: this.config.strokeWidth
      }, disableClose: true
    });
  }

  hideLoading() {
    if (!this.isloading) return;
    this.isloading = false;
    this.loadDialog.close();
  }
}
