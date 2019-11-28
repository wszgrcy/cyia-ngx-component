import { CyiaHttpService } from 'cyia-ngx-common';
import { Component, ViewChild, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CyiaDatePickerComponent } from 'cyia-ngx-component';
import { FabItem, CyiaFormFactory } from 'cyia-ngx-component';
import { CyiaFormControl, Pattern } from 'cyia-ngx-component';
import { FormControlType } from 'cyia-ngx-component';
import { LayoutStyle } from 'cyia-ngx-component';
import { LAZY_LOAD } from './lazy/lazy-import';
import { DialogComponent } from './dialog/dialog.component';
import { Validators } from '@angular/forms';
import { OverlayRef } from '@angular/cdk/overlay';
// import { CyiaDatePickerComponent } from "../../dist/lib";
// import * as chroma from "chroma-js";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private service: CyiaHttpService,

  ) {
    // this.group.layoutStyle = LayoutStyle.htmlTable
    // this.group.tableSize = [2, 2]
  }
  @ViewChild('cyiadate', { static: true }) cyiadate: CyiaDatePickerComponent;
  dialog = DialogComponent;
  input1;
  date = new Date().getTime();
  length = 20;
  @ViewChild('picker2', { static: true }) picker;
  list = [];
  selvalue;
  files;
  fabList: FabItem[] = [
    {
      positionStrategyList: [{ originPos: { originX: 'start', originY: 'top' }, overlayPos: { overlayX: 'start', overlayY: 'bottom' } }]
    }, {
      origin: 0,
      positionStrategyList: [
        { originPos: { originX: 'end', originY: 'top' }, overlayPos: { overlayX: 'start', overlayY: 'bottom' } }
      ]
    }
  ];
  group = CyiaFormFactory.group({},
    new CyiaFormControl({
      label: '数据',
      type: FormControlType.markdown,
      value: `# 表头
      - 12342`
    }),
    // new CyiaFormControl({
    //   type: FormControlType.datepicker,
    //   // appearance: '' as any
    // })
    new CyiaFormControl({
      key: 'tet',
      type: FormControlType.input,
      // value: '',
      validator: [Validators.required],
      label: '标签',
      placeholder: '占位符',
      required: true
      // appearance:''
    })
  ).setPattern(Pattern.w).setColumn(1);


  randomColor = 'red';
  path = LAZY_LOAD.loadChildren;
  dinput = { title: '测试标题' };
  output = {
    toutput: ($event, e) => {
      console.log('测试输出', $event, e);
    }
  };
  dvalue;
  options = [{ label: 'ces', value: 1 }];
  ngOnInit(): void {
    setTimeout(() => {
      this.length = 10;
    }, 3000);
  }
  test(e) {
    console.log(e);
  }
  ngAfterViewInit(): void {
    // console.log('!', this.cyiadate.empty)
    setTimeout(() => {
      this.dinput = {
        title: '测试修改'
      };
      console.log('修改');
    }, 2000);
  }
  fc(e) {
    console.log(e);
  }
  customChange(e) {
    console.log('自定义值变更', e);
  }
}

