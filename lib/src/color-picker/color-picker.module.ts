import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CyiaColorpicker } from './color-picker.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    MatTabsModule,
    MatIconModule,
    FormsModule
  ],
  declarations: [CyiaColorpicker],
  exports: [CyiaColorpicker]
})
export class CyiaColorpickerModule { }
