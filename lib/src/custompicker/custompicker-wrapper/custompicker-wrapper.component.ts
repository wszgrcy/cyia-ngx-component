import { Component, OnInit, ChangeDetectionStrategy, ContentChild, TemplateRef, Input, Type, Optional, Compiler, NgModuleFactory, Injector } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject, merge, BehaviorSubject } from 'rxjs';
import { take, filter } from 'rxjs/operators';
import { Route, LoadChildrenCallback } from '@angular/router';
import { OverlayConfig, OverlayRef, Overlay, PositionStrategy, ScrollStrategy } from '@angular/cdk/overlay';
import { CustompickerInput } from '../custompicker-input.directive';
import { ComponentPortal } from '@angular/cdk/portal';
import { Custompicker } from '../class/custompicker.class';

@Component({
  selector: 'cyia-custompicker-wrapper',
  templateUrl: './custompicker-wrapper.component.html',
  styleUrls: ['./custompicker-wrapper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustompickerWrapperComponent implements OnInit {

  /**
   * ! 懒加载+弹窗时,由于没有传递相关参数,会报错,所以只能懒加载+附加模式运行
   * todo 有时间给dialog提pr
   * 
   */
  @Input() path: LoadChildrenCallback
  @Input() component: Type<Custompicker>
  /**0弹窗还是1附加 */
  @Input() mode = 1
  /**input指令 */
  custompickerInput: CustompickerInput
  /**弹窗时,在弹窗关闭,获取数据,input部分定义处理 */
  resultChange = new Subject()
  /**ngModel传入时保存数据 */
  inputChange = new BehaviorSubject(undefined)
  overlayRef: OverlayRef
  componentFactoryResolver
  constructor(
    private matDialog: MatDialog,
    private overlay: Overlay,
    @Optional() private compiler: Compiler,
    private injector: Injector
  ) { }

  ngOnInit() { }
  /**
   * 被toggle调用
   *
   * @returns
   * @memberof CustompickerWrapperComponent
   */
  async open() {
    this.component = await this.lazyLoadComponent()
    if (this.mode == 0) {
      this.openDialog()
    } else {
      this.openPopup()
    }
  }
  async lazyLoadComponent(): Promise<Type<any>> {
    if (!this.path) return undefined
    let module = await this.path()
    const ngModuleFactory = module instanceof NgModuleFactory ? module : await this.compiler.compileModuleAsync(module)
    const ngModuleRef = ngModuleFactory.create(this.injector)
    this.componentFactoryResolver = ngModuleRef.componentFactoryResolver
    return ngModuleRef.instance.entry
  }
  async openDialog() {
    let ref = this.matDialog.open(
      this.component, {
        //doc 将[ngModel]传入
        data: { value: this.inputChange.value }
      }
    )
    const res = await ref.afterClosed().pipe(take(1)).toPromise()
    this.resultChange.next(res)
    return ref
  }
  /**
   * 附加打开
   *
   * @memberof CustompickerWrapperComponent
   */
  async openPopup() {
    this.overlayRef = this.overlay.create({
      positionStrategy: this._createPopupPositionStrategy(),
      hasBackdrop: true,
      backdropClass: 'mat-overlay-transparent-backdrop',
      panelClass: 'mat-datepicker-popup',
      // scrollStrategy:()=>ScrollStrategy
    })
    let ref = this.overlayRef.attach(new ComponentPortal(this.component, undefined, undefined, this.componentFactoryResolver))
    ref.instance.overlayRef = this.overlayRef
    //doc 背景点击关闭
    this.overlayRef.backdropClick().subscribe(() => this.overlayRef.detach())
    ref.onDestroy(() => this.resultChange.next(ref.instance.outputValue))
  }


  private _createPopupPositionStrategy(): PositionStrategy {
    return this.overlay.position()
      .flexibleConnectedTo(this.custompickerInput.getConnectedOverlayOrigin())
      .withTransformOriginOn('.mat-datepicker-content')
      .withFlexibleDimensions(false)
      .withViewportMargin(8)
      .withLockedPosition()
      .withPositions([
        {
          originX: 'start',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'top'
        },
        {
          originX: 'start',
          originY: 'top',
          overlayX: 'start',
          overlayY: 'bottom'
        },
        {
          originX: 'end',
          originY: 'bottom',
          overlayX: 'end',
          overlayY: 'top'
        },
        {
          originX: 'end',
          originY: 'top',
          overlayX: 'end',
          overlayY: 'bottom'
        }
      ]);
  }
}
