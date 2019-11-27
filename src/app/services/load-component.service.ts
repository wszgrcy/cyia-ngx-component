import { Injectable, ElementRef, Inject, Type } from '@angular/core';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { OverlayRef, Overlay, BlockScrollStrategy } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { LoadingHintComponent } from '../loading-hint/loading-hint.component';

@Injectable()
export class LoadComponentService {
  static install = new Subject<ElementRef<any> | { container: ElementRef, loadComponent: Type<any> }>();
  static uninstall = new Subject<ElementRef<any>>();
  static map = new Map<ElementRef, OverlayRef>();
  constructor(
    private dialog: MatDialog,
    private overlay: Overlay,
    @Inject('DEFAULT_LOADING_COMPONENT') component: Type<any>
  ) {
    LoadComponentService.install.subscribe((item) => {
      if (item instanceof ElementRef) {
        this.install(item, component);
      } else {
        this.install(item.container, item.loadComponent);
      }
    });
    LoadComponentService.uninstall.subscribe((item) => {
      this.uninstall(item);
    });

  }

  install(elementRef: ElementRef<HTMLElement>, component: Type<any>) {
    const ref = this.overlay.create({
      positionStrategy: this.overlay.position().flexibleConnectedTo(elementRef)
        .withPositions([
          { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'top' }
        ]),
      width: elementRef.nativeElement.clientWidth,
      height: elementRef.nativeElement.clientHeight,
      panelClass: 'cdk-overlay-dark-backdrop',
      scrollStrategy: this.overlay.scrollStrategies.reposition()
    });
    ref.attach(new ComponentPortal(component));
    ref.overlayElement.style.pointerEvents = 'all';
    ref.overlayElement.style.overflow = 'hidden';
    LoadComponentService.map.set(elementRef, ref);
  }
  uninstall(elementRef: ElementRef) {
    const ref = LoadComponentService.map.get(elementRef);
    // ref.hostElement.style.pointerEvents = 'none';
    ref.detach();
  }
}
