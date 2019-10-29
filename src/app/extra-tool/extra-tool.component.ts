import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'cyia-extra-tool',
  templateUrl: './extra-tool.component.html',
  styleUrls: ['./extra-tool.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExtraToolComponent implements OnInit {
  @Input() method
  constructor() { }

  ngOnInit() {
    console.log(this.method);
    setTimeout(() => {
      console.log(this.method('123456',3));
      
    }, 1000);
  }

}
