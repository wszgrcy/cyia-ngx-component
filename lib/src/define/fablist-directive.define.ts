import { OriginConnectionPosition, OverlayConnectionPosition } from '@angular/cdk/overlay';

export interface FabItem {
    // icon?: string;
    // click?: Function;
    // backgroundColor?: string;
    // color?: string
    origin?: number
    positionStrategyList?: PositionStrategy[]
}
export interface PositionStrategy {
    offsetX?: number;
    offsetY?: number;
    originPos: OriginConnectionPosition,
    overlayPos: OverlayConnectionPosition
}
export const DEFAULT_STRATEGY_LIST: PositionStrategy[] = [
    { originPos: { originX: 'start', originY: 'top' }, overlayPos: { overlayX: 'start', overlayY: 'bottom' } },
    { originPos: { originX: 'end', originY: 'top' }, overlayPos: { overlayX: 'start', overlayY: 'top' } },
    { originPos: { originX: 'start', originY: 'bottom' }, overlayPos: { overlayX: 'start', overlayY: 'top' } },
    { originPos: { originX: 'start', originY: 'top' }, overlayPos: { overlayX: 'end', overlayY: 'top' } },
]