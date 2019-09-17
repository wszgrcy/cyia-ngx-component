import { LoadingProgressService } from './../services/loading-progress.service';
import { CyiaHttpService } from 'cyia-ngx-common';
import { CyiaPopupModule, LOADING_PROGRESS } from 'cyia-ngx-component';
import { CyiaEditFormModule } from 'cyia-ngx-component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditformComponent } from './editform.component';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  imports: [
    CommonModule,
    MatDialogModule,
    CyiaEditFormModule,

    CyiaPopupModule.forRoot({
      service: LoadingProgressService,
      spinnerConfig: {}
    }),
  ],
  declarations: [EditformComponent],
  exports: [EditformComponent,
    // CyiaEditFormModule
  ],
  providers: [
    LoadingProgressService,
    { provide: LOADING_PROGRESS, useClass: LoadingProgressService },

  ]
})
export class EditformModule { }
