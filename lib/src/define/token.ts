import { InjectionToken } from "@angular/core";
import { LoadingServiceAbstract } from "../services/loading.servicce";

export const LOADING_SERVICE = new InjectionToken<LoadingServiceAbstract>('loading');
export const MESSAGE_CONFIG = new InjectionToken('message')