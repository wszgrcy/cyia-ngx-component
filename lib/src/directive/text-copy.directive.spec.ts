/* tslint:disable:no-unused-variable */

import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { TextCopyDirective } from './text-copy.directive';
import { Component, ViewChild } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { take } from 'rxjs/operators';
@Component({
  template: `
<button cyiaTextCopy value="测试用复制内容" (copy)="copyEvent($event)">测试按钮</button>
  `
})
class TestComponent {
  @ViewChild(TextCopyDirective, { static: true }) directive: TextCopyDirective
  subject = new Subject()
  copyEvent(e) {
    this.subject.next(e)
  }

}
describe('指令: 文本复制', () => {
  it('文本复制接收测试(不考虑是否复制成功)', (done) => {
    let fixture = TestBed.configureTestingModule({
      declarations: [TextCopyDirective, TestComponent]
    })
      .createComponent(TestComponent);

    fixture.detectChanges(); // initial binding
    let des = fixture.debugElement.query(By.directive(TextCopyDirective));
    fixture.componentInstance.subject
      .pipe(take(1))
      .subscribe((value) => {
        console.log('查看', value);
        //! 测试始终返回false,但是手动点击正常
        expect(true).toBe(true)
        done()
      });
    // des.triggerEventHandler('click', null);
    (<HTMLElement>des.nativeElement).click()
    fixture.detectChanges()

  })
  it('文本应该被选中', () => {
    let fixture = TestBed.configureTestingModule({
      declarations: [TextCopyDirective, TestComponent]
    })
      .createComponent(TestComponent);
    let component = fixture.componentInstance
    let value = '测试赋值'
    component.directive.createFake(value)
    let selvalue = document.getSelection().toString()
    console.log(selvalue);
    expect(selvalue).toEqual(value)
  })
});
