import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CyiaFormControlComponent } from './cyia-form-control.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { CyiaFormControlReadModule } from '../cyia-form-control-read/cyia-form-control-read.module';
import { CyiaFormControlWriteModule } from '../cyia-form-control-write/cyia-form-control-write.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CyiaFormControlWriteModule,
    CyiaFormControlReadModule
  ],
  declarations: [CyiaFormControlComponent],
  exports: [CyiaFormControlComponent]
})
export class CyiaFormControlModule { }
