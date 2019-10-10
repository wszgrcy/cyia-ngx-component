import { async, TestBed, ComponentFixtureAutoDetect, ComponentFixture } from "@angular/core/testing";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CyiaColorPickerModule } from './color-picker.module';
import { Component, ViewChild } from '@angular/core';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ColorPickerComponent } from './color-picker.component';
import { syncRun } from '../testing/sync-run';
@Component({
    template: `<cyia-colorpicker [(ngModel)]="value"></cyia-colorpicker>`
})
class TestComponent {
    @ViewChild(ColorPickerComponent, { static: true }) colorPicker: ColorPickerComponent
    value
}
describe('颜色选择器', () => {
    let component: TestComponent;
    let fixture: ComponentFixture<TestComponent>;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CommonModule,
                FormsModule,
                CyiaColorPickerModule,
                BrowserAnimationsModule
            ],
            declarations: [TestComponent],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        }).compileComponents()
    }))
    beforeEach(() => {
        fixture = TestBed.createComponent(TestComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    })
    it('运行', () => {
        let el = fixture.debugElement.query(By.css('cyia-colorpicker'))
        // console.log(el);
        expect(el).toBeTruthy()
        expect(el.nativeElement).toBeTruthy()
    })
    it('赋值', (done) => {
        component.value = '#ffffff'
        fixture.detectChanges()
        setTimeout(() => {
            expect(component.colorPicker._value).toEqual(component.value)
            done()
        }, 200);

    })
    it('点击预设', async (done) => {
        await syncRun(() => { }, 1000)
        let el: HTMLElement = fixture.debugElement.nativeElement
        let color: HTMLElement = el.querySelector('ul+ul li')
        expect(color).toBeTruthy()
        color.click()
        await syncRun(() => {
            console.log(component.value);
            expect(component.value).toBeTruthy()
        }, 200)
        done()
    })
    it('预设元素选中', async (done) => {
        component.value = '#fce4ec'
        fixture.detectChanges()
        await syncRun(() => {
            let el: HTMLElement = fixture.debugElement.nativeElement
            let li: HTMLElement = el.querySelector('ul+ul li')
            expect(li.className.includes('selected')).toBeTruthy()
        })
        done()
    })
})