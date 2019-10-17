import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter, ElementRef, Renderer2, ChangeDetectorRef, CUSTOM_ELEMENTS_SCHEMA, forwardRef, ViewChild, Optional, Inject } from '@angular/core';
import { PRESET_COLOR, CanvasObject, Point } from '../define/color-picker.define';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import chroma from "chroma-js";
import { fromEvent, Subject } from 'rxjs';
import { takeWhile, skipUntil, takeUntil, tap } from 'rxjs/operators';
import { coerceCssPixelValue, coerceBooleanProperty } from '@angular/cdk/coercion';
// import { DOCUMENT } from '@angular/common';
// import { OverlayRef } from '@angular/cdk/overlay';


@Component({
  selector: 'cyia-colorpicker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => CyiaColorpicker), multi: true }
  ]
})
export class CyiaColorpicker implements ControlValueAccessor {
  readonly PRESET_COLOR = PRESET_COLOR;
  private changeFn: Function = () => { };
  private touchedFn: Function = () => { };
  hostElement: HTMLElement
  constructor(
    elementRef: ElementRef,
    private renderer: Renderer2,
    private cd: ChangeDetectorRef,
    // @Optional() @Inject(DOCUMENT) private _document: any
  ) {
    this.hostElement = elementRef.nativeElement
  }
  private _selectedIndex: number;
  isInitColorWheel = false;


