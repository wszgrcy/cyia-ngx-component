import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { CustompickerWrapperComponent } from '../custompicker-wrapper/custompicker-wrapper.component';

@Component({
  selector: 'cyia-custompicker-toggle',
  templateUrl: './custompicker-toggle.component.html',
  styleUrls: ['./custompicker-toggle.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustompickerToggleComponent implements OnInit {
  @Input() for:CustompickerWrapperComponent
  /**打开模式,吸附还是弹窗 */
  // @Input() mode: AbstractCustompicker
  @Input() icon: string = 'near_me'
  constructor() { }

  ngOnInit() {
  }
  onclick() {
    this.for.open()
  }
}
