import { Component, OnInit, ChangeDetectionStrategy, ContentChild, TemplateRef, Input, Type } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject, merge, BehaviorSubject } from 'rxjs';
import { take, filter } from 'rxjs/operators';
import { Route } from '@angular/router';
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
   * 这个应该接收组件用的
   */
  /**
   * todo 懒加载模块
   * 
   */
  @Input() path: Route['loadChildren']
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
  constructor(
    private matDialog: MatDialog,
    private overlay: Overlay
  ) { }

  ngOnInit() { }
  /**
   * 被toggle调用
   *
   * @returns
   * @memberof CustompickerWrapperComponent
   */
  async open() {
    if (this.mode == 0) {
      this.openDialog()
    } else {
      this.openPopup()
    }
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
    let ref = this.overlayRef.attach(new ComponentPortal(this.component))
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
