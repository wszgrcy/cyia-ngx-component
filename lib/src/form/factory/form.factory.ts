import { CyiaFormGroup, _CyiaFormControl, _CyiaFormGroup, CyiaFormControl } from '../class/cyia-form.class';

export class CyiaFormFactory {
    static group(config: _CyiaFormGroup, ...controls: (CyiaFormControl | CyiaFormGroup)[]) {
        let formGroup = new CyiaFormGroup(config)
        formGroup.controls.push(...controls)
        return formGroup
    }
}