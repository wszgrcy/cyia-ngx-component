import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CyiaFormControlReadComponent } from './cyia-form-control-read.component';
import { CyiaMarkdownModule } from 'cyia-ngx-component/markdown';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    CyiaMarkdownModule,
    FormsModule
  ],
  declarations: [CyiaFormControlReadComponent],
  exports: [CyiaFormControlReadComponent]
})
export class CyiaFormControlReadModule { }
