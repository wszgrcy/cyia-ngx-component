import { Component, ChangeDetectionStrategy, NgModule, NgModuleRef, Injector, Compiler, ViewContainerRef, NgModuleFactoryLoader, ViewChild, Input } from '@angular/core';

@Component({
  selector: 'cyia-dynamic-component',
  templateUrl: './dynamic-component.component.html',
  styleUrls: ['./dynamic-component.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicComponentComponent {
  @Input() path: string
  @ViewChild('template', { read: ViewContainerRef, static: true }) anchor: ViewContainerRef

  constructor(
    private injector: Injector,
    private compiler: Compiler,
    private load: NgModuleFactoryLoader,
  ) { }

  ngOnInit() { }

  ngAfterViewInit(): void {
    this.addComponent(this.path)
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
      template: '<' + selector + '></' + selector + '>'
      // `
      // <${selector}>
      // </${selector}>
      // `
    })
    class TemplateComponent { }
    @NgModule({ declarations: [TemplateComponent], imports: [module] })
    class TemplateModule { }
    /**编译模块 */
    const mod = this.compiler.compileModuleAndAllComponentsSync(TemplateModule);
    /**组件工厂 */
    const factory = mod.componentFactories.find((comp) => comp.componentType === TemplateComponent);
    /**通过锚点创建组件 */
    let component = this.anchor.createComponent(factory, undefined, this.injector);
    //doc 表现为表单控件时,才进行值的监听
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
