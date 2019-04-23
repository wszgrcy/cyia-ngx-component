import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColorPickerComponent as CyiaColorPickerComponent } from './color-picker.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    MatTabsModule,
    MatIconModule,
    FormsModule
  ],
  declarations: [CyiaColorPickerComponent],
  exports: [CyiaColorPickerComponent]
})
export class CyiaColorPickerModule { }
