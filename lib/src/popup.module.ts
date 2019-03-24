import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LOADING_PROGRESS, SPINNER_CONFIG } from './define/token';
import { CyiaPopupModuleConfig } from './define/loading-data.define';
import { MessageService } from './services/message.service';
import { MatSnackBarModule, MatDialogModule, MatProgressSpinnerModule } from '@angular/material';
import { LoadingDialogComponent } from './loading-dialog/loading-dialog.component';
import { LoadingServiceAbstract } from './services/loading.servicce';
// import { LoadingServiceAbstract } from './services/';
const entryComponentsArray = [LoadingDialogComponent]

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
        ...entryComponentsArray,
    ],
    entryComponents: [...entryComponentsArray],
})
export class CyiaPopupModule {
    static forRoot(config: CyiaPopupModuleConfig): ModuleWithProviders {
        return {
            ngModule: CyiaPopupModule,
            providers: [
                // config.service,
                /**上传显示进度 */
                { provide: LOADING_PROGRESS, useClass: config.service || LoadingServiceAbstract as any },
                /**提示框内容 */
                { provide: SPINNER_CONFIG, useValue: config.spinnerConfig }

            ]
        }
    }
}