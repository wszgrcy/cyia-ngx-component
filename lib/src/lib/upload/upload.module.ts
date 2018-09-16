import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CyiaUploadComponent } from './upload.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    CyiaUploadComponent,

  ],
  exports: [
    CyiaUploadComponent
  ]
})
export class CyiaUploadModule { }
