import { CyiaUpload4ImageModule } from '../upload4image/upload4image.module';
import { CyiaPopupModule } from '../popup.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CyiaEditFormComponent } from './cyia-edit-form.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MarkdownModule } from "ngx-markdown";
import { CyiaFormModule } from 'cyia-ngx-form';
import { CyiaDatePickerModule } from '../date-picker/date-picker.module';
@NgModule({
  imports: [
    CommonModule,
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
    CyiaUpload4ImageModule,
    CyiaDatePickerModule.forRoot('zh-cn'),
    FlexLayoutModule,

  ],
  declarations: [CyiaEditFormComponent],
  exports: [
    CyiaEditFormComponent,
    MatDialogModule
  ],
  entryComponents: [CyiaEditFormComponent]
})
export class CyiaEditFormModule { }
