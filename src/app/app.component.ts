import { CyiaHttpService } from 'cyia-ngx-common';
import { Component, ViewChild, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CyiaDatePickerComponent } from "cyia-ngx-component";
import { FabItem, CyiaFormFactory } from 'cyia-ngx-component';
import { CyiaFormControl, Pattern } from 'lib/src/form/class/cyia-form.class';
import { FormControlType } from 'lib/src/form/enum/control-type.enum';
import { fcall } from 'q';
import { LayoutStyle } from 'lib/src/form/type/form-group.type';
// import { CyiaDatePickerComponent } from "../../dist/lib";
// import * as chroma from "chroma-js";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  @ViewChild('cyiadate', { static: true }) cyiadate: CyiaDatePickerComponent
  constructor(private service: CyiaHttpService) {
    this.group.layoutStyle = LayoutStyle.htmlTable
    this.group.tableSize = [2, 2]
  }
  input1
  date = new Date().getTime();
  length = 20
  @ViewChild('picker2', { static: true }) picker
  list = []
  selvalue
  files
  fabList: FabItem[] = [
    {
      positionStrategyList: [{ originPos: { originX: 'start', originY: 'top' }, overlayPos: { overlayX: 'start', overlayY: 'bottom' } }]
    }, {
      origin: 0,
      positionStrategyList: [
        { originPos: { originX: 'end', originY: 'top' }, overlayPos: { overlayX: 'start', overlayY: 'bottom' } }
      ]
    }
  ]
  group = CyiaFormFactory.group({ gridTemplateAreas: [[1]] },
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
    // new CyiaFormControl({
    //   type: FormControlType.input,
    //   value: '只读测试',
    //   label: '标签'
    // })
  ).setPattern(Pattern.w)
  ngOnInit(): void {
    setTimeout(() => {
      this.length = 10
    }, 3000);
  }
  test(e) {
    console.log(e)
  }
  ngAfterViewInit(): void {
    // console.log('!', this.cyiadate.empty)
  }

  randomColor = 'red'
  fc(e) {
    console.log(e);
  }
}

