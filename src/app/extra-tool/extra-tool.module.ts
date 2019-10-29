import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExtraToolComponent } from './extra-tool.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ExtraToolComponent],
  exports: [ExtraToolComponent]
})
export class ExtraToolModule { }
