// Mock Angular Decorators
export function Injectable() {
  return function (target: any) {};
}

export function Component(args: any) {
  return function (target: any) {};
}

export class Injector {}

// Mock Angular Forms
export class AbstractControl {
  value: any;
  constructor(value: any) {
    this.value = value;
  }
  get(path: string | (string | number)[]): AbstractControl | null {
    return null;
  }
}

export class FormControl extends AbstractControl {
  constructor(value: any) {
    super(value);
  }
}

export class FormGroup extends AbstractControl {
  controls: { [key: string]: AbstractControl };
  constructor(controls: { [key: string]: AbstractControl }) {
    super(controls);
    this.controls = controls;
  }
  override get(path: string): AbstractControl | null {
    return this.controls[path] || null;
  }
}

export class FormArray extends AbstractControl {
  controls: AbstractControl[];
  constructor(controls: AbstractControl[]) {
    super(controls);
    this.controls = controls;
  }
  override get(index: any): AbstractControl | null {
    if (typeof index === 'number') {
      return this.controls[index] || null;
    }
    return null;
  }
}

export class Validators {
  static required(control: AbstractControl) {
    return null;
  }
}

export type ValidationErrors = {
  [key: string]: any;
} | null;

export type ValidatorFn = (control: AbstractControl) => ValidationErrors | null;
