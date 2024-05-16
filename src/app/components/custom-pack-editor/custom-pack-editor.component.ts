import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { PetService } from '../../services/pet.service';
import { remove } from 'lodash';
import { LocalStorageService } from '../../services/local-storage.service';
import * as petJson from '../../files/pets.json';

@Component({
  selector: 'app-custom-pack-editor',
  templateUrl: './custom-pack-editor.component.html',
  styleUrls: ['./custom-pack-editor.component.scss']
})
export class CustomPackEditorComponent implements OnInit {

  @Input()
  formGroup: FormGroup;
  customPacks: FormArray;
  // Map<tier, Map<pack, pets>>
  petPackMap: Map<number, Map<string, string[]>>;
  focusedGroup: FormGroup = null;

  importFormGroup = new FormGroup({
    code: new FormControl(null)
  });

  constructor(private petService: PetService, private localStorageService: LocalStorageService) {
    this.buildPetPackMap();

  }

  ngOnInit(): void {
    this.customPacks = this.formGroup.get('customPacks') as FormArray;
  }

  buildPetPackMap() {
    this.petPackMap = new Map<number, Map<string, string[]>>();
    for (let i = 1; i <= 6; i++) {
      let packMap = new Map<string, string[]>();
      packMap.set('Turtle', []);
      packMap.set('Puppy', []);
      packMap.set('Star', []);
      packMap.set('Golden', []);
      packMap.set('Unicorn', []);
      packMap.set('Custom', []);
      this.petPackMap.set(i, packMap);
    }
    for (let [tier, pets] of this.petService.turtlePackPets) {
      this.petPackMap.get(tier).get('Turtle').push(...pets);
    }
    for (let [tier, pets] of this.petService.puppyPackPets) {
      this.petPackMap.get(tier).get('Puppy').push(...pets);
    }
    for (let [tier, pets] of this.petService.starPackPets) {
      this.petPackMap.get(tier).get('Star').push(...pets);
    }
    for (let [tier, pets] of this.petService.goldenPackPets) {
      this.petPackMap.get(tier).get('Golden').push(...pets);
    }
    for (let [tier, pets] of this.petService.unicornPackPets) {
      this.petPackMap.get(tier).get('Unicorn').push(...pets);
    }
    for (let [tier, pets] of this.petService.customPackPets) {
      this.petPackMap.get(tier).get('Custom').push(...pets);
    }
  }

  createNewPack() {
    let group = this.createPack();
    this.focusedGroup = group;
  }

  createPack() {
    let formGroup = new FormGroup({
      name: new FormControl(null, [Validators.required, this.forbiddenNameValidator()]),
      tier1Pets: new FormControl([], this.controlArrayLengthOf10()),
      // tier1Food: new FormControl([]),
      tier2Pets: new FormControl([], this.controlArrayLengthOf10()),
      // tier2Food: new FormControl([]),
      tier3Pets: new FormControl([], this.controlArrayLengthOf10()),
      // tier3Food: new FormControl([]),
      tier4Pets: new FormControl([], this.controlArrayLengthOf10()),
      // tier4Food: new FormControl([]),
      tier5Pets: new FormControl([], this.controlArrayLengthOf10()),
      // tier5Food: new FormControl([]),
      tier6Pets: new FormControl([], this.controlArrayLengthOf10()),
      // tier6Food: new FormControl([]),
    });

    return formGroup;
  }

  makeFormGroup(control: AbstractControl) {
    return control as FormGroup;
  }

  // custom angular validator
  controlArrayLengthOf10(): ValidatorFn {
    return (control:AbstractControl) : ValidationErrors | null => {
      if (control.value.length !== 10) {
        return {length: true};
      }
      return null;
    }
  }

  submitEvent(event) {
    if (this.customPacks.controls.includes(event)) {
      // update
    } else {
      this.customPacks.push(event);
    }
    this.petService.buildCustomPackPets(this.customPacks);
    this.focusedGroup = null;
    this.localStorageService.setStorage(this.formGroup.value);
  }

  cancelEvent(event: FormGroup) {
    this.focusedGroup = null;
  }

  editPack(group: AbstractControl) {
    this.focusedGroup = group as FormGroup;
  }

  deletePack(group: AbstractControl) {
    if (confirm('Are you sure you want to delete this pack?')) {
      let index = this.customPacks.controls.indexOf(group);
      this.customPacks.removeAt(index);
      this.localStorageService.setStorage(this.formGroup.value);
    }
  }


  forbiddenNameValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      let forbiddenNames = ['custom'];
      for (let formGroup of this.customPacks.controls) {
        let con = formGroup.get('name');
        if (control == con) {
          continue;
        }
        forbiddenNames.push(formGroup.get('name').value?.toLowerCase());
      }
      if (forbiddenNames.includes(control.value?.toLowerCase())) {
        return { forbiddenName: true };
      }
      return null;
    }
  }

  importCustomPack() {

    let code = this.importFormGroup.get('code').value;
    try {
      code = JSON.parse(code);
      let formValue = {
        name: code.Title,
        tier1Pets: this.getMinions(code.Minions, 1),
        tier2Pets: this.getMinions(code.Minions, 2),
        tier3Pets: this.getMinions(code.Minions, 3),
        tier4Pets: this.getMinions(code.Minions, 4),
        tier5Pets: this.getMinions(code.Minions, 5),
        tier6Pets: this.getMinions(code.Minions, 6),
      }
      this.createNewPack();
      this.focusedGroup.patchValue(formValue);
    } catch (e) {
      alert('Invalid code');
      console.error(e);
    }
  }

  getMinions(minions: number[], tier: number) {

    let pets = petJson[`tier${tier}`];
    let tierMinions = [];
    for (let minion of minions) {
      for (let pet of pets) {
        if (pet.id == minion) {
          tierMinions.push(pet.name);
        }
      } 
    }

    return tierMinions;
  }
}
