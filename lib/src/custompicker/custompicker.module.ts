import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustompickerToggleModule } from "./custompicker-toggle/custompicker-toggle.module";
import { CustompickerWrapperModule } from "./custompicker-wrapper/custompicker-wrapper.module";
import { CustompickerInputDirective } from './custompicker-input.directive';
@NgModule({
   imports: [
      CommonModule
   ],
   declarations: [
      CustompickerInputDirective
   ],
   exports: [
      CustompickerToggleModule,
      CustompickerWrapperModule,
      CustompickerInputDirective
   ]
})
export class CustompickerModule { }
