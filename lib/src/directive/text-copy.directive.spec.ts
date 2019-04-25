/* tslint:disable:no-unused-variable */

import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { TextCopyDirective } from './text-copy.directive';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { take } from 'rxjs/operators';
@Component({
  template: `
<button cyiaTextCopy value="测试用复制内容" (copy)="copyEvent($event)">测试按钮</button>
  `
})
class TestComponent {
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
        // expect(true).toBe(true)
        done()
      })
    des.triggerEventHandler('click', null)
    fixture.detectChanges()
    setTimeout(() => {
      throw '超时'
    }, 2000);
  })

});
