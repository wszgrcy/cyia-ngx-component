import { Component, ChangeDetectionStrategy, EventEmitter, NgModule, ComponentRef, NgModuleRef, Injector, Compiler, ViewContainerRef, NgModuleFactoryLoader, ViewChild, Input, forwardRef, Type } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { DynamicImportStrategy } from '../class/dynamic-import-component';

@Component({
  selector: 'cyia-dynamic-control',
  templateUrl: './dynamic-control.component.html',
  styleUrls: ['./dynamic-control.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => DynamicControlComponent), multi: true }
  ]
})
export class DynamicControlComponent implements ControlValueAccessor {
  /**
   * 输入值,要转到组件中
   * 输出值,要发送事件
   */
  @Input() dynamicInput = {}
  @Input() dynamicOutput = {}
  @Input() context
  @Input() path: string
  @ViewChild('template', { read: ViewContainerRef, static: true }) anchor: ViewContainerRef
  _value
  private changeFn: Function = () => { };
  private touchedFn: Function = () => { };
  component: ComponentRef<any>
  strategy: Type<DynamicImportStrategy>
  strategyInstance: DynamicImportStrategy
  constructor(
    private injector: Injector,
    private compiler: Compiler,
    private load: NgModuleFactoryLoader,
  ) { }

  ngOnInit() {

  }
  registerOnChange(fn) {
    this.changeFn = fn;
  }
  registerOnTouched(fn) {
    this.touchedFn = fn;
  }
  writeValue(value) {
    if (value !== undefined) {
      if (this.component) {
        this.component.instance.value = value
      } else {
        this._value = value
      }
    }
  }
  async ngAfterViewInit() {
    this.strategyInstance = new this.strategy(
      this.injector,
      this.compiler,
      this.anchor,
      // this.dynamicInput,
      // this.dynamicOutput,
      // this.eventChange,
      // this.applicationRef
    )
    let component = await this.strategyInstance
      .setComponentBindingProperty(this.dynamicInput, this.dynamicOutput)
      .load(this.path)

  }

  valueChange(value: string) {
    this._value = value
    this.changeFn(value)
    this.touchedFn(value)
  }
}
