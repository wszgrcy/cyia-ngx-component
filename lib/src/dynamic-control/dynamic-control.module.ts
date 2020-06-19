import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicControlComponent } from './dynamic-control.component';
import { DYNAMIC_IMPORT_METHOD } from '../token/dynamic-import-method.token';
import { ViewDynamicImportStragegy } from '../class/view-dynamic-import-strategy.class';
@NgModule({
  imports: [CommonModule],
  declarations: [DynamicControlComponent],
  exports: [DynamicControlComponent],
  providers: [{ provide: DYNAMIC_IMPORT_METHOD, useValue: ViewDynamicImportStragegy }],
})
export class DynamicControlModule {}
