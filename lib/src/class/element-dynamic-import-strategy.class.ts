import { DynamicImportStrategy } from './dynamic-import-component';
import { Type, Compiler, Injector, ViewContainerRef, Component, NgModule } from '@angular/core';
import { DynamicEntryPoint } from '../define';
import { getSelector } from '../cdk/dynamic-component';
// import { createCustomElement } from "@angular/elements";
/**
 * !不能在动态组件中使用,因为没有意义, */
export class ElementDynamicImportStragegy  {
    constructor(
        private injector: Injector,
        private compiler: Compiler,
        private anchor: ViewContainerRef
    ) {
        // super()
    }
    async load(moduleFn: () => Promise<Type<DynamicEntryPoint>>) {
        console.log('载入');
        // console.log(element);
        /**模块的类 */
        let module = await moduleFn()
        /**载入的模块工厂 */
        const ngModuleFactory = await this.compiler.compileModuleAsync(module)
        const ngModuleRef = ngModuleFactory.create(this.injector)
        let selector = this.selector || getSelector(ngModuleRef)
        // console.log('选择器', selector);
        // let isDefine = await customElements.whenDefined(selector).then((res) => {
        //     console.log(res);
        //     return true
        // }).catch((rej) => {
        //     console.log(rej);
        //     return false
        // })
        // console.log(isDefine);
        // if (isDefine) return
        let { createCustomElement } = await import('@angular/elements')
        let customEl = createCustomElement(ngModuleRef.instance.entry, {
            injector: ngModuleRef.injector
        })
        customElements!.define(selector, customEl);
        //todo 已进行自定义未进行新增
        // console.log(selector);
        // console.log(this.anchor);
        // console.log(this.anchor.element);
        // console.log(this.anchor.element.nativeElement);

        // let el: HTMLElement = this.anchor.element.nativeElement
        // let newel = document.createElement(selector)
        // newel['test'] = 13234
        // console.dir(newel)
        // console.log(
        //     newel['tchange']
        // );
        // newel['ontchange'] = () => {
        //     console.log('测试');
        // }
        // newel.addEventListener('tchange',(e)=>{
        //     console.log('事件',e);
        // })
        // document.body.appendChild(newel)
        // // document.body.insertAdjacentHTML('afterbegin', `<${selector} test="'1231'"></${selector}>`)
    }
    setContext() { }
    setComponentBindingProperty() { }
    contextChange() { return this }
    inputChange() { return this }
    outputChange() { return this }
}