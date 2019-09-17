import { Directive, ViewChild, ViewContainerRef, TemplateRef, ElementRef, Input, NgZone, Renderer2, EmbeddedViewRef, EventEmitter, Output } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { take, throttleTime, filter } from "rxjs/operators";
import { coerceNumberProperty } from '@angular/cdk/coercion';
@Directive({
  selector: '[cyiaPaginatorPatch]'
})
export class PaginatorPatchDirective {
  /**
   * TODO 当页面变更时保留状态
   */
  @Input('template') templateRef: TemplateRef<any>
  hostElement: HTMLElement
  patch: {
    node: HTMLElement,
    viewRef: EmbeddedViewRef<any>,
    list: any[]
  } = {
      node: null,
      viewRef: null,
      list: []
    }
  paginatorChange = new EventEmitter()
  _length: number
  @Input() set length(value) {
    this._length = coerceNumberProperty(value);
    this.paginatorChange.emit()
  }
  get length() {
    return this._length
  }
  _pageSize: number
  @Input() set pageSize(value) {
    this._pageSize = Math.max(coerceNumberProperty(value), 0);
    this.paginatorChange.emit()
  }
  get pageSize() {
    return this._pageSize
  }
  _pageIndex: number
  @Input() set pageIndex(value) {
    this.paginatorChange.emit()
    this._pageIndex = Math.max(coerceNumberProperty(value), 0);
  }
  get pageIndex() {
    return this._pageIndex
  }
  @Output() page = new EventEmitter()
  hasInit = false
  constructor(
    private viewContainerRef: ViewContainerRef,
    private elementRef: ElementRef,
    private matPaginator: MatPaginator,
    private zone: NgZone,
    private renderer: Renderer2
    // private templateRef: TemplateRef<HTMLElement>
  ) {
    this.hostElement = this.elementRef.nativeElement
    this.paginatorChange.pipe(
      filter(() => this.hasInit),
      throttleTime(0)
    ).subscribe((val) => {
      this.removePageIndex()
      this.addPageIndex()
    })
  }
  ngOnInit(): void {
    this.matPaginator.page.subscribe(({ pageIndex }) => {
      this.patch.list.forEach((value, j) => {
        value.active = j === pageIndex
      })
    })
  }
  ngAfterViewInit(): void {
    this.addPageIndex()
  }
  removePageIndex() {
    // this.patch.viewRef.destroy()
  }
  addPageIndex() {
    let pageIndex = this.matPaginator.getNumberOfPages();
    for (let i = this.patch.list.length; i < pageIndex; i++) {
      this.patch.list.push({
        index: i + 1,
        active: i === 0,
        click: this.pageClick(i)
      })
    }
    if (this.patch.list.length > pageIndex) {
      this.patch.list.splice(pageIndex)
      let hasActive = this.patch.list.find(({ active }) => active)
      if (!hasActive && this.hasInit) {
        this.pageClick(this.patch.list.length - 1)()
      }
    }
    if (this.hasInit) {
      return
    }
    this.patch.viewRef = this.templateRef.createEmbeddedView({ $implicit: {list:this.patch.list} })
    this.zone.onStable.pipe(take(1)).subscribe(() => {
      this.viewContainerRef.insert(this.patch.viewRef)
      this.zone.onStable.pipe(take(1)).subscribe(() => {
        this.patch.node = this.patch.viewRef.rootNodes.find(({ nodeType }) => nodeType === 1)
        this.renderer.addClass(this.patch.node, 'mat-paginator-page-index-container')
        let nextBtn = this.hostElement.querySelector('.mat-paginator-navigation-next')
        this.renderer.insertBefore(nextBtn.parentNode, this.patch.node, nextBtn)
        this.hasInit = true
      })

    })
  }

  /**
   * @description 页面索引值点击事件
   * @author cyia
   * @date 2019-03-24
   * @param clickIndex
   * @memberof PaginatorPatchDirective
   */
  pageClick(clickIndex: number) {
    return () => {
      this.matPaginator.pageIndex = clickIndex;
      this.patch.list.forEach((value, j) => {
        value.active = j === clickIndex
      })
      this.page.emit({
        //TODO 选择索引时按默认前一个,此时不能确定顺序
        // previousPageIndex: ~(i - 1) ? i - 1 : 0,
        pageIndex: clickIndex,
        pageSize: this.pageSize,
        length: this.length
      })

    }
  }
}
