import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CyiaFormControlComponent } from './cyia-form-control.component';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CyiaMarkdownModule } from '../cyia-markdown/cyia-markdown.module';
import { CyiaDatePickerModule } from '../../../date-picker/date-picker.module';
import { CyiaFormControlReadModule } from '../cyia-form-control-read/cyia-form-control-read.module';
import { CyiaFormControlWriteModule } from '../cyia-form-control-write/cyia-form-control-write.module';
// import { CyiaDatePickerModule } from "cyia-ngx-component";
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CyiaFormControlWriteModule,
    CyiaFormControlReadModule
  ],
  declarations: [CyiaFormControlComponent],
  exports: [CyiaFormControlComponent]
})
export class CyiaFormControlModule { }
