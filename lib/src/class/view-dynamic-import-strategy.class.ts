import { DynamicImportStrategy } from './dynamic-import-component';

import { Injector, Compiler, ViewContainerRef, Type, ComponentRef, NgModuleFactory, EventEmitter } from '@angular/core';
import { DynamicEntryPoint } from '../define';
import { ControlValueAccessor } from '@angular/forms';

export class ViewDynamicImportStragegy extends DynamicImportStrategy {
    componentRef: ComponentRef<any>
    dynamicInput
    dynamicOutput: { [name: string]: Function }
    context
    constructor(
        private injector: Injector,
        private compiler: Compiler,
        private anchor: ViewContainerRef
    ) {
        super()
    }
    setComponentBindingProperty(dynamicInput = {}, dynamicOutput = {}) {
        this.dynamicInput = dynamicInput
        this.dynamicOutput = dynamicOutput
        return this
    }
    async  load(moduleFn: () => Promise<Type<DynamicEntryPoint>>) {
        /**模块的类 */
        let module = await moduleFn()
        /**载入的模块工厂 */
        const ngModuleFactory = module instanceof NgModuleFactory ? module : await this.compiler.compileModuleAsync(module)

        const ngModuleRef = ngModuleFactory.create(this.injector)
        //doc 正规方法需要先实例化模块浪费性能,可以将正规方法作为候选
        let componentFactory = ngModuleRef.componentFactoryResolver.resolveComponentFactory(ngModuleRef.instance.entry)
        /**动态实例化的组件 */
        this.componentRef = this.anchor.createComponent(componentFactory)
        this.inputChange(this.dynamicInput)
        this.eventListenChange(this.context, this.dynamicOutput)
        return this.componentRef
    }
    setContext(context) {
        this.context = context
        return this
    }

    contextChange(context) {
        this.context = context
        return this.eventListenChange(context, this.dynamicOutput)
    }
    private eventListenChange(context, dynamicOutput: { [name: string]: Function }) {
        Object.entries(dynamicOutput).forEach(([key, value]) => {
            (<EventEmitter<any>>this.componentRef.instance[key]).subscribe((e) => {
                value(e, context)
            })
        })
        this.componentRef.changeDetectorRef.markForCheck()
        return this
    }
    inputChange(input) {
        this.dynamicInput = input
        Object.entries(input).forEach(([key, value]) => {
            this.componentRef.instance[key] = value
        })
        this.componentRef.changeDetectorRef.markForCheck()
        return this
    }
    outputChange(output) {
        this.dynamicOutput = output
        return this.eventListenChange(this.context, output)
    }

    /**
     * 值变更响应事件
     *
     * @param  fn
     * @returns
     * @memberof ViewDynamicImportStragegy
     */
    setNgModelChange(fn: (arg) => any) {
        if (!fn) return
        /**
         * todo 可能造成两次响应?
         * 
         */
        let registerOnChange = (<ControlValueAccessor>this.componentRef.instance).registerOnChange;
        ((<ControlValueAccessor>this.componentRef.instance).registerOnChange = () => {
            let val = (e) => fn(e)
            registerOnChange.call(this.componentRef.instance, val)
        })()
        let registerOnTouched = (<ControlValueAccessor>this.componentRef.instance).registerOnTouched;
        ((<ControlValueAccessor>this.componentRef.instance).registerOnTouched = () => {
            let val = (e) => fn(e)
            registerOnTouched.call(this.componentRef.instance, val)
        })()

        return this;
    }

    /**
     * 模拟调用,传入值
     *
     * @param  value
     * @returns
     * @memberof ViewDynamicImportStragegy
     */
    setNgModelValue(value) {
        ; (<ControlValueAccessor>this.componentRef.instance).writeValue(value);
        this.componentRef.changeDetectorRef.markForCheck()
        return this
    }
    setNgModel() {
        return this
    }
}