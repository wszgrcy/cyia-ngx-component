import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CyiaFilepicker } from './file.component';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
/**
 * 自定义mat控件
 */
@NgModule({
  imports: [
    CommonModule,
    MatInputModule,
    FormsModule
  ],
  declarations: [CyiaFilepicker],
  exports: [CyiaFilepicker]
})
export class CyiaFilepickerModule { }
