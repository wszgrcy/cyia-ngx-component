import { Component, OnInit, ChangeDetectionStrategy, ContentChild, TemplateRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'cyia-custompicker-wrapper',
  templateUrl: './custompicker-wrapper.component.html',
  styleUrls: ['./custompicker-wrapper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class CustompickerWrapperComponent implements OnInit {
  @ContentChild(TemplateRef, { static: false }) temp
  resultChange = new Subject()
  constructor(private matDialog: MatDialog) { }

  ngOnInit() {
  }
  async  open() {
    let ref = this.matDialog.open(this.temp)
    const res = await ref.afterClosed().pipe(take(1)).toPromise()
    this.resultChange.next(res)
    return ref
  }
}
