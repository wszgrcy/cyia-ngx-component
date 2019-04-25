/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed, ComponentFixtureAutoDetect, tick, fakeAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CyiaTimeComponent } from './cyia-time.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule, MatInputModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { newEvent } from '../../testing';
fdescribe('CyiaTimeComponent', () => {
  let component: CyiaTimeComponent;
  let fixture: ComponentFixture<CyiaTimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, BrowserAnimationsModule],
      declarations: [CyiaTimeComponent],
      providers: [{ provide: ComponentFixtureAutoDetect, useValue: true }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CyiaTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('输入时间', fakeAsync(() => {
    fixture.detectChanges()
    tick()

    let el: HTMLInputElement = fixture.debugElement.query(By.css('[name=hour]')).nativeElement
    el.value = '99' as any
    console.log(el)
    el.dispatchEvent(newEvent('input', true));
    fixture.detectChanges()
    tick()
  }))
});
