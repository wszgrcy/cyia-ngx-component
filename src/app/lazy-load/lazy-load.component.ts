import { Component, OnInit, ChangeDetectionStrategy, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'cyia-lazy-load',
  templateUrl: './lazy-load.component.html',
  styleUrls: ['./lazy-load.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => LazyLoadComponent), multi: true }
  ]
})
export class LazyLoadComponent implements ControlValueAccessor {

  constructor() { }

  ngOnInit() {
  }
  writeValue() {

  }
  registerOnChange() {

  }
  registerOnTouched() {

  }
}
