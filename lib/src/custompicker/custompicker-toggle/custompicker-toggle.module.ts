import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustompickerToggleComponent } from './custompicker-toggle.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule
  ],
  declarations: [CustompickerToggleComponent],
  exports: [CustompickerToggleComponent]
})
export class CustompickerToggleModule { }
