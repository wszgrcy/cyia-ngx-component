import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InsertImageComponent } from './insert-image.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  imports: [
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule
  ],
  declarations: [InsertImageComponent],
  exports: [InsertImageComponent, MatDialogModule],
  entryComponents: [InsertImageComponent]
})
export class InsertImageModule { }
