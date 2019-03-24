import { Directive, ElementRef, Output, EventEmitter, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[cyiaFileDropzone]',
  host: {
    '[class.dropped]': '!!files'
  }
})
export class FileDropzoneDirective {
  @Output() filesChange = new EventEmitter()
  @Input() files: File[]
  hostElement: HTMLElement
  fileEnter
  constructor(elementRef: ElementRef, renderer: Renderer2) {
    this.hostElement = elementRef.nativeElement
    this.hostElement.addEventListener('dragover', (e) => {
      e.preventDefault()
    })
    this.hostElement.addEventListener('dragenter', (e) => {
      renderer.addClass(this.hostElement, 'dragenter')
      e.preventDefault()
    })
    this.hostElement.addEventListener('dragleave', (e) => {
      renderer.removeClass(this.hostElement, 'dragenter')
      e.preventDefault()
    })
    this.hostElement.addEventListener('drop', (e) => {
      renderer.removeClass(this.hostElement, 'dragenter')
      this.filesChange.emit(Array.from(e.dataTransfer.files))
      e.preventDefault()
    })
  }

}
