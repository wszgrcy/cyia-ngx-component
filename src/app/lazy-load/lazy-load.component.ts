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
  ngOnInit() {
    setTimeout(() => {
      this.tchange.emit('发送测试')
    }, 2000);
  }
  ngAfterViewInit(): void {
  }
  ngOnChanges(changes: SimpleChanges): void {
  }
  writeValue() {

  }
  registerOnChange() {

  }
  registerOnTouched() {

  }
  click() {
    this.toutput.emit('被点击')
  }
}
