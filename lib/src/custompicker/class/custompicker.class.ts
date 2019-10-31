import { OverlayRef } from '@angular/cdk/overlay';
import { MatDialogRef } from '@angular/material/dialog';

export class Custompicker<T = any> {
    /**弹窗引用,控制关闭 */
    matdialogref?: MatDialogRef<Custompicker, any>
    /**附加组件.实例引用,控制关闭 */
    overlayRef?: OverlayRef
    /**附加组件.传出参数时调用 */
    outputValue?: { value: T, display: string }
    /**附加组件.要传入参数时调用 */
    inputValue?: any

    /**
     * 关闭调用
     *
     * @param outputValue 需要返回的值,value为实际绑定的值,display为显示的值
     * @memberof Custompicker
     */
    close(outputValue: { value: T, display: string }) {
        if (this.matdialogref) {
            this.matdialogref.close(outputValue)
        } else if (this.overlayRef) {
            this.outputValue = outputValue
            this.overlayRef.detach()
        }
    }
}