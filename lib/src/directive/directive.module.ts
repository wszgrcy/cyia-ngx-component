import { NgModule } from '@angular/core';
import { FileDropzoneDirective } from './file-dropzone.directive';
import { PaginatorPatchDirective } from './paginator-patch.directive';

@NgModule({
   imports: [],
   declarations: [
      FileDropzoneDirective,
      PaginatorPatchDirective,

   ],
   exports: [
      FileDropzoneDirective,
      PaginatorPatchDirective
   ]
})
export class CyiaDirectiveModule { }
