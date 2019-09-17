import { Component, OnInit, ViewEncapsulation, Output, EventEmitter, Input } from '@angular/core';
import { coerceNumberProperty } from '@angular/cdk/coercion';
import { matDatepickerAnimations } from '@angular/material/datepicker';
import { AccurateTime } from '../../define/date-picker.define';

@Component({
  selector: 'app-cyia-time',
  templateUrl: './cyia-time.component.html',
  styleUrls: ['./cyia-time.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    matDatepickerAnimations.transformPanel,
    matDatepickerAnimations.fadeInCalendar,
  ],
  host: {
    '[@transformPanel]': '"enter"',
    'class':'app-cyia-time'
  }
})
export class CyiaTimeComponent implements OnInit {

  constructor() { }

  ngOnInit() {

  }
  @Input() time: AccurateTime = {
    hour: null,
    minute: null
  }
  @Output() changeData = new EventEmitter<any>();
  timeChange(event, type) {
    let value = coerceNumberProperty(event.value)
    let max = coerceNumberProperty(event.max)
    let min = coerceNumberProperty(event.min)
    event.value = value;
    if (value > max) {
      event.value = max;
    } else if (value < min) {
      event.value = min;
    }
    this.changeData.emit({ value: event.value, type: type })
  }
}
