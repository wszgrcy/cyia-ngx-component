import { CyiaHttpService } from 'cyia-ngx-common';
import { CyiaEditFormModule, CyiaPopupModule } from 'cyia-component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditformComponent } from './editform.component';
import { MatDialogModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    MatDialogModule,
    CyiaEditFormModule,
    CyiaPopupModule.forRoot({
      service: null,
      spinnerConfig: {}
    })
  ],
  declarations: [EditformComponent],
  exports: [EditformComponent,
    // CyiaEditFormModule
  ],
  providers: []
})
export class EditformModule { }
