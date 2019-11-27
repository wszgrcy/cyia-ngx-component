import { Component, OnInit, ChangeDetectionStrategy, ElementRef, ViewChild } from '@angular/core';
import { Loading as Loading } from '../directive/method.decorator';
import { LoadingHintComponent } from '../loading-hint/loading-hint.component';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'cyia-load-component',
  templateUrl: './load-component.component.html',
  styleUrls: ['./load-component.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadComponentComponent implements OnInit {
  static id = 0;
  id = LoadComponentComponent.id++;
  @ViewChild('ele', { static: true }) view: ElementRef;
  constructor(hostelf: ElementRef) {
    // this.view = hostelf;
  }

  ngOnInit() {
  }
  @Loading((type: LoadComponentComponent) => type.view, DialogComponent)
  load() {
    console.log('三秒后关闭');
    return new Promise((res) => {
      setTimeout(() => {
        res();
      }, 300000);
    });
  }
}
