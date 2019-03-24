import { CyiaHttpService } from 'cyia-ngx-common';
import { Component, ViewChild } from '@angular/core';
import { CyiaDatePickerComponent } from "cyia-ngx-component";
// import { CyiaDatePickerComponent } from "../../dist/lib";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
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
  test123() {
    console.log('按钮点击')
  }
}

