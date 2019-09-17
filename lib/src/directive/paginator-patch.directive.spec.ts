/* tslint:disable:no-unused-variable */

import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { PaginatorPatchDirective } from './paginator-patch.directive';
import { Component } from '@angular/core';
import { FabItem } from 'lib/define';
import { OverlayModule } from '@angular/cdk/overlay';
import { FabListDirective } from 'lib/directive/fab-list.directive';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
@Component({
  template: `
  <mat-paginator [length]="length" [pageSize]="5" cyiaPaginatorPatch [template]="template1" color="primary"
  (page)="test($event)">
</mat-paginator>
<ng-template #template1 let-content>
  <div>
    <button mat-icon-button *ngFor="let item of content.list;let i=index" class=" page-num " (click)="item.click()"
      [class.active]="item.active">
      <!-- <mat-icon>{{i+1}}</mat-icon> -->
      {{item.index}}
    </button>
  </div>
</ng-template>
  `
})
class TestComponent {
  length = 20

  test(e) {
    console.log(e)
  }
}
xdescribe('指令: 分页器补丁', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent
  beforeEach(async () => {
    fixture = TestBed.configureTestingModule({
      imports: [MatPaginatorModule, MatButtonModule, BrowserAnimationsModule],
      declarations: [PaginatorPatchDirective, TestComponent,
      ],
      providers: [
        { provide: ComponentFixtureAutoDetect, useValue: true }
      ]
    })
      .createComponent(TestComponent);
    component = fixture.componentInstance
  })
  it('是否显示', () => {
    // let el = fixture.debugElement.query(By.directive(PaginatorPatchDirective))
    let numList = document.querySelectorAll('.mat-paginator-page-index-container .page-num')
    expect(numList.length).toBeGreaterThan(0)
    expect(numList.length).toBe(4)
  });
  it('点击索引变动', () => {
    console.log('索引测试')
    let numList = document.querySelectorAll('.mat-paginator-page-index-container .page-num');
    (<HTMLElement>numList.item(1)).click()
    // numList.forEach((el: HTMLElement) => {
    //   el.click()
    // })
  })
});
