import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustompickerWrapperComponent } from './custompicker-wrapper.component';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  imports: [
    CommonModule,
    MatDialogModule
  ],
  declarations: [CustompickerWrapperComponent],
  exports: [CustompickerWrapperComponent]
})
export class CustompickerWrapperModule { }
