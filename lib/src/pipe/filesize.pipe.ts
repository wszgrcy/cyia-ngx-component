import { Pipe, PipeTransform } from '@angular/core';

// enum unitList {
//   b, kb, mb, gb, tb,
// }
const unitList = {
  b: 0,
  kb: 1,
  mb: 2,
  gb: 3,
  tb: 4,
}
@Pipe({
  name: 'filesize',
  pure: true
})
export class FilesizePipe implements PipeTransform {
  transform(value: any, unit?: string, unitLabel?: string): any {
    let unitIndex = unitList[unit.toLocaleLowerCase()] || 0;
    let size = value;
    for (let i = 0; i < 4; i++) {
      if (unitIndex > i) {
        size = size / 1024;
      }
    }
    if (size * 100 >= 1)
      size = Math.round(size * 100) / 100;
    return `${size}${unitLabel || unit || 'b'}`;
  }

}
