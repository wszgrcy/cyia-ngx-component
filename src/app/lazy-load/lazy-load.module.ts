import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LazyLoadComponent } from './lazy-load.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [LazyLoadComponent],
  entryComponents: [LazyLoadComponent],
  exports:[LazyLoadComponent]
})
export class LazyLoadModule {
  entry = LazyLoadComponent
}
