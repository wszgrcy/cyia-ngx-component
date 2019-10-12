import { Type } from '@angular/core';

import { DynamicEntryPoint } from '../define';

export abstract class DynamicImportStrategy {
    selector: string
    abstract load(moduleFn: () => Promise<Type<DynamicEntryPoint>>): any
    // abstract getSelector(): any
    abstract setComponentBindingProperty(dynamicInput, dynamicOutput): any
    abstract setContext(context): any
    abstract contextChange(value): this
    abstract inputChange(value): this
    abstract outputChange(value): this
}