  get selectedIndex() {
    return this._selectedIndex
  }
  set selectedIndex(i) {
    this._selectedIndex = i
  }
  registerOnChange(fn) {
    this.changeFn = fn;
  }
  registerOnTouched(fn) {
    this.touchedFn = fn;
  }
  _value: string
  writeValue(value) {
    //doc 只有字符串才能转换
    if (value == undefined) return
    this._value = chroma(value).hex()
    for (let i = 0; i < this.PRESET_COLOR.palettes.length; i++) {
      const palette = this.PRESET_COLOR.palettes[i];
      for (let j = 0; j < palette.hexes.length; j++) {
        const color = palette.hexes[j];
        if (color == this._value) {
          return
        }
      }
    }
    this._selectedIndex = 1;


  }
  /**
   * @description 切换tab
   * @author cyia
   * @date 2019-03-31
   * @param e
   * @memberof ColorPickerComponent
   */
  animationDone(e) {
    if (this.selectedIndex == 1) {
      this.initColorWheel()
      this.colorToCoordinate(chroma(this._value).hsv())
      this.scale = chroma.scale([this._value, '#000000']).domain([0, +this.canvas.slider.clientHeight])
      this.sliderBeginColor = this._value
    } else {
    }

  }
  valueChange(color: string) {
    this._value = color
    this.changeFn(color)
    this.touchedFn(color)
    // this.cd.markForCheck()
  }
  canvas: CanvasObject = {
    el: null,
    icon: null,
    slider: null,
    sliderIcon: null,
    sizePx: 250,
    // loaded: !1
  }
  luminanceValue: number = 1;
  ngOnInit(): void {
  }
  initColorWheel() {
    if (this.isInitColorWheel) return
    this.initCanvas()
    this.drawCanvas()
    this.cursorMoveLinstener()
    this.changeSlider()

    this.isInitColorWheel = true

  }
  ngAfterViewInit(): void { }
  scale: chroma.Scale<chroma.Color>
  sliderBeginColor
  getColorWithSlider(e: MouseEvent) {
    const [x, y] = [Math.floor(e.clientX - this.canvas.slider.getBoundingClientRect().left), Math.floor(e.clientY - this.canvas.slider.getBoundingClientRect().top)];
    this.luminanceValue = (this.canvas.slider.clientHeight - y) / this.canvas.slider.clientHeight
    this._value = this.scale(y).hex()
  }
  /**
   * @description 监听滑块变化
   * @author cyia
   * @date 2019-03-31
   * @memberof ColorPickerComponent
   */
  changeSlider() {
    fromEvent(this.canvas.slider, 'mousemove')
      .pipe(
        skipUntil(fromEvent(this.canvas.slider, 'mousedown').pipe(tap((e) => {
          // this.getColorWithSlider(e)
        }))),
        takeUntil(fromEvent(this.canvas.slider, 'mouseup'))
      )
      .subscribe((e: MouseEvent) => {
        this.setSliderFromMousePosition(e)
        this.getColorWithSlider(e)
      }, undefined, this.changeSlider.bind(this))

  }
  /**
   * @description 监听光标的移动
   * @author cyia
   * @date 2019-03-31
   * @memberof ColorPickerComponent
   */
  cursorMoveLinstener() {
    let setCursorPositionFn = (e: MouseEvent) => {
      const domRect = this.canvas.el.getBoundingClientRect();
      const [x, y] = [Math.floor(e.clientX - domRect.left), Math.floor(e.clientY - domRect.top)];
      const coordinateObj = this.getColorSpaceCoordinates(x, y);
      this.setColorWheelFromMousePosition({ x: coordinateObj.x, y: coordinateObj.y }) as any;
      this.valueChange(chroma.hsv(coordinateObj.h, coordinateObj.s, this.luminanceValue).hex())
      this.scale = chroma.scale([this._value, '#000000']).domain([0, +this.canvas.slider.clientHeight])
      this.sliderBeginColor = this._value
    }
    fromEvent(this.canvas.el, 'mousemove')
      .pipe(
        skipUntil(fromEvent(this.canvas.el, 'mousedown').pipe(tap((e) => {
          setCursorPositionFn(e)
        }))),
        takeUntil(fromEvent(this.canvas.el, 'mouseup'))
      )
      .subscribe((e: MouseEvent) => {
        setCursorPositionFn(e)
      }, undefined, this.cursorMoveLinstener.bind(this))
  }
  initCanvas() {
    this.canvas.el = this.hostElement.querySelector('canvas')
    this.canvas.icon = this.hostElement.querySelector('.color-wheel__canvas mat-icon')
    this.canvas.slider = this.hostElement.querySelector('.color-luminance-slider__bar')
    this.canvas.sliderIcon = this.hostElement.querySelector('.color-luminance-slider__icon')
    this.canvas.ctx = this.canvas.el.getContext("2d");
    this.canvas.el.height = this.canvas.sizePx;
    this.canvas.el.width = this.canvas.sizePx;
    this.canvas.store = this.canvas.ctx.getImageData(0, 0, this.canvas.sizePx, this.canvas.sizePx);
    this.calculateCanvasSize(this.canvas.sizePx)
  }
  drawCanvas() {
    let { canvas } = this;
    let { el, radius, store, } = canvas

    let diameter = 2 * radius;
    let n = (pointX: number, pointY: number, red: number, green: number, blue: number) => {
      let pos = 4 * (pointX + pointY * el.width);
      store.data[pos + 0] = red;
      store.data[pos + 1] = green;
      store.data[pos + 2] = blue;
      store.data[pos + 3] = 255
      return {
        rgb: [red, green, blue],
        // rgbDataPos: {
        //   r: a,
        //   g: a + 1,
        //   b: a + 2
        // }
      }
    };
    // this.canvas.allPixels = [];
    for (let ponitX = 0; diameter > ponitX; ponitX++)
      for (let ponitY = 0; diameter > ponitY; ponitY++) {
        let l = this.getColorSpaceCoordinates(ponitX, ponitY);
        //doc 如果没有超过范围
        if (!l.outRange) {
          let hsv = chroma.hsv(l.h, l.s, this.luminanceValue);
          let rgb = hsv.rgb();
          let colorData = n(ponitX, ponitY, rgb[0], rgb[1], rgb[2]);

          // this.canvas.allPixels.push({
          //   hsv: chroma.rgb(...(<[number, number, number]>colorData.rgb)).hsv(),
          //   // rgbDataPos: colorData.rgbDataPos
          // })
        }
      }
    this.updateCanvas()
  }
  private updateCanvas() {
    let { ctx, store } = this.canvas
    ctx.putImageData(store, 0, 0)
    this.calculateCanvasSize()
  }
  /**
   * @description 将颜色显示到色轮中
   * @author cyia
   * @date 2019-03-31
   * @param color
   * @memberof ColorPickerComponent
   */
  colorToCoordinate(color: chroma.ColorSpaces['hsv']) {

    let { centerX, centerY, radius } = this.canvas;
    let [hue, saturation, value] = color;
    let x: number, y: number;
    if (hue >= 0 && hue < 90) {
      x = Math.cos(hue / 180 * Math.PI) * color[1] * radius + radius
      y = Math.sin(hue / 180 * Math.PI) * color[1] * radius + radius
    } else if (hue >= 90 && hue < 180) {
      x = radius - Math.cos((180 - hue) / 180 * Math.PI) * color[1] * radius
      y = Math.sin((180 - hue) / 180 * Math.PI) * color[1] * radius + radius
    } else if (hue >= 180 && hue < 270) {
      x = radius - Math.cos((hue - 180) / 180 * Math.PI) * color[1] * radius
      y = radius - Math.sin((hue - 180) / 180 * Math.PI) * color[1] * radius
    } else if (hue >= 270 && hue < 360) {
      x = radius + Math.cos((360 - hue) / 180 * Math.PI) * color[1] * radius
      y = radius - Math.sin((360 - hue) / 180 * Math.PI) * color[1] * radius
    }
    this.setColorWheelFromMousePosition({ x, y })
    this.setSliderFromMousePosition(undefined, { x, y })
  }
  /**
   * rgb->hsv->坐标点
   * 
   * 
   */
  /**
   * @description 获取点坐标对应的颜色
   * @author cyia
   * @date 2019-03-27
   * @param x 当前坐标点x
   * @param y 当前坐标点Y
   * @returns
   * @memberof ColorPickerComponent
   */
  getColorSpaceCoordinates(x: number, y: number) {
    let { centerX, centerY, radius } = this.canvas;
    let offsetX = x - centerX;
    let offsetY = y - centerY;
    let angle = Math.atan2(offsetY, offsetX);
    let h = Math.round((180 * angle / Math.PI + 360) % 360);
    let distance = this.distanceBetweenTwoPoints({
      x: x,
      y: y
    }, {
        x: centerX,
        y: centerY
      }),
      value = {
        x: x,
        y: y,
        h: h,
        s: distance / radius,
        v: this.luminanceValue,
        outRange: false
      };
    //doc 超过边界取边界值
    return distance > radius && (value.x = Math.floor(Math.cos(angle) * radius + centerX),
      value.y = Math.floor(Math.sin(angle) * radius + centerY),
      value.outRange = true),
      value
  }

