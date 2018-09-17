import { Injectable } from "@angular/core";

@Injectable()
export abstract class LoadingServiceAbstract {

    /**
     * @description 0-100
     * @abstract
     * @memberof LoadingServiceAbstract
     */
    abstract progress: number;
    abstract description: string
}