import { Type } from '@angular/core';

import { DynamicEntryPoint } from '../define';

export abstract class DynamicImportStrategy {
    abstract load(moduleFn: () => Promise<Type<DynamicEntryPoint>>): any
    // abstract getSelector(): any
    abstract setComponentBindingProperty(dynamicInput, dynamicOutput): this
    abstract setNgModel(value): this
    abstract setContext(context): this
    abstract contextChange(value): this
    abstract inputChange(value): this
    abstract outputChange(value): this
    abstract setNgModelChange(fn): this
    abstract setNgModelValue(value): this
}