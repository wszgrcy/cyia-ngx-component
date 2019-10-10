/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed, ComponentFixtureAutoDetect, tick, fakeAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement, Component } from '@angular/core';

import { CyiaTimeComponent } from './cyia-time.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { newEvent } from '../../testing';
// import { newEvent } from '../../testing';
// import { cpus } from 'os';
@Component({
  template: `<app-cyia-time></app-cyia-time>`
})
class TestComponent {

}
describe('CyiaTimeComponent', () => {
  let component: CyiaTimeComponent;
  let fixture: ComponentFixture<CyiaTimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        BrowserAnimationsModule
      ],
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
  it('输入时间', ((done) => {
    fixture.detectChanges()
    // tick()
    setTimeout(() => {
      let el: HTMLInputElement = fixture.debugElement.query(By.css('[name=hour]')).nativeElement
      el.focus()
      fixture.detectChanges()
      el.value = '20' as any
      fixture.detectChanges()
      el.blur()
      el.dispatchEvent(newEvent('input', true));
      console.dir(el)
      fixture.detectChanges()
      fixture.changeDetectorRef.detectChanges()
      fixture.changeDetectorRef.markForCheck()
      console.log('小时变更');
      expect(fixture.componentInstance.time.hour).toBe(20)
      done()
    }, 500);
  }))
  it('输入时间过界', ((done) => {
    fixture.detectChanges()
    // tick()
    setTimeout(() => {
      let el: HTMLInputElement = fixture.debugElement.query(By.css('[name=hour]')).nativeElement
      el.focus()
      fixture.detectChanges()
      el.value = '999' as any
      fixture.detectChanges()
      el.blur()
      el.dispatchEvent(newEvent('input', true));
      console.dir(el)
      fixture.detectChanges()
      fixture.changeDetectorRef.detectChanges()
      fixture.changeDetectorRef.markForCheck()
      console.log('小时变更', fixture.componentInstance.time.hour);
      expect(fixture.componentInstance.time.hour).toBe(23)
      done()
    }, 500);
  }))
});
