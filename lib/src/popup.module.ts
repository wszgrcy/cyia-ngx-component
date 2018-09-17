import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LOADING_SERVICE, MESSAGE_CONFIG } from './define/token';
import { CyiaPopupModuleConfig } from './define/loading-data.define';
import { MessageService } from './services/message.service';
import { MatSnackBarModule, MatDialogModule, MatProgressSpinnerModule } from '@angular/material';
import { LoadingDialogComponent } from './loading-dialog/loading-dialog.component';
const entryComponentsArray = [LoadingDialogComponent]
/**
 * todo 没有flex模块,用css调整
 */
@NgModule({
    declarations: [
        ...entryComponentsArray
    ],
    imports: [
        CommonModule,
        MatSnackBarModule,
        MatDialogModule,
        MatProgressSpinnerModule
    ],
    providers: [MessageService],
    exports: [
        // MessageService,
        ...entryComponentsArray,
    ],
    entryComponents: [...entryComponentsArray],
})
export class CyiaPopupModule {
    static forRoot(config: CyiaPopupModuleConfig): ModuleWithProviders {
        return {
            ngModule: CyiaPopupModule,
            providers: [
                { provide: LOADING_SERVICE, useClass: config.service as any },
                { provide: MESSAGE_CONFIG, useValue: config.spinnerConfig }

            ]
        }
    }
}