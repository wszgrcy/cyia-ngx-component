import { MatInputModule, MatIconModule } from '@angular/material';
import { CyiaDatePickerModule } from './../../lib/src/lib/date-picker/date-picker.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatSelectModule } from '@angular/material';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CyiaFormModule } from 'cyia-ngx-form';
import { CyiaUploadModule } from 'lib/src/lib/upload/upload.module';
import { CyiaUpload4ImageModule } from 'lib/src/lib/upload4image/upload4image.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    CyiaDatePickerModule.forRoot('zh-cn'),
    BrowserAnimationsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    CyiaFormModule,
    MatInputModule,
    CyiaUploadModule,
    MatIconModule,
    CyiaUpload4ImageModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
