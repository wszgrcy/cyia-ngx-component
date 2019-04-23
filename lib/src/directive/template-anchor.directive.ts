import { Directive, TemplateRef, Input } from '@angular/core';

@Directive({
  selector: '[cyiaTemplateAnchor]'
})
export class TemplateAnchorDirective {
  @Input('cyiaTemplateAnchor') name: string
  constructor(public template: TemplateRef<any>) { }

}
