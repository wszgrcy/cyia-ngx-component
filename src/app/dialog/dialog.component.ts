import { Component, OnInit, ChangeDetectionStrategy, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'cyia-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DialogComponent implements OnInit {

  constructor(private matdialogref: MatDialogRef<any, any>) { }

  ngOnInit() {
  }
  close(e) {
    this.matdialogref.close({ value: e, display: e })
  }
}
