import { requestList } from './configure/http-list';
import { CyiaHttpModule } from 'cyia-ngx-common';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { CyiaFormModule } from 'cyia-ngx-form';
import { CyiaUploadModule, CyiaUpload4ImageModule, CyiaDirectiveModule, CyiaColorPickerModule, CyiaComponentToggleModule, DynamicControlModule, CyiaMarkdownModule, CyiaFormGroupModule } from "cyia-ngx-component";
import { CyiaDatePickerModule } from "cyia-ngx-component";
import { MatPaginatorModule } from '@angular/material/paginator';

// import { EditformModule } from './editform/editform.module';
import { RouterModule } from '@angular/router';
// import { CyiaPaginatorPatchModule } from '../../lib/src/paginator-patch/paginator-patch.module';
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
        // CyiaFormModule,
        MatInputModule,
        CyiaUploadModule,
        MatIconModule,
        CyiaUpload4ImageModule,
        // EditformModule,//doc 子组件
        CyiaDirectiveModule,
        MatPaginatorModule,
        // CyiaPaginatorPatchModule
        CyiaColorPickerModule,
        CyiaComponentToggleModule,
        CyiaMarkdownModule,
        RouterModule.forRoot([
            { path: 'lazy', loadChildren: () => import('./lazy-load/lazy-load.module').then(m => m.LazyLoadModule) }
        ]),
        DynamicControlModule,
        CyiaFormGroupModule
    ],
    providers: [

    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
