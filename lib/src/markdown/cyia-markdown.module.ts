import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CyiaMarkdownComponent } from './cyia-markdown.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatSliderModule } from '@angular/material/slider';
import { InsertUrlModule } from './insert/insert-url/insert-url.module';
import { InsertImageModule } from './insert/insert-image/insert-image.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CyiaMarkdownReadModule } from './read/cyia-markdown-read.module'
@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatSliderModule,
    InsertImageModule,
    InsertUrlModule,
    MatSnackBarModule,
    CyiaMarkdownReadModule
  ],
  declarations: [CyiaMarkdownComponent],
  entryComponents: [CyiaMarkdownComponent],
  exports: [CyiaMarkdownComponent]
})
export class CyiaMarkdownModule {
  entry = CyiaMarkdownComponent
}
