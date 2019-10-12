import { DynamicImportStrategy } from './dynamic-import-component';
import { Type, Compiler, Injector, ViewContainerRef, Component, NgModule, EventEmitter, Output, ComponentFactory, ApplicationRef, ChangeDetectionStrategy, ViewChild, ComponentRef, ChangeDetectorRef, Input } from '@angular/core';
import { DynamicEntryPoint } from '../define';
import { getSelector } from '../cdk/dynamic-component';
import { Subject } from 'rxjs';

export class CompilerDynamicImportStragegy extends DynamicImportStrategy {
    /**
     * 保证值变更后的传入,
     * 保证事件传出
     */
    inputStr: string = ''
    outputStr: string = ''
    dynamicInput
    dynamicOutput
    eventChange = new Subject()
    componentRef: ComponentRef<any>
    context
    constructor(
        private injector: Injector,
        // private viewContainerRef: ViewContainerRef,
        private compiler: Compiler,
        private anchor: ViewContainerRef,
        // private dynamicInput: any = {},
        // private dynamicOutput: [] = [],
        // private eventChange: EventEmitter<{ outputProperty: string, value: any }>,
        // private applicationRef: ApplicationRef

    ) {
        super()
    }
    setContext(context) {
        this.context = context
    }
    /**
     * 设置组件的绑定属性
     *  
     * @param  [dynamicInput={}] 初始化时的输入属性绑定
     * @param  [dynamicOutput={}] 需要传出的事件
     * @returns
     * @memberof CompilerDynamicImportStragegy
     */
    setComponentBindingProperty(dynamicInput = {}, dynamicOutput = {}) {
        this.dynamicInput = dynamicInput
        this.dynamicOutput = dynamicOutput
        this.inputStr = Object.entries(dynamicInput || {}).map(([inputName]) => `[${inputName}]="input.${inputName}"`).join(' ')
        console.log(this.inputStr);
        this.outputStr = Object.entries(dynamicOutput || {}).map(([eventName]) => `(${eventName})="output.${eventName}($event,context)"`).join(' ')


        console.log(this.outputStr);
        return this
    }
    /**
     * 载入模块,返回的是包裹动态组件的组件
     *
     * @param {() => Promise<Type<DynamicEntryPoint>>} moduleFn
     * @returns
     * @memberof CompilerDynamicImportStragegy
     */
    async load(moduleFn: () => Promise<Type<DynamicEntryPoint>>) {
        /**模块的类 */
        let module = await moduleFn()
        /**载入的模块工厂 */
        const ngModuleFactory = await this.compiler.compileModuleAsync(module)
        const ngModuleRef = ngModuleFactory.create(this.injector)
        //doc 正规方法需要先实例化模块浪费性能,可以将正规方法作为候选
        const selector = this.selector || getSelector(ngModuleRef);
        const template = `<${selector} ${this.inputStr} ${this.outputStr} #dynamicComponent></${selector}>`
        console.log(template);
        /**自定义组件部分 */
        @Component({
            template: template,
            changeDetection: ChangeDetectionStrategy.Default
        })
        class TemplateComponent {
            @ViewChild('dynamicComponent', { static: true }) dynamicComponent: any
            public input
            public output
            public context
        }
        @NgModule({ declarations: [TemplateComponent], imports: [module] })
        class TemplateModule {

        }
        /**编译模块 */
        const mod = this.compiler.compileModuleAndAllComponentsSync(TemplateModule);
        /**组件工厂 */
        const factory: ComponentFactory<TemplateComponent> = mod.componentFactories.find((comp) => comp.componentType === TemplateComponent);
        /**通过锚点创建组件 */
        this.componentRef = this.anchor.createComponent(factory, undefined, this.injector, undefined, ngModuleRef);

        this.componentRef.instance.input = this.dynamicInput
        this.componentRef.instance.output = this.dynamicOutput
        this.componentRef.instance.context = this.context
        this.componentRef.changeDetectorRef.markForCheck()
        return this.componentRef.instance.dynamicComponent
    }
    inputChange(input) {
        this.componentRef.instance.input = input
        this.componentRef.changeDetectorRef.markForCheck()
        return this
    }
    outputChange(output) {
        this.componentRef.instance.output = output
        this.componentRef.changeDetectorRef.markForCheck()
        return this
    }
    contextChange(context) {
        this.componentRef.instance.context = context
        this.componentRef.changeDetectorRef.markForCheck()
        return this
    }
    // getSelector() {
    //     return 1
    // }
}