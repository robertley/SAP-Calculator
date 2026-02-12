import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { remove } from 'lodash-es';
import { getPetIconPath } from 'app/runtime/asset-catalog';

@Component({
  selector: 'app-custom-pack-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './custom-pack-form.component.html',
  styleUrls: ['./custom-pack-form.component.scss'],
})
export class CustomPackFormComponent implements OnInit {
  @Input()
  formGroup: FormGroup;

  @Input()
  petPackMap: Map<number, Map<string, string[]>>;

  @Output()
  submitEvent: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();

  @Output()
  cancelEvent: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();

  checkboxFormGroup: FormGroup;
  loaded = false;
  private readonly fallbackIcon = 'assets/art/Public/Public/Icons/Level_L1.png';
  constructor() {}

  ngOnInit(): void {
    this.initCheckboxFormGroup();
    this.formGroup.updateValueAndValidity();
  }

  initCheckboxFormGroup() {
    let tier1Pets: FormGroup = new FormGroup({});
    let tier2Pets: FormGroup = new FormGroup({});
    let tier3Pets: FormGroup = new FormGroup({});
    let tier4Pets: FormGroup = new FormGroup({});
    let tier5Pets: FormGroup = new FormGroup({});
    let tier6Pets: FormGroup = new FormGroup({});
    for (let pet of this.getPets(1)) {
      let control = new FormControl(
        this.formGroup.get(`tier1Pets`).value.includes(pet),
      );
      control.valueChanges.subscribe((value) => {
        this.processCheckboxChange(1, pet, value);
      });
      tier1Pets.addControl(pet, control);
    }
    for (let pet of this.getPets(2)) {
      let control = new FormControl(
        this.formGroup.get(`tier2Pets`).value.includes(pet),
      );
      control.valueChanges.subscribe((value) => {
        this.processCheckboxChange(2, pet, value);
      });
      tier2Pets.addControl(pet, control);
    }
    for (let pet of this.getPets(3)) {
      let control = new FormControl(
        this.formGroup.get(`tier3Pets`).value.includes(pet),
      );
      control.valueChanges.subscribe((value) => {
        this.processCheckboxChange(3, pet, value);
      });
      tier3Pets.addControl(pet, control);
    }
    for (let pet of this.getPets(4)) {
      let control = new FormControl(
        this.formGroup.get(`tier4Pets`).value.includes(pet),
      );
      control.valueChanges.subscribe((value) => {
        this.processCheckboxChange(4, pet, value);
      });
      tier4Pets.addControl(pet, control);
    }
    for (let pet of this.getPets(5)) {
      let control = new FormControl(
        this.formGroup.get(`tier5Pets`).value.includes(pet),
      );
      control.valueChanges.subscribe((value) => {
        this.processCheckboxChange(5, pet, value);
      });
      tier5Pets.addControl(pet, control);
    }
    for (let pet of this.getPets(6)) {
      let control = new FormControl(
        this.formGroup.get(`tier6Pets`).value.includes(pet),
      );
      control.valueChanges.subscribe((value) => {
        this.processCheckboxChange(6, pet, value);
      });
      tier6Pets.addControl(pet, control);
    }
    this.checkboxFormGroup = new FormGroup({
      tier1Pets: tier1Pets,
      tier2Pets: tier2Pets,
      tier3Pets: tier3Pets,
      tier4Pets: tier4Pets,
      tier5Pets: tier5Pets,
      tier6Pets: tier6Pets,
    });
  }

  getCheckboxFormGroup(tier: number) {
    return this.checkboxFormGroup.get(`tier${tier}Pets`) as FormGroup;
  }

  getPets(tier: number) {
    let pets = [];
    for (let [pack, petList] of this.petPackMap.get(tier)) {
      pets.push(...petList);
    }
    // remove duplicates
    pets = [...new Set(pets)];
    return pets;
  }

  getCount(tier: number) {
    return this.formGroup.get(`tier${tier}Pets`).value.length;
  }

  processCheckboxChange(tier: number, pet: string, checked: boolean) {
    let formControlValue = this.formGroup.get(`tier${tier}Pets`).value;
    if (checked) {
      formControlValue.push(pet);
    } else {
      remove(formControlValue, (value) => value === pet);
    }
    this.formGroup.get(`tier${tier}Pets`).updateValueAndValidity();
  }

  getPetIcon(pet: string): string {
    return getPetIconPath(pet) ?? this.fallbackIcon;
  }

  handlePetIconError(event: Event) {
    const target = event.target as HTMLImageElement;
    if (target?.dataset?.fallback) {
      return;
    }
    target.dataset.fallback = 'true';
    target.src = this.fallbackIcon;
  }

  trackByPetName(index: number, pet: string): string {
    return pet ?? String(index);
  }

  submit() {
    this.submitEvent.emit(this.formGroup);
  }

  cancel() {
    if (confirm('Are you sure you want to cancel?')) {
      this.cancelEvent.emit(this.formGroup);
    }
  }

  submitDisabled() {
    return this.formGroup.get('name').invalid;
  }
}



