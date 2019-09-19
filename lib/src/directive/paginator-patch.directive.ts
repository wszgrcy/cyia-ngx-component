import { Directive, ViewChild, ViewContainerRef, TemplateRef, ElementRef, Input, NgZone, Renderer2, EmbeddedViewRef, EventEmitter, Output, ChangeDetectorRef, Optional } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { take, throttleTime, filter } from "rxjs/operators";
import { coerceNumberProperty } from '@angular/cdk/coercion';
import { ChangeDetectionStrategy } from '@angular/compiler/src/core';
@Directive({
  selector: '[cyiaPaginatorPatch]'
})
export class PaginatorPatchDirective {
  /**
   * TODO 当页面变更时保留状态
   */
  @Input('template') templateRef: TemplateRef<any>
  /**分页器元素 */
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
    // console.log('页数变更', value);
    this._length = coerceNumberProperty(value);
    // console.log(this._length);
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
    /**分页器的实体容器引用*/private viewContainerRef: ViewContainerRef,
    private elementRef: ElementRef,
    @Optional() private matPaginator: MatPaginator,
    private zone: NgZone,
    private renderer: Renderer2,
    private cd: ChangeDetectorRef
    // private templateRef: TemplateRef<HTMLElement>
  ) {
    if (!this.matPaginator) throw '此指令为MatPaginator专用'
    this.hostElement = this.elementRef.nativeElement
    // console.log(this.hostElement);
    //doc 自身事件,页面变更变更索引
    this.paginatorChange.pipe(
      filter(() => this.hasInit),
      throttleTime(0)
    ).subscribe((val) => {
      console.log('页面变更111');
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
    console.log('页面初始化');
    this.addPageIndex()
  }
  /**
   * 移除页面索引?
   *
   * @memberof PaginatorPatchDirective
   */
  removePageIndex() {
    // this.patch.viewRef.destroy()
  }
  /**
   * 添加页面索引?
   *
   * @memberof PaginatorPatchDirective
   */
  addPageIndex() {
    let pageIndex = this.matPaginator.getNumberOfPages();
    // console.log('获得页数?', pageIndex);
    // console.log(this.patch);
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
      //? 点击最后一个?
      if (!hasActive && this.hasInit) {
        this.pageClick(this.patch.list.length - 1)()
      }
    }
    if (this.hasInit) {
      return
    }
    this.patch.viewRef = this.templateRef.createEmbeddedView({ $implicit: { list: this.patch.list } })
    this.zone.onStable.pipe(take(1)).subscribe(() => {
      //doc 先插入到视图中
      this.viewContainerRef.insert(this.patch.viewRef)
      this.zone.run(() => {
        this.zone.onStable.pipe(take(1)).subscribe(() => {
          //doc 查找节点
          this.patch.node = this.patch.viewRef.rootNodes.find(({ nodeType }) => nodeType === 1)
          //doc 增加类名
          this.renderer.addClass(this.patch.node, 'mat-paginator-page-index-container')
          let nextBtn = this.hostElement.querySelector('.mat-paginator-navigation-next')
          //doc 插入到下一个按钮前面
          this.renderer.insertBefore(nextBtn.parentNode, this.patch.node, nextBtn)
          this.hasInit = true
        })
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
