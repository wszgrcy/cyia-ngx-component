import { Directive, ElementRef, Output, EventEmitter, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[cyiaTextCopy]'
})
export class TextCopyDirective {
  @Output() copy = new EventEmitter()
  @Input() value: string;
  hostElement: HTMLElement
  private fakeElem: HTMLTextAreaElement | null;
  constructor(private elementRef: ElementRef) {
    this.hostElement = this.elementRef.nativeElement
  }

  createFake(text: string) {
    const docElem = document.documentElement!;
    const isRTL = docElem.getAttribute('dir') === 'rtl';
    this.fakeElem = document.createElement('textarea');
    this.fakeElem.style.fontSize = '12pt';
    this.fakeElem.style.border = '0';
    this.fakeElem.style.padding = '0';
    this.fakeElem.style.margin = '0';
    this.fakeElem.style.position = 'absolute';
    this.fakeElem.style[isRTL ? 'right' : 'left'] = '-9999px';
    const yPosition = window.pageYOffset || docElem.scrollTop;
    this.fakeElem.style.top = yPosition + 'px';
    this.fakeElem.setAttribute('readonly', '');
    this.fakeElem.value = text;

    document.body.appendChild(this.fakeElem);

    this.fakeElem.select();
    this.fakeElem.setSelectionRange(0, this.fakeElem.value.length);
  }

  removeFake() {
    if (this.fakeElem) {
      document.body.removeChild(this.fakeElem);
      this.fakeElem = null;
    }
  }
  @HostListener('click', ['$event'])
  copyText() {
    try {
      this.createFake(this.value);
      this.copy.emit(document.execCommand('copy'))
    } catch (err) {
      this.copy.emit(false)
    } finally {
      this.removeFake();
    }
  }

}