  /**
   * @description 计算两点之间的直线距离
   * @author cyia
   * @date 2019-03-30
   * @param point1
   * @param ponit2
   * @returns
   * @memberof ColorPickerComponent
   */
  distanceBetweenTwoPoints(point1: Point, ponit2: Point) {
    return Math.sqrt(Math.pow(point1.x - ponit2.x, 2) + Math.pow(point1.y - ponit2.y, 2))
  }
  calculateCanvasSize(size?) {
    var e = arguments.length <= 0 || void 0 === arguments[0] ? null : arguments[0];
    e || (e = this.canvas.el.getBoundingClientRect().width),
      this.canvas.centerX = e / 2,
      this.canvas.centerY = e / 2,
      this.canvas.radius = Math.min(this.canvas.centerX, this.canvas.centerY)
  }
  /**
   * @description 设置滑块的位置
   * @author cyia
   * @date 2019-03-31
   * @param e
   * @param [point]
   * @memberof ColorPickerComponent
   */
  setSliderFromMousePosition(e: MouseEvent, point?: Point) {
    const domRect = this.canvas.slider.getBoundingClientRect();
    const [x, y] = point ? [point.x, point.y] : [Math.floor(e.clientX - domRect.left), Math.floor(e.clientY - domRect.top)];
    this.renderer.setStyle(this.canvas.sliderIcon, 'transform', `translate3d(${coerceCssPixelValue(0)},${coerceCssPixelValue(y)},0)`)
    this.cd.markForCheck()
  }
  /**
   * @description 设置在色轮中的位置
   * @author cyia
   * @date 2019-03-31
   * @param e
   * @param [point]
   * @memberof ColorPickerComponent
   */
  setColorWheelFromMousePosition(point?: Point) {
    // const domRect = this.canvas.el.getBoundingClientRect();
    const [x, y] = [point.x, point.y]
    this.renderer.setStyle(this.canvas.icon, 'transform', `translate3d(${coerceCssPixelValue(x)},${coerceCssPixelValue(y - 24)},0)`)
    this.cd.markForCheck()
    return [x, y]
  }



  get sliderBarBackground() {
    return !this.sliderBeginColor ? '#ffffff' : `linear-gradient(${this.sliderBeginColor},black)`
  }

}
