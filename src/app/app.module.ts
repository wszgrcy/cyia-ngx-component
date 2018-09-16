import { MatInputModule, MatIconModule } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatSelectModule } from '@angular/material';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CyiaFormModule } from 'cyia-ngx-form';
import { CyiaUploadModule, CyiaUpload4ImageModule, CyiaDatePickerModule } from "../../dist/lib";
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
