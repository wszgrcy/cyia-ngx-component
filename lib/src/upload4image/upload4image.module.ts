import { FilesizePipe } from './../pipe/filesize.pipe';
import { FormsModule } from '@angular/forms';
import { CyiaUploadModule } from './../upload/upload.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CyiaUpload4ImageComponent } from './upload4image.component';
import { MatCardModule, MatButtonModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    CyiaUploadModule,
    MatCardModule,
    FormsModule,
    MatButtonModule
  ],
  declarations: [
    CyiaUpload4ImageComponent,
    FilesizePipe
  ],
  exports: [
    CyiaUpload4ImageComponent
  ]
})
export class CyiaUpload4ImageModule { }
