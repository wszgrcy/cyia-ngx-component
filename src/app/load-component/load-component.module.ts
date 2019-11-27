import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadComponentComponent } from './load-component.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [LoadComponentComponent],
  exports: [LoadComponentComponent]
})
export class LoadComponentModule { }
