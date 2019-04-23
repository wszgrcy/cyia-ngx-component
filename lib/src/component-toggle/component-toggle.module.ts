import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentToggleComponent } from './component-toggle.component';
import { CyiaDirectiveModule } from '../directive/directive.module';

@NgModule({
  imports: [
    CommonModule,
    CyiaDirectiveModule
  ],
  declarations: [ComponentToggleComponent],
  exports: [ComponentToggleComponent]
})
export class ComponentToggleModule { }
