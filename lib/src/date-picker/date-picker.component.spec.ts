import { TestBed, ComponentFixtureAutoDetect, async, ComponentFixture, fakeAsync, tick, flushMicrotasks } from "@angular/core/testing";
import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, ViewChild, Input, Inject, ElementRef } from '@angular/core';
import { CyiaDatePickerModule } from './date-picker.module';
import { By } from '@angular/platform-browser';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import * as moment from 'moment';
import { CyiaDatePickerComponent } from './date-picker.component';
@Component({
    template: `
    <mat-form-field>
  <cyia-datepicker [ngModel]="date" [matDatepicker]="picker" #cyiadate placeholder="测试标签浮动"></cyia-datepicker>
  <mat-datepicker #picker></mat-datepicker>
  <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
</mat-form-field>
    
    `
})
class TestComponent {
    date: any
    @ViewChild('cyiadate', { static: true }) cyiadate: CyiaDatePickerComponent
    @ViewChild('cyiadate', { static: true, read: ElementRef }) cyiadateEl: ElementRef<HTMLElement>
    constructor(@Inject(DOCUMENT) public document: Document) {
    }
    ngOnInit(): void {
        console.log('初始化');
    }
    ngAfterViewInit(): void {
        // console.log('视图初始', this.date);
    }
    ngOnDestroy(): void {
        console.log('销毁');
    }

}
describe('日期选择器', () => {
    let component: TestComponent;
    let fixture: ComponentFixture<TestComponent>;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CommonModule,
                CyiaDatePickerModule.forRoot('zh-cn'),
                MatFormFieldModule,
                MatInputModule,
                BrowserAnimationsModule
            ],
            declarations: [
                TestComponent
            ],
            providers: [{ provide: ComponentFixtureAutoDetect, useValue: true }]
        }).compileComponents()
    }))
    beforeEach(() => {
        fixture = TestBed.createComponent(TestComponent)
        component = fixture.componentInstance;
        fixture.detectChanges()
    })
    it('运行', () => {
        let el = fixture.debugElement.query(By.css('cyia-datepicker'))
        console.log(el);
        expect(el).toBeTruthy()
        expect(el.nativeElement).toBeTruthy()
    })
    it('传入日期', (done) => {
        let date = new Date()
        console.log('修改之前', fixture.componentInstance.date);
        fixture.componentInstance.date = date
        fixture.detectChanges()
        let datePicker = fixture.componentInstance.cyiadate
        console.log(datePicker.value);
        setTimeout(() => {
            expect(datePicker.value.valueOf()).toBe(moment(date).valueOf())
            done();
        }, 100);
    })
    // it('传入日期(fakeSync)', fakeAsync((done) => {
    //     tick(100)
    //     console.log('时间');
    //     let date = new Date()
    //     console.log('修改之前', fixture.componentInstance.date);
    //     fixture.componentInstance.date = date
    //     tick(100)
    //     fixture.detectChanges()
    //     tick(100)
    //     let datePicker = fixture.componentInstance.cyiadate
    //     console.log(datePicker.value);
    //     setTimeout(() => {
    //         expect(datePicker.value.valueOf()).toBe(moment(date).valueOf())
    //     }, 100);
    //     tick(100)
    // }))
    it('浮动', () => {
        let el: HTMLElement = fixture.nativeElement
        fixture.nativeElement
        component.cyiadateEl.nativeElement.click();
        let input = el.querySelector('input')
        input.value = 'any'
        input.dispatchEvent(new Event('input'))
        fixture.detectChanges()
        expect(fixture.debugElement.query(By.css('.mat-form-field-should-float'))).toBeTruthy()
    })
    it('输入小时', (done) => {
        fixture.componentInstance.date = new Date()
        fixture.detectChanges()
        setTimeout(() => {
            let el: HTMLElement = fixture.nativeElement
            component.cyiadateEl.nativeElement.click()
            // el.click()
            fixture.detectChanges()
            setTimeout(() => {
                let hour: HTMLInputElement = component.document.querySelector('input[name=hour]')
                console.log('小时', hour);
                hour.value = '1'
                hour.dispatchEvent(new Event('input'))
                fixture.detectChanges()
                console.log(new Date(component.cyiadate.value));
                expect(moment(component.cyiadate.value).hour()).toEqual(1)
                expect(fixture.debugElement.query(By.css('.mat-form-field-should-float'))).toBeTruthy()
                done()
            }, 300);
        }, 100);

    })
})