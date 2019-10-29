import { Component, OnInit, ChangeDetectionStrategy, Input, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import md from "markdown-it";
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'cyia-markdown-read',
  templateUrl: './cyia-markdown-read.component.html',
  styleUrls: ['./cyia-markdown-read.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CyiaMarkdownReadComponent implements OnInit {
  @Input() value: string
  rendererValue
  @Input() readonly mdClassMap = {
    h1: 'mat-h1',
    h2: 'mat-h2',
    h3: 'mat-h3',
    h4: 'mat-h4',
  }
  constructor(
    private cd: ChangeDetectorRef,
    private domSanitizer: DomSanitizer,
  ) { }

  ngOnInit() {
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.value && this.value) {
      this.initRead()
    }

  }

  initRead() {
    // console.log(this.tempValue);
    let mdres = md({
      html: true,
    })
    // console.log(mdres);
    mdres.core.ruler.after('linkify', 'style-renderer', (s) => {
      s.tokens.forEach((token) => {
        if (this.mdClassMap[token.tag]) {
          token.attrJoin('class', this.mdClassMap[token.tag])
        }
      })
    })
    this.rendererValue = this.domSanitizer.bypassSecurityTrustHtml(
      mdres.render(this.value)
    )
    // console.log(this.value, this.rendererValue);
    this.cd.markForCheck()
  }
}
