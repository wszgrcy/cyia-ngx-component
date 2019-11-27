import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingHintComponent } from './loading-hint.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  imports: [
    CommonModule,
    MatProgressSpinnerModule
  ],
  declarations: [LoadingHintComponent],
  entryComponents: [LoadingHintComponent]
})
export class LoadingHintModule { }
