import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CyiaComponentToggleComponent } from './component-toggle.component';
import { CyiaDirectiveModule } from '../directive/directive.module';

@NgModule({
  imports: [
    CommonModule,

  ],
  declarations: [CyiaComponentToggleComponent],
  exports: [CyiaComponentToggleComponent, CyiaDirectiveModule],

})
export class CyiaComponentToggleModule { }
