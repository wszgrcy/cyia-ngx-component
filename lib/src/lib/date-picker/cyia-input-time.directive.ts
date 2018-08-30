import { Directive, ElementRef, Input, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appCyiaInputTime]',
  host: {
    input: '_input()'
  }
})
export class CyiaInputTimeDirective {

  constructor(private eleRef: ElementRef) {
    console.warn(eleRef)
  }

  _input() {
    console.log('测试')
  }
  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    console.log(changes)
  }
}
