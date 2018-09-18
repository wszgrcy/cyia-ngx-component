import { requestList } from './configure/http-list';
import { CyiaHttpModule } from 'cyia-ngx-common';
import { MatInputModule, MatIconModule } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatSelectModule } from '@angular/material';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CyiaFormModule } from 'cyia-ngx-form';
import { CyiaUploadModule, CyiaUpload4ImageModule, CyiaDatePickerModule } from "cyia-component";
import { EditformModule } from './editform/editform.module';
@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        CyiaHttpModule.forRoot(requestList),//doc 自请求
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
        CyiaUpload4ImageModule,
        EditformModule,//doc 子组件
    ],
    providers: [

    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
