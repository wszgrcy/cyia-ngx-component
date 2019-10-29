import { Component, OnInit, ChangeDetectionStrategy, ContentChild, TemplateRef, Input, Type } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject, merge } from 'rxjs';
import { take, filter } from 'rxjs/operators';
import { Route } from '@angular/router';
import { OverlayConfig, OverlayRef, Overlay, PositionStrategy, ScrollStrategy } from '@angular/cdk/overlay';
import { CustompickerInput } from '../custompicker-input.directive';

@Component({
  selector: 'cyia-custompicker-wrapper',
  templateUrl: './custompicker-wrapper.component.html',
  styleUrls: ['./custompicker-wrapper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class CustompickerWrapperComponent implements OnInit {
  /**
   * todo 懒加载模块
   */
  @Input() path: Route['loadChildren']
  @Input() component: Type<any>
  /**打开还是附加 */
  @Input() mode
  custompickerInput: CustompickerInput
  resultChange = new Subject()
  overlayRef: OverlayRef
  constructor(
    private matDialog: MatDialog,
    private overlay: Overlay
  ) { }

  ngOnInit() {
    this.overlayRef = this.overlay.create({
      positionStrategy: this._createPopupPositionStrategy(),
      hasBackdrop: true,
      backdropClass: 'mat-overlay-transparent-backdrop',
      // scrollStrategy:()=>ScrollStrategy
    })
  }
  async  open() {
    let ref = this.matDialog.open(this.component)
    const res = await ref.afterClosed().pipe(take(1)).toPromise()
    this.resultChange.next(res)
    return ref
  }
  async openPopup() {
this.overlayRef
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
