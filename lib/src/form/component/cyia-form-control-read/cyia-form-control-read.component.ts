import { Component, OnInit, ChangeDetectionStrategy, Input, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { CyiaFormControl } from '../../class/cyia-form.class';
import { ReadOnlyControlMode } from '../../enum/form-control.enum';
import { FormControlType } from '../../enum/control-type.enum';
import { CyiaOption } from '../../type/options.type';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'cyia-form-control-read',
  templateUrl: './cyia-form-control-read.component.html',
  styleUrls: ['./cyia-form-control-read.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CyiaFormControlReadComponent implements OnInit {
  @Input() cyiaFormControl: CyiaFormControl
  @Input() readValue
  readOnlyControlMode: ReadOnlyControlMode
  options: CyiaOption[]
  constructor(private cd: ChangeDetectorRef) { }

  ngOnInit() {
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.cyiaFormControl && this.cyiaFormControl) {
      this.cyiaFormControlInput(this.cyiaFormControl)
      this.changeSubscribe(this.cyiaFormControl)
      let preControl: CyiaFormControl
      if (preControl = changes.cyiaFormControl.previousValue) {
        preControl.change$.unsubscribe()
      }
    }
  }
  changeSubscribe(cyiaFormControl: CyiaFormControl) {
    cyiaFormControl.change$
      .pipe(filter((change) => !change.target))
      .subscribe((val) => {
        console.log('变更返回', val)
        switch (val.type) {
          case 'pattern':
            this.readValueChange(cyiaFormControl)
            break
          case 'value':
            this.readValueChange(cyiaFormControl)
            break
          case 'required':
            break
          case 'type':
            break
          case 'options':
            this.optionsChange(cyiaFormControl)
            break
          case 'disabled':
            break
          case 'validator':
            break
          default:
            break;
        }

        this.cd.markForCheck()
      })
  }
  /**
 * 每次类变更的操作
 *
 * @author cyia
 * @date 2019-09-07
 * @param cyiaFormControl
 */
  async cyiaFormControlInput(cyiaFormControl: CyiaFormControl) {
    await this.optionsChange(cyiaFormControl)
    // this.inputValueChange(cyiaFormControl)
    await this.readValueChange(cyiaFormControl)
    this.cd.markForCheck()
  }
  /**
   * 
   *
   * @author cyia
   * @date 2019-09-12
   * @param cyiaFormControl
   */
  readValueChange(cyiaFormControl: CyiaFormControl) {
    this.readValue = cyiaFormControl.inputPipe ? cyiaFormControl.inputPipe(cyiaFormControl, cyiaFormControl.value) : cyiaFormControl.value
    //doc 对只读时,一些代替项,显示label
    if ([FormControlType.checkbox, FormControlType.select, FormControlType.radio, FormControlType.slideToggle].includes(cyiaFormControl.type)) {
      const option = this.options.find((option) => option.value == this.readValue);
      if (option) {
        this.readValue = option.label
      }
    }
  }
  async optionsChange(cyiaFormControl: CyiaFormControl) {
    this.options = []
    this.options = (await cyiaFormControl.options(cyiaFormControl));
  }
}
