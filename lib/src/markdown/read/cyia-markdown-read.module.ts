import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CyiaMarkdownReadComponent } from './cyia-markdown-read.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [CyiaMarkdownReadComponent],
  entryComponents: [CyiaMarkdownReadComponent],
  exports: [CyiaMarkdownReadComponent]
})
export class CyiaMarkdownReadModule { }
