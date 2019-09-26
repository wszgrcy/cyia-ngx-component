import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { CyiaFormControlWriteComponent } from './cyia-form-control-write.component';
@NgModule({
  imports: [
    CommonModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    MatSelectModule,
    MatCheckboxModule,
    MatRadioModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatAutocompleteModule,
    CyiaMarkdownModule,
    CyiaDatePickerModule.forRoot('zh-cn'),
  ],
  declarations: [CyiaFormControlWriteComponent],
  exports: [CyiaFormControlWriteComponent]
})
export class CyiaFormControlWriteModule { }
