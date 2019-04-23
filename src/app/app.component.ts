import { CyiaHttpService } from 'cyia-ngx-common';
import { Component, ViewChild, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CyiaDatePickerComponent } from "cyia-ngx-component";
import { FabItem } from 'cyia-ngx-component';
// import { CyiaDatePickerComponent } from "../../dist/lib";
// import * as chroma from "chroma-js";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  @ViewChild('cyiadate') cyiadate: CyiaDatePickerComponent
  constructor(private service: CyiaHttpService) { }
  input1
  date = new Date().getTime();
  length = 20
  @ViewChild('picker2') picker
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

