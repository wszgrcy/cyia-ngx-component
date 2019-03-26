import { Directive, Input, HostListener, ViewContainerRef, ElementRef, ContentChildren, QueryList, TemplateRef } from '@angular/core';
import { FabItem, DEFAULT_STRATEGY_LIST } from '../define/fablist-directive.define';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';

@Directive({
  selector: '[cyiaFabList]',

})
export class FabListDirective {
  /**策略列表 */
  @Input() cyiaFabList: FabItem[] = []
  /**用于实例化的模板列表 */
  @ContentChildren(TemplateRef) templateRefQueryList: QueryList<TemplateRef<any>>
  /**实例用策略列表 */
  strategyList: { template: TemplateRef<any>, overlayRef: OverlayRef }[] = []
  constructor(
    private overlay: Overlay,
    private viewContainerRef: ViewContainerRef,
    private elementRef: ElementRef
  ) { }
  ngOnInit(): void {
  }
  ngAfterViewInit(): void {
    this.setItemStrategy()
  }
  setItemStrategy() {
    while (this.cyiaFabList.length < this.templateRefQueryList.length) {
      this.cyiaFabList.push({ origin: this.cyiaFabList.length - 1 })
    }
    this.cyiaFabList.forEach(({ positionStrategyList = DEFAULT_STRATEGY_LIST, origin = undefined }, i) => {
      let elementRef = origin === undefined || !i || origin > i ? this.elementRef : new ElementRef(this.strategyList[origin].overlayRef.overlayElement)
      let positionStrategy = this.overlay
        .position()
        .connectedTo(elementRef, positionStrategyList[0].originPos, positionStrategyList[0].overlayPos)
        .withOffsetX(positionStrategyList[0].offsetX || 0)
        .withOffsetY(positionStrategyList[0].offsetY || 0)
      if (positionStrategyList.length > 1) {
        positionStrategyList
          .filter((val, i) => i)
          .forEach((item) => {
            positionStrategy = positionStrategy.withFallbackPosition(item.originPos, item.overlayPos, item.offsetX || 0, item.offsetY || 0)
          })
      }
      let overlayRef = this.overlay.create({
        positionStrategy: positionStrategy,
        disposeOnNavigation: true
      })
      this.strategyList.push({
        template: this.templateRefQueryList.find((val, j) => j == i),
        overlayRef: overlayRef
      })
    })
  }
  @HostListener('click')
  click() {
    this.strategyList.forEach(({ template, overlayRef }, i) => {
      if (overlayRef && overlayRef.hasAttached()) {
        overlayRef.detach()
      } else
        overlayRef.attach(new TemplatePortal(template, this.viewContainerRef))
    })
  }
}
