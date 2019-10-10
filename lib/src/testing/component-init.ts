import { TestBed } from '@angular/core/testing';
import { Type } from '@angular/core';

export function componentInit<T>(component: Type<T>) {
    let fixture = TestBed.createComponent(component)
    let componentInstance = fixture.componentInstance
    let hostElement = fixture.debugElement.nativeElement
    let debugElement = fixture.debugElement
    fixture.detectChanges();

    return { fixture, component: componentInstance, hostElement, debugElement }
}