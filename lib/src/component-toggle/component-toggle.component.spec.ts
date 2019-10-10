import { async, TestBed, ComponentFixture } from "@angular/core/testing";
import { CommonModule } from '@angular/common';
import { CyiaComponentToggleComponent } from './component-toggle.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Component, ViewChild, DebugElement } from '@angular/core';
import { componentInit } from '../testing/component-init';
import { CyiaComponentToggleModule } from './component-toggle.module';
@Component({
    template: `
    <cyia-component-toggle #ele>
    <ng-template [cyiaTemplateAnchor]="'front'">
    正面
  </ng-template>
  <ng-template [cyiaTemplateAnchor]="'end'">
    反面
  </ng-template>
    </cyia-component-toggle>
    <button mat-button (click)="toggle()">切换</button>
    `
})
class TestComponent {
    @ViewChild(CyiaComponentToggleComponent, { static: true }) toggleComp: CyiaComponentToggleComponent
    // value = false
    toggle() {
        console.log('调用点击');
        // console.log(this.toggleComp);
        // this.value = !this.value
        this.toggleComp.toggle()
    }
}
fdescribe('组件(正反面)切换', () => {
    let component: TestComponent;
    let fixture: ComponentFixture<TestComponent>;
    let hostElement: HTMLElement
    let debugElement: DebugElement
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [CommonModule, CyiaComponentToggleModule, BrowserAnimationsModule],
            declarations: [TestComponent]
        }).compileComponents()
    }))
    beforeEach(() => {
        ({ fixture, component, hostElement, debugElement } = componentInit(TestComponent));
    })
    it('运行', () => {
        // fixture.detectChanges()
        expect(component.toggleComp.isToggle).toBeFalsy()
        hostElement.querySelector('button').click()
        fixture.detectChanges()
        expect(component.toggleComp.isToggle).toBeTruthy()
        expect(hostElement.querySelector('.toggle')).toBeTruthy()

    })
})