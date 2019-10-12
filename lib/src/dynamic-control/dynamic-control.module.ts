import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicControlComponent } from './dynamic-control.component';
import { DYNAMIC_IMPORT_METHOD } from '../token/dynamic-import-method.token';
import { CompilerDynamicImportStragegy } from '../class/compiler-dynamic-import-strategy.class';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [DynamicControlComponent],
  exports: [DynamicControlComponent],
  providers: [
    { provide: DYNAMIC_IMPORT_METHOD, useValue: CompilerDynamicImportStragegy }
  ]
})
export class DynamicControlModule { }
