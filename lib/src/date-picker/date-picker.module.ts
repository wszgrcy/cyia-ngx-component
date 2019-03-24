import { CyiaTimeComponent } from './cyia-time/cyia-time.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgModule } from '@angular/core';
import { CyiaDatePickerComponent } from './date-picker.component';
import { ModuleWithProviders } from '@angular/compiler/src/core';
import { MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS, MatInputModule } from "@angular/material";
import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    MatDatepickerModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule
  ],
  declarations: [
    CyiaDatePickerComponent,
    CyiaTimeComponent
  ],
  exports: [
    CyiaDatePickerComponent,
    FormsModule,
    MatInputModule,
    MatDatepickerModule,
    MatFormFieldModule
  ],
  providers: []
})
export class CyiaDatePickerModule {
  static forRoot(language: string): ModuleWithProviders {
    return {
      ngModule: CyiaDatePickerModule,
      providers: [
        { provide: MAT_DATE_LOCALE, useValue: language },
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
        { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
      ]
    }
  }

}
