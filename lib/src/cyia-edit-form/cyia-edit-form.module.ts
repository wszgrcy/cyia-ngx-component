import { CyiaUpload4ImageModule } from './../upload4image/upload4image.module';
import { CyiaPopupModule } from './../popup.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CyiaEditFormComponent } from './cyia-edit-form.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule, MatSelectModule, MatDialogModule, MatButtonModule } from '@angular/material';
import { MarkdownModule } from "ngx-markdown";
import { CyiaFormModule } from 'cyia-ngx-form';
const entryComponentArray = [CyiaEditFormComponent]
@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MarkdownModule.forRoot(),
    MatSelectModule,
    MatDialogModule,
    CyiaPopupModule,
    CyiaFormModule,
    MatButtonModule,
    CyiaUpload4ImageModule
  ],
  declarations: [...entryComponentArray],
  exports: [...entryComponentArray,
    MatDialogModule
  ],
  entryComponents: [...entryComponentArray]
})
export class CyiaEditFormModule { }
