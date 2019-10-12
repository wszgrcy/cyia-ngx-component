import { DynamicImportStrategy } from './dynamic-import-component';

import { Injector, Compiler, ViewContainerRef, Type, ComponentRef } from '@angular/core';
import { DynamicEntryPoint } from '../define';

export class ViewDynamicImportStragegy extends DynamicImportStrategy {
    componentRef: ComponentRef<any>

    constructor(
        private injector: Injector,
        private compiler: Compiler,
        private anchor: ViewContainerRef
    ) {
        super()
    }
    setComponentBindingProperty(dynamicInput = {}, dynamicOutput = []) {
      
    }
    async  load(moduleFn: () => Promise<Type<DynamicEntryPoint>>) {
        /**模块的类 */
        let module = await moduleFn()
        /**载入的模块工厂 */
        const ngModuleFactory = await this.compiler.compileModuleAsync(module)
        const ngModuleRef = ngModuleFactory.create(this.injector)
        //doc 正规方法需要先实例化模块浪费性能,可以将正规方法作为候选
        let componentFactory = ngModuleRef.componentFactoryResolver.resolveComponentFactory(ngModuleRef.instance.entry)
        this.componentRef = this.anchor.createComponent(componentFactory)

        return this.componentRef
    }
    setContext(){}
    contextChange() { return this }
    inputChange() { return this }
    outputChange() { return this }
}