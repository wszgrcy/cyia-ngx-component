/* tslint:disable:no-unused-variable */

import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { FabListDirective } from './fab-list.directive';
import { Component } from '@angular/core';
import { Subject, config } from 'rxjs';
import { FabItem } from '../define';
import { OverlayModule } from '@angular/cdk/overlay';
import { By } from '@angular/platform-browser';
@Component({
  template: `
<button [cyiaFabList]="list">测试按钮
<ng-template>
<div class="testMsg">弹出信息</div>
</ng-template>
</button>
  `
})
class TestComponent {
  list: FabItem[] = [
    {
      positionStrategyList: [
        {
          originPos: { originX: 'end', originY: 'top' },
          overlayPos: { overlayX: 'start', overlayY: 'top' }
        }]
    }
  ]

}
describe('指令: 附加组件', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent
  beforeEach(async () => {
    console.log('配置')
    fixture = TestBed.configureTestingModule({
      imports: [OverlayModule],
      declarations: [FabListDirective, TestComponent],
      providers: [
        { provide: ComponentFixtureAutoDetect, useValue: true }
      ]
    })
      .createComponent(TestComponent);
    console.log('配置结束')
    component = fixture.componentInstance
  })
  it('点击后显示信息', () => {
    let el = fixture.debugElement.query(By.directive(FabListDirective))
    console.log(el);
    el.triggerEventHandler('click', null)
    let msgEl = document.querySelector('.testMsg')
    console.log(msgEl)
    expect(msgEl).toBeTruthy()
    el.triggerEventHandler('click', null)
    msgEl = document.querySelector('.testMsg')
    console.log('再次点击', msgEl)
    expect(msgEl).toBeFalsy()
  });
});
