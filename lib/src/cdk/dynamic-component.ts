import { NgModuleRef } from '@angular/core';
import { DynamicEntryPoint } from '../define/dynamic.class';

export function getSelector(ngModuleRef: NgModuleRef<DynamicEntryPoint>): string {
    try {
        return (<any>ngModuleRef.instance.entry).__annotations__[0].selector
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