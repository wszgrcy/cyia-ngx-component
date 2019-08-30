import { Component, OnInit, ChangeDetectionStrategy, EventEmitter, NgModule, ComponentRef, NgModuleRef, ComponentFactoryResolver, Injector, Compiler, ViewContainerRef, ApplicationRef, NgModuleFactoryLoader, ViewChild } from '@angular/core';
import { FormsModule, FormBuilder } from '@angular/forms';

@Component({
  selector: 'cyia-dynamic-control',
  templateUrl: './dynamic-control.component.html',
  styleUrls: ['./dynamic-control.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynamicControlComponent implements OnInit {
  @ViewChild('template', { read: ViewContainerRef }) anchor: ViewContainerRef
  title
  constructor(private componentFactoryResolver: ComponentFactoryResolver,
    private injector: Injector,
    private compiler: Compiler,
    private container: ViewContainerRef,
    private fb: FormBuilder,
    private applicationRef: ApplicationRef,
    private load: NgModuleFactoryLoader,
    private resolver: ComponentFactoryResolver) { }

  ngOnInit() {
  }
  private async addComponent(path: string) {
    /**载入的模块工厂 */
    const ngModuleFactory = await this.load.load(path);
    /**模块的类 */
    const module = ngModuleFactory.moduleType;
    //doc 正规方法需要先实例化模块浪费性能,可以将正规方法作为候选
    const ngModuleRef = ngModuleFactory.create(this.injector)
    const selector = this.getSelector(ngModuleRef);
    @Component({
      template: `<${selector}  [ngModelOptions]="{standalone:true}"  [(ngModel)]="value" (ngModelChange)="valueChange.emit($event)"></${selector}>`
    })
    class TemplateComponent {
      public value
      public valueChange = new EventEmitter()
    }
    @NgModule({ declarations: [TemplateComponent], imports: [module, xxxx, FormsModule] })
    class TemplateModule { }
    /**编译模块 */
    const mod = this.compiler.compileModuleAndAllComponentsSync(TemplateModule);
    /**组件工厂 */
    const factory = mod.componentFactories.find((comp) => comp.componentType === TemplateComponent);
    /**通过锚点创建组件 */
    const component: ComponentRef<TemplateComponent> = this.anchor.createComponent(factory, undefined, this.injector);
    //todo 封装
    component.instance.value = this.title
    component.instance.valueChange.subscribe((val) => this.title = val)
  }

  getSelector(ngModuleRef: NgModuleRef<any>): string {
    try {
      return ngModuleRef.instance.entry.__annotations__[0].selector
    } catch (error) { }
    let componentFactoryResolver = ngModuleRef.componentFactoryResolver
    try {
      let map: Map<any, any> = componentFactoryResolver['_factories']
      return map[0].selector
    } catch (error) { }
    try {
      let componentFactory = ngModuleRef.componentFactoryResolver.resolveComponentFactory(ngModuleRef.instance.entry)
      return componentFactory.selector
    } catch (error) {
    }

    throw '没有找到选择器'
  }
}
