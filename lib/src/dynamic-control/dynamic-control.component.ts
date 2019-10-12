import { Component, ChangeDetectionStrategy, EventEmitter, NgModule, ComponentRef, NgModuleRef, Injector, Compiler, ViewContainerRef, NgModuleFactoryLoader, ViewChild, Input, forwardRef, Type, SimpleChanges, Inject } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { DynamicImportStrategy } from '../class/dynamic-import-component';
import { DYNAMIC_IMPORT_METHOD } from '../token/dynamic-import-method.token';

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
  @Input() path: any
  @Input() selector: string
  @ViewChild('template', { read: ViewContainerRef, static: true }) anchor: ViewContainerRef
  _value
  private changeFn: Function = () => { };
  private touchedFn: Function = () => { };
  // component: ComponentRef<any>
  strategy: Type<DynamicImportStrategy>
  strategyInstance: DynamicImportStrategy
  constructor(
    private injector: Injector,
    private compiler: Compiler,
    @Inject(DYNAMIC_IMPORT_METHOD) strategy,
  ) {
    this.strategy = this.strategy || strategy

  }

  ngOnInit() {

  }
  ngOnChanges(changes: SimpleChanges): void {
    if (!this.strategyInstance) return
    if (changes.dynamicInput) {
      this.strategyInstance.inputChange(this.dynamicInput)
    }
    else if (changes.dynamicOutput) {
      this.strategyInstance.inputChange(this.dynamicOutput)
    }
    else if (changes.context) {
      this.strategyInstance.inputChange(this.context)
    }
  }
  registerOnChange(fn) {
    this.changeFn = fn;
  }
  registerOnTouched(fn) {
    this.touchedFn = fn;
  }
  writeValue(value) {
    if (value !== undefined && this.strategyInstance) {
      this.strategyInstance.valueChange(value)
    } else if (value !== undefined) {
      this._value = value
    }
  }
  async ngAfterViewInit() {
    this.strategyInstance = new this.strategy(
      this.injector,
      this.compiler,
      this.anchor,
      this.selector
      // this.dynamicInput,
      // this.dynamicOutput,
      // this.eventChange,
      // this.applicationRef
    )
    await this.strategyInstance
      .setComponentBindingProperty(this.dynamicInput, this.dynamicOutput)
      .setNgModel(this._value)
      .setContext(this.context)
      .load(this.path)
    this.strategyInstance.onValueChange((e) => {
      this.valueChange(e)
    })

  }

  valueChange(value: string) {
    this._value = value
    this.changeFn(value)
    this.touchedFn(value)
  }
}
