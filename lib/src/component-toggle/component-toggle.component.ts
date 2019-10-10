import { Component, OnInit, ChangeDetectionStrategy, ElementRef, ContentChildren, QueryList, TemplateRef, ChangeDetectorRef, Input, Renderer2 } from '@angular/core';
import { TemplateAnchorDirective } from '../directive/template-anchor.directive';
import { coerceCssTimeValue } from '../cdk/cyia-coercion';

@Component({
  selector: 'cyia-component-toggle',
  templateUrl: './component-toggle.component.html',
  styleUrls: ['./component-toggle.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'ComponentToggle'
})
export class CyiaComponentToggleComponent implements OnInit {
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
  class: { [name: string]: boolean } = {
  }
  childList: NodeListOf<Element>
  constructor(
    private cd: ChangeDetectorRef,
    elementRef: ElementRef,
    private renderer: Renderer2
  ) {
    this.hostElement = elementRef.nativeElement
    this.direction = 'x'
    this.duration = 1000
    this.origin = 'left bottom'
  }
  private _direction: string
  /**
   * 旋转方向
   *
   */
  @Input() set direction(value: string) {
    if (!/x|y|z/i.test(value || '')) return
    for (const key in this.class) {
      if (/^rotate/.test(key))
        this.class[key] = false
    }
    this.class[`rotate${value.toLocaleUpperCase()}`] = true
    this._direction = value
    this.cd.markForCheck()
  }
  get() {
    return this._direction
  }
  /**
   * 持续时间: 毫秒数
   *
   */
  @Input() set duration(value: number) {
    if (value == undefined || !(typeof value === 'number')) return
    let childList = this.getChildList()
    childList.forEach((element: HTMLElement) => {
      element.style.transition = `transform ${coerceCssTimeValue(value)} ease-out 0s, opacity ${coerceCssTimeValue(value)} ease-in 0s`
    })
  }
  @Input() set origin(value) {
    if (value == undefined) return
    let childList = this.getChildList()
    childList.forEach((element: HTMLElement) => {
      this.renderer.setStyle(element, 'transform-origin', value)
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
    this.cd.detectChanges()
  }
  private getChildList() {
    if (!this.childList)
      this.childList = this.hostElement.querySelectorAll('.front,.end')
    return this.childList
  }
}
