import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter,
  Input,
  forwardRef,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Sanitizer,
  SimpleChanges,
  TemplateRef,
  NgZone,
} from '@angular/core';
import * as monaco from 'monaco-editor';
import { WrapType, StartType, MultiStartType, Pattern } from './type/editor.type';
import { repeat, take } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { InsertImageComponent } from './insert/insert-image/insert-image.component';
import { InsertUrlComponent } from './insert/insert-url/insert-url.component';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
// import md from "markdown-it";
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';
// import { Pattern } from '../../class/cyia-form.class';
import { coerceCssPixelValue } from '@angular/cdk/coercion';
@Component({
  selector: 'cyia-markdown',
  templateUrl: './cyia-markdown.component.html',
  styleUrls: ['./cyia-markdown.component.scss'],
  providers: [
    {
      useExisting: forwardRef(() => CyiaMarkdownComponent),
      provide: NG_VALUE_ACCESSOR,
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CyiaMarkdownComponent implements ControlValueAccessor {
  @Input() extraTool: TemplateRef<any>;
  @ViewChild('container', { static: true }) container: ElementRef<HTMLDivElement>;
  @Input() pattern: Pattern = Pattern.w;
  @Input() set height(val: string) {
    if (val != undefined) {
      this._height = val;
    }
  }
  get height() {
    return this._height;
  }
  _height = '300px';
  readonly editorBarPrefix = 'editor-bar-';
  @Input() readonly mdClassMap = {
    h1: 'mat-h1',
    h2: 'mat-h2',
    h3: 'mat-h3',
    h4: 'mat-h4',
  };
  // flag = {
  //   quote: false
  // }
  instance: monaco.editor.IStandaloneCodeEditor;
  readonly WRAP_GROUP: { [name: string]: string } = {
    [WrapType.format_bold]: '**',
    [WrapType.format_italic]: '*',
    [WrapType.delete]: '~~',
  };
  readonly START_GROUP = {
    [StartType.format_quote]: '>',
    [StartType.format_list_bulleted]: '- ',
    // ---
  };
  readonly MULTI_START: { [name: string]: { value: string | string[]; repeat: boolean } } = {
    [MultiStartType.format_quote]: {
      value: '>',
      repeat: true,
    },
    [MultiStartType.format_list_bulleted]: { value: '- ', repeat: true },
    [MultiStartType.format_list_numbered]: {
      value: new Array(100).fill(0).map((v, i) => `${i + 1}. `),
      repeat: false,
    },
  };

  disabled: Boolean = false;
  value = '';
  tempValue: string;
  /**只读时 */
  readValue: SafeHtml;
  /**只读模式 */
  readMode = false;
  constructor(
    private matDialog: MatDialog,
    private cd: ChangeDetectorRef,
    private domSanitizer: DomSanitizer,
    private snackBar: MatSnackBar,
    private ngZone: NgZone
  ) {}
  async writeValue(value) {
    if (typeof value == 'string') {
      this.tempValue = this.value = value;
      if (this.pattern == Pattern.r) {
        // this.initRead()
      } else if (this.pattern == Pattern.w) {
        await this.initWrite();
      }
      this.instance && this.instance.setValue(value);
    }
  }
  registerOnChange(fn) {
    this.changeFn = fn;
  }
  registerOnTouched(fn) {
    this.touchedFn = fn;
  }
  private changeFn: Function = () => {};
  private touchedFn: Function = () => {};
  notifyValueChange(value: string) {
    this.changeFn(value);
    this.touchedFn(value);
  }
  setDisabledState(disabled: Boolean) {
    if (typeof disabled == 'boolean') {
      this.instance.updateOptions({ readOnly: disabled });
      this.disabled = disabled;
      this.cd.markForCheck();
    }
  }
  ngOnInit() {
    if (this.pattern == Pattern.w) {
      this.initWrite();
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.pattern) {
      const pattern = changes.pattern.currentValue || changes.pattern.previousValue;
      this.readMode = pattern == Pattern.w ? false : true;
    }
    if (changes.height) {
      this.height = coerceCssPixelValue(this.height == undefined ? changes.height.previousValue : this.height);
    }
  }
  /**
   * 格式化
   *
   * @author cyia
   * @date 2019-09-19
   */
  format(type: string, subType?: string) {
    switch (type) {
      case 'wrap':
        this.wrap(subType as WrapType);
        break;
      case 'start':
        this.formatStart(subType as StartType);
        break;
      case 'multiStart':
        this.formatMulti(subType);
        break;
      case 'divider':
        this.formatDivider();
      default:
        break;
    }
  }
  wrap(type: WrapType) {
    const wrapText = this.WRAP_GROUP[type];
    const selection = monaco.Selection.liftSelection(this.instance.getSelection());
    this.instance.executeEdits(`${this.editorBarPrefix}${type}`, [
      {
        range: new monaco.Range(selection.endLineNumber, selection.endColumn, selection.endLineNumber, selection.endColumn),
        text: wrapText,
      },
    ]);
    this.instance.executeEdits(`${this.editorBarPrefix}${type}`, [
      {
        range: new monaco.Range(selection.startLineNumber, selection.startColumn, selection.startLineNumber, selection.startColumn),
        text: wrapText,
      },
    ]);
    if (selection.startColumn == selection.endColumn && selection.endLineNumber == selection.startLineNumber) {
      this.instance.setSelection({
        startLineNumber: selection.startLineNumber,
        startColumn: selection.startColumn + wrapText.length,
        endLineNumber: selection.startLineNumber,
        endColumn: selection.startColumn + wrapText.length,
      });
    } else {
      this.instance.setSelection({
        startLineNumber: selection.endLineNumber,
        startColumn: selection.endColumn + wrapText.length * 2,
        endLineNumber: selection.endLineNumber,
        endColumn: selection.endColumn + wrapText.length * 2,
      });
    }
    this.instance.focus();
  }

  formatStart(type: StartType) {
    const wrapText = this.START_GROUP[type];
    const selection = monaco.Selection.liftSelection(this.instance.getSelection());
    this.instance.executeEdits(`${this.editorBarPrefix}${type}`, [
      { range: new monaco.Range(selection.endLineNumber, 1, selection.endLineNumber, 1), text: wrapText },
    ]);
    this.instance.setSelection({
      startLineNumber: selection.startLineNumber,
      startColumn: selection.startColumn + wrapText.length,
      endLineNumber: selection.endLineNumber,
      endColumn: selection.endColumn + wrapText.length,
    });
    this.instance.focus();
  }
  formatMulti(type) {
    const obj = this.MULTI_START[type];
    const selections = this.instance
      .getSelections()
      .map((selection) => monaco.Selection.liftSelection(selection))
      .sort((a, b) => a.startLineNumber - b.startLineNumber);
    const list: string[] = obj.repeat ? new Array(selections.length).fill(obj.value) : (obj.value as string[]);
    if (list.length < selections.length) {
      throw new Error('选中行过长,无法添加');
    }
    selections.forEach((selection, i) => {
      this.instance.executeEdits(`${this.editorBarPrefix}${type}`, [
        { range: new monaco.Range(selection.endLineNumber, 1, selection.endLineNumber, 1), text: list[i] },
      ]);
    });

    this.instance.setSelections(
      selections.map((item, i) =>
        monaco.Selection.createWithDirection(
          item.startLineNumber,
          item.startColumn + list[i].length,
          item.endLineNumber,
          item.endColumn + list[i].length,
          0
        )
      )
    );
    this.instance.focus();
  }
  formatDivider() {
    const selection = monaco.Selection.liftSelection(this.instance.getSelection());
    if (selection.startColumn !== 1) {
      this.instance.executeEdits(`${this.editorBarPrefix}divider`, [
        {
          range: new monaco.Range(selection.endLineNumber, selection.endColumn, selection.endLineNumber, selection.endColumn),
          text: '\n\n---  \n',
        },
      ]);
      this.instance.setSelection(monaco.Selection.createWithDirection(selection.startLineNumber + 3, 1, selection.endLineNumber + 3, 1, 0));
    } else {
      this.instance.executeEdits(`${this.editorBarPrefix}divider`, [
        { range: new monaco.Range(selection.endLineNumber, 1, selection.endLineNumber, 1), text: '\n---  \n' },
      ]);
      this.instance.setSelection(
        monaco.Selection.createWithDirection(
          selection.startLineNumber + 2,
          selection.startColumn,
          selection.endLineNumber + 2,
          selection.endColumn,
          0
        )
      );
    }

    this.instance.focus();
  }
  /**
   * 打开弹窗类的插入
   *
   * @author cyia
   * @date 2019-09-19

   */
  async open(type: string) {
    let res;
    switch (type) {
      case 'image':
        res = await this.matDialog.open(InsertImageComponent).afterClosed().pipe(take(1)).toPromise();
        break;
      case 'url':
        res = await this.matDialog.open(InsertUrlComponent).afterClosed().pipe(take(1)).toPromise();
        break;
      default:
        break;
    }
    res && this.insert(res);
  }
  insert(value: string) {
    const selection = monaco.Selection.liftSelection(this.instance.getSelection());
    this.instance.executeEdits(`${this.editorBarPrefix}image`, [
      {
        range: new monaco.Range(selection.startLineNumber, selection.startColumn, selection.endLineNumber, selection.endColumn),
        text: value,
      },
    ]);
    this.instance.setSelection({
      startLineNumber: selection.startLineNumber,
      startColumn: selection.startColumn,
      endLineNumber: selection.endLineNumber,
      endColumn: selection.endColumn + value.length,
    });
    this.instance.focus();
  }

  /**
   * 保存按钮
   *
   * @author cyia
   * @date 2019-09-19
   */
  save() {
    this.notifyValueChange(this.instance.getValue());
    this.snackBar.open('保存成功', undefined, { duration: 2000 });
  }
  // /**
  //  * 只读时初始化渲染
  //  *
  //  * @memberof CyiaMarkdownComponent
  //  */
  // initRead() {
  //   let mdres = md({
  //     html: true,

  //   })
  //   mdres.core.ruler.after('linkify', 'test', (s) => {
  //     s.tokens.forEach((token) => {
  //       if (this.mdClassMap[token.tag]) {
  //         token.attrJoin('class', this.mdClassMap[token.tag])
  //       }
  //     })
  //   })

  //   /**
  //    *   mdHtml.renderer.rules.paragraph_open = mdHtml.renderer.rules.heading_open = injectLineNumbers;
  //    */
  //   this.readValue = this.domSanitizer.bypassSecurityTrustHtml(
  //     mdres.render(this.tempValue)
  //   )
  //   this.cd.markForCheck()
  // }

  /**
   * 写入时初始化渲染
   *
   * @author cyia
   * @date 2019-09-19
   */
  async initWrite() {
    await this.ngZone.onStable.pipe(take(1)).toPromise();
    this.instance =
      this.instance ||
      monaco.editor.create(this.container.nativeElement, {
        language: 'markdown',
        minimap: { enabled: false },
        automaticLayout: true,
      });
  }
  /**
   * 切换读写
   *
   * @author cyia
   * @date 2019-09-19
   */
  async switchPattern() {
    this.pattern = this.pattern == Pattern.w ? Pattern.r : Pattern.w;
    // this.disabled = !this.disabled;
    this.tempValue = this.instance.getValue();
    if (this.pattern == Pattern.r) {
      // this.initRead()
    } else if (this.pattern == Pattern.w) {
      await this.initWrite();
    }
    this.cd.markForCheck();
  }

  /**
   * 自定义格式时调用
   *
   * @memberof CyiaMarkdownComponent
   */
  customFormat = (string: string, position: number) => {
    const wrapText = string;
    const selection = monaco.Selection.liftSelection(this.instance.getSelection());
    this.instance.executeEdits(`${this.editorBarPrefix}${'custom'}`, [
      {
        range: new monaco.Range(selection.startLineNumber, selection.startColumn, selection.endLineNumber, selection.endColumn),
        text: wrapText,
      },
    ]);
    this.instance.setSelection({
      startLineNumber: selection.startLineNumber,
      startColumn: selection.startColumn + position,
      endLineNumber: selection.startLineNumber,
      endColumn: selection.startColumn + position,
    });
    this.instance.focus();
  }
}
