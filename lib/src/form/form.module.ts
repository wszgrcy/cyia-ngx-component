import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CyiaFormGroupModule } from './component/cyia-form-group/cyia-form-group.module';

@NgModule({
    declarations: [],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CyiaFormGroupModule
    ],
    exports: [
        FormsModule,
        ReactiveFormsModule
    ],
})
export class CyiaFormModule { }