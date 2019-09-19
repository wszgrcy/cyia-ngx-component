/* tslint:disable:no-unused-variable */

import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { PaginatorPatchDirective } from './paginator-patch.directive';
import { Component, ChangeDetectionStrategy } from '@angular/core';
// import { FabItem } from 'lib/define';
import { OverlayModule } from '@angular/cdk/overlay';
// import { FabListDirective } from 'lib/directive/fab-list.directive';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { take } from 'rxjs/operators';
@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  template: `
  <mat-paginator [length]="length" [pageSize]="size" cyiaPaginatorPatch [template]="template1" color="primary"
  (page)="test($event)">
</mat-paginator>
<ng-template #template1 let-content>
  <div>
    <button mat-icon-button *ngFor="let item of content.list;let i=index" class=" page-num " (click)="item.click()"
      [class.active]="item.active" color="primary">
      <!-- <mat-icon>{{i+1}}</mat-icon> -->
      {{item.index}}
    </button>
  </div>
</ng-template>

  `,
  styleUrls: ['../../../src/styles.css']

})
class TestComponent {
  // constructor(private cd ) { }
  event = new Subject()
  length = 20
  size = 5
  test(e) {
    console.log(e)
    this.event.next(e)
  }
}
describe('指令: 分页器补丁', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent
  beforeEach(async () => {
    fixture = TestBed.configureTestingModule({
      imports: [MatPaginatorModule, MatButtonModule, BrowserAnimationsModule, CommonModule],
      declarations: [PaginatorPatchDirective, TestComponent,
      ],
      providers: [
        { provide: ComponentFixtureAutoDetect, useValue: true }
      ]
    })
      .createComponent(TestComponent);
    component = fixture.componentInstance
  })
  function displayIndexLength(length: number) {
    let numList = document.querySelectorAll('.mat-paginator-page-index-container .page-num')
    expect(numList.length).toBe(length)
  }
  async function changePageWithIndex(length?: number) {
    let numList = document.querySelectorAll('.mat-paginator-page-index-container .page-num');
    for (let i = 0; i < numList.length; i++) {
      const element: HTMLElement = numList[i] as any;
      let p: Promise<any> = component.event.pipe(take(1)).toPromise()
      element.click()
      let res = await p
      expect(res.pageIndex).toEqual(i)
    }
    length && expect(numList.length).toEqual(length)
  }
  it('是否显示', () => {
    displayIndexLength(4)
  });
  it('点击索引变动', async (done) => {
    await changePageWithIndex()
    done()
  })
  it('变更总数据', async (done) => {
    component.length = 99
    let page = Math.ceil(component.length / component.size)
    fixture.changeDetectorRef.detectChanges()
    setTimeout(async () => {
      displayIndexLength(page)
      await changePageWithIndex(page)
      component.length = 1
      page = Math.ceil(component.length / component.size)
      fixture.changeDetectorRef.detectChanges()
      setTimeout(async () => {
        displayIndexLength(page)
        await changePageWithIndex(page)
        done()
      }, 20);
    }, 0);
  })
  it('变更单页大小', async (done) => {
    component.size = 1
    let page = Math.ceil(component.length / component.size)
    fixture.changeDetectorRef.detectChanges()
    setTimeout(async () => {
      displayIndexLength(page)
      await changePageWithIndex(page)
      component.size = 1000;
      page = Math.ceil(component.length / component.size)
      console.log('页面', page);
      fixture.changeDetectorRef.detectChanges()
      setTimeout(async () => {
        displayIndexLength(page)
        await changePageWithIndex(page)
        done()
      }, 20);
    }, 0);
  })
});
