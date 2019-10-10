import { async, TestBed, ComponentFixture } from "@angular/core/testing";
import { CommonModule } from '@angular/common';
import { CyiaComponentToggleModule, CyiaComponentToggleComponent } from 'dist/lib';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Component, ViewChild } from '@angular/core';
@Component({
    template: `
    <cyia-component-toggle ></cyia-component-toggle>
    <button mat-button (click)="toggle()">切换</button>
    `
})
class TestComponent {
    @ViewChild(CyiaComponentToggleComponent, { static: true }) toggleComp: CyiaComponentToggleComponent
    value = false
    toggle() {
        this.value = !this.value
    }
}
fdescribe('组件(正反面)切换', () => {
    let component: TestComponent;
    let fixture: ComponentFixture<TestComponent>;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [CommonModule, CyiaComponentToggleModule, BrowserAnimationsModule],
            declarations: [CyiaComponentToggleComponent]
        }).compileComponents()
    }))
    beforeEach(() => {
        fixture = TestBed.createComponent(TestComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    })
    it('运行', () => { })
})