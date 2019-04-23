import { Component, OnInit, ChangeDetectionStrategy, ElementRef, ContentChildren, QueryList, TemplateRef, ChangeDetectorRef, Input } from '@angular/core';
import { TemplateAnchorDirective } from '../directive/template-anchor.directive';
import { coerceCssTimeValue } from '../cdk/cyia-coercion';

@Component({
  selector: 'cyia-component-toggle',
  templateUrl: './component-toggle.component.html',
  styleUrls: ['./component-toggle.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'ComponentToggle'
})
export class ComponentToggleComponent implements OnInit {
  @ContentChildren(TemplateAnchorDirective) set templateAnchorList(list: QueryList<TemplateAnchorDirective>) {
    list.forEach((item) => {
      this.templateObject[item.name] = item.template
    })
  }
  templateObject: {
    front?: TemplateRef<any>,
    end?: TemplateRef<any>
  } = {}

  isToggle = false;
  hostElement: HTMLElement
  constructor(
    private cd: ChangeDetectorRef,
    elementRef: ElementRef
  ) {
    this.hostElement = elementRef.nativeElement
  }
  /**
   * 持续时间: 毫秒数
   *
   */
  @Input() set duration(value: number) {
    if (value === undefined) return
    let childList = this.hostElement.querySelectorAll('.front,.end')
    childList.forEach((element: HTMLElement) => {
      element.style.transition = `transform ${coerceCssTimeValue(value)} ease-out 0s, opacity ${coerceCssTimeValue(value)} ease-in 0s`
    })
  }
  ngOnInit() {
  }

  ngAfterContentInit(): void { }
  public toggle(bool?: boolean) {
    if (bool !== undefined) {
      this.isToggle = bool
    } else {
      this.isToggle = !this.isToggle;
    }
    this.cd.markForCheck()
  }
}
