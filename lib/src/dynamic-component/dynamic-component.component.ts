import { Component, ChangeDetectionStrategy, NgModule, NgModuleRef, Injector, Compiler, ViewContainerRef, NgModuleFactoryLoader, ViewChild, Input, NgModuleFactory, Type, Inject, Output, EventEmitter, ApplicationRef, SimpleChanges } from '@angular/core';
import { DYNAMIC_IMPORT_METHOD } from '../token/dynamic-import-method.token';
import { DynamicImportStrategy } from '../class/dynamic-import-component';

@Component({
  selector: 'cyia-dynamic-component',
  templateUrl: './dynamic-component.component.html',
  styleUrls: ['./dynamic-component.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicComponentComponent {
  @Input() path: any
  @ViewChild('template', { read: ViewContainerRef, static: true }) anchor: ViewContainerRef
  /**将想要传入的参数以key-Value格式传入,慎用引用取值 */
  @Input() dynamicInput = {}
  @Input() dynamicOutput = {}
  @Input() context
  /**将动态组件的事件以一个统一的接口传出 */
  // @Input() set method(val: 'view' | 'compiler' | 'element') {
  //   switch (val) {
  //     case 'compiler':
  //       this.strategy = CompilerDynamicImportStragegy
  //       break;
  //     case 'view':
  //       this.strategy = ViewDynamicImportStragegy
  //     case 'element':
  //       this.strategy = ElementDynamicImportStragegy
  //     default:
  //       break;
  //   }
  // }
  strategy: Type<DynamicImportStrategy>
  strategyInstance: DynamicImportStrategy
  constructor(
    private injector: Injector,
    private viewContainerRef: ViewContainerRef,
    private compiler: Compiler,
    @Inject(DYNAMIC_IMPORT_METHOD) strategy,
    // private applicationRef: ApplicationRef
  ) {
    this.strategy = this.strategy || strategy
  }

  ngOnInit() { }
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


}
