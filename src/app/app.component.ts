import { CyiaHttpService } from 'cyia-ngx-common';
import { Component, ViewChild, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CyiaDatePickerComponent } from "cyia-ngx-component";
import { FabItem, CyiaFormFactory } from 'cyia-ngx-component';
import { CyiaFormControl, Pattern } from 'lib/src/form/class/cyia-form.class';
import { FormControlType } from 'lib/src/form/enum/control-type.enum';
// import { CyiaDatePickerComponent } from "../../dist/lib";
// import * as chroma from "chroma-js";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  @ViewChild('cyiadate', { static: true }) cyiadate: CyiaDatePickerComponent
  constructor(private service: CyiaHttpService) { }
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
  group = CyiaFormFactory.group({ gridTemplateAreas: [[1, 1, 1, 1, 1, 2]] },
    // new CyiaFormControl({
    //   type: FormControlType.markdown
    // }),
    new CyiaFormControl({
      type: FormControlType.datepicker,
      // appearance: '' as any
    })
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
}

