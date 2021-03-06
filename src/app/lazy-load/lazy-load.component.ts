import { Component, OnInit, ChangeDetectionStrategy, forwardRef, Input, Output, EventEmitter, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'cyia-lazy-load',
  templateUrl: './lazy-load.component.html',
  styleUrls: ['./lazy-load.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => LazyLoadComponent), multi: true }
  ]
})
export class LazyLoadComponent implements ControlValueAccessor {
  @Input() title
  constructor(private cd: ChangeDetectorRef) { }
  @Output() tchange = new EventEmitter()
  @Output() toutput = new EventEmitter()
  inputvalue
  ngOnInit() {
    setTimeout(() => {
      this.tchange.emit('发送测试')
    }, 2000);
  }
  ngAfterViewInit(): void {
  }
  ngOnChanges(changes: SimpleChanges): void {
  }
  writeValue(v) {
    this.inputvalue = v
  }
  fn
  registerOnChange(fn) {
    this.fn = fn
  }
  registerOnTouched() {

  }
  click() {
    this.toutput.emit('被点击')
  }
  changevalue() {
    this.fn && this.fn(Math.random())
  }
}
