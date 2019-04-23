import { NgModule } from '@angular/core';
import { FileDropzoneDirective } from './file-dropzone.directive';
import { PaginatorPatchDirective } from './paginator-patch.directive';
import { TextCopyDirective } from './text-copy.directive';
import { FabListDirective } from './fab-list.directive';
import { OverlayModule } from '@angular/cdk/overlay';
import { TemplateAnchorDirective } from './template-anchor.directive';

@NgModule({
   imports: [
      OverlayModule
   ],
   declarations: [
      FileDropzoneDirective,
      PaginatorPatchDirective,
      TextCopyDirective,
      FabListDirective,
      TemplateAnchorDirective,
   ],
   exports: [
      FileDropzoneDirective,
      PaginatorPatchDirective,
      TextCopyDirective,
      FabListDirective,
      TemplateAnchorDirective
   ]
})
export class CyiaDirectiveModule { }
