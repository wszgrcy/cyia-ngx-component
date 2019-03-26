import { NgModule } from '@angular/core';
import { FileDropzoneDirective } from './file-dropzone.directive';
import { PaginatorPatchDirective } from './paginator-patch.directive';
import { TextCopyDirective } from './text-copy.directive';
import { FabListDirective } from './fab-list.directive';
import { OverlayModule } from '@angular/cdk/overlay';

@NgModule({
   imports: [OverlayModule],
   declarations: [
      FileDropzoneDirective,
      PaginatorPatchDirective,
      TextCopyDirective,
      FabListDirective
   ],
   exports: [
      FileDropzoneDirective,
      PaginatorPatchDirective,
      TextCopyDirective,
      FabListDirective
   ]
})
export class CyiaDirectiveModule { }
