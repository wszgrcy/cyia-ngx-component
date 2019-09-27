import { Subject } from 'rxjs';
import { CyiaFormControlChange } from '../../type/change-type.type';

/**
 * 手动构造
 *
 * @export
 * @class CyiaFormGroupService
 */
export class CyiaFormGroupService {
  event$ = new Subject<CyiaFormControlChange[]>()
  constructor() {
  }

}
