import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  date = new Date().getTime();
  @ViewChild('picker2') picker
  ngOnInit(): void {
  }
  test(){
    this.picker.open();
  }
}
