import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicControlComponent } from './dynamic-control.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [DynamicControlComponent],
  exports:[DynamicControlComponent]
})
export class DynamicControlModule { }
