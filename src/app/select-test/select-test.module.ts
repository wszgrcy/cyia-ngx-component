import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectTestComponent } from './select-test.component';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  imports: [
    CommonModule,
    MatSelectModule
  ],
  declarations: [SelectTestComponent]
})
export class SelectTestModule { }
