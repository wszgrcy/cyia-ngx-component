import { CyiaHttpService } from 'cyia-ngx-common';
import { Component, ViewChild } from '@angular/core';
import { CyiaDatePickerComponent } from "cyia-component";
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

  @ViewChild('picker2') picker
  list = []
  selvalue
  ngOnInit(): void {
   
  }
  test() {
  }
  ngAfterViewInit(): void {
    // console.log('!', this.cyiadate.empty)
  }

}

