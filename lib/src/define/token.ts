import { InjectionToken } from "@angular/core";
import { LoadingServiceAbstract } from "../services/loading.servicce";

export const LOADING_PROGRESS = new InjectionToken<LoadingServiceAbstract>('loading');
export const SPINNER_CONFIG = new InjectionToken('message')