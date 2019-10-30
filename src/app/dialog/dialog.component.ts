import { Component, OnInit, ChangeDetectionStrategy, Inject, inject, Injector, Optional, ComponentRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OverlayRef } from '@angular/cdk/overlay';
import { Custompicker } from 'cyia-ngx-component/custompicker';

@Component({
  selector: 'cyia-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DialogComponent extends Custompicker {
  constructor(
    @Optional() public matdialogref: MatDialogRef<any, any>,
    @Optional() @Inject(MAT_DIALOG_DATA) data,
    // @Optional() private overlayRef: OverlayRef,
    // private inject: Injector
  ) {
    super()
    console.log(data);
    // console.log(this.overlayRef);
    // console.log(inject);
  }

  ngOnInit() {
  }
  close(e) {
    if (this.matdialogref) {
      this.matdialogref.close({ value: e, display: e })
    } else if (this.overlayRef) {
      this.outputValue = { value: e, display: e }
      this.overlayRef.detach()
    }
    return { value: e, display: e }
  }
}
