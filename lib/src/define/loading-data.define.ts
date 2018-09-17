import { LoadingServiceAbstract } from "../services/loading.servicce";

export interface LoadingData extends SpinnerCoreConfig {
    mode: 'determinate' | 'indeterminate';
    value?: number;
    content?: string;

}
export interface SpinnerCoreConfig {
    diameter?: number;
    strokeWidth?: number;
    color?: 'primary' | 'accent' | 'warn' | undefined;
}

export interface CyiaPopupModuleConfig {
    service: LoadingServiceAbstract;
    spinnerConfig: SpinnerCoreConfig;

}
