import { LoadComponentService } from '../services/load-component.service';
import { ɵisPromise, ElementRef, ɵisObservable, Type } from '@angular/core';
import { tap } from 'rxjs/operators';
export function Loading<T = any>(elementRefFn: (type: T) => ElementRef<any>, component: Type<any>);
export function Loading<T = any>(elementRefFn: (type: T) => ElementRef<any>);
export function Loading<T = any>(elementRefFn: (type: T) => ElementRef<any>, component?: Type<any>) {
  return function (target, key: string, property: PropertyDescriptor) {
    const fn: Function = property.value;
    property.value = function () {
      const elementRef: ElementRef = elementRefFn(this);

      LoadComponentService.install.next(component ? { container: elementRef, loadComponent: component } : elementRef);
      const res = fn.call(this, arguments);
      if (ɵisPromise(res)) {
        return res.then((value) => {
          LoadComponentService.uninstall.next(elementRef);
          return value;
        });
      } else if (ɵisObservable(res)) {
        return res.pipe(tap(() => LoadComponentService.uninstall.next(elementRef)));
      }
      return res;
    };

    return property;
  };
}
