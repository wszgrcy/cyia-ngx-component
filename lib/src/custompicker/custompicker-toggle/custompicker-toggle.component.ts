import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { AbstractCustompicker } from '../class/custompicker.abstract.class';
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
  @Input() mode: AbstractCustompicker
  @Input() icon: string = 'note'
  constructor() { }

  ngOnInit() {
  }
  onclick() {
    this.for.open()
  }
}
