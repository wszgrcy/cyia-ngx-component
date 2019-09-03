import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicComponentComponent } from './dynamic-component.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [DynamicComponentComponent],
  exports: [DynamicComponentComponent]
})
export class DynamicComponentModule { }
