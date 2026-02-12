import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { CustomPackConfig } from 'app/domain/interfaces/simulation-config.interface';

export function createPack(customPack?: Partial<CustomPackConfig> | null): FormGroup {
  return new FormGroup({
    name: new FormControl(customPack?.name ?? null, Validators.required),
    tier1Pets: new FormControl(customPack?.tier1Pets ?? [], controlArrayLengthOf10()),
    tier2Pets: new FormControl(customPack?.tier2Pets ?? [], controlArrayLengthOf10()),
    tier3Pets: new FormControl(customPack?.tier3Pets ?? [], controlArrayLengthOf10()),
    tier4Pets: new FormControl(customPack?.tier4Pets ?? [], controlArrayLengthOf10()),
    tier5Pets: new FormControl(customPack?.tier5Pets ?? [], controlArrayLengthOf10()),
    tier6Pets: new FormControl(customPack?.tier6Pets ?? [], controlArrayLengthOf10()),
    spells: new FormControl(customPack?.spells ?? []),
  });
}

function controlArrayLengthOf10(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }
    if (control.value.length !== 10) {
      return { length: true };
    }
    return null;
  };
}
