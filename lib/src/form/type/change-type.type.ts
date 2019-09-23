import { _CyiaFormControl } from '../class/cyia-form.class';

export interface CyiaFormControlChange {
    type: Exclude<keyof _CyiaFormControl, 'key'>
    value: any
    target?: string[]
}