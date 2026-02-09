import { Directive } from '@angular/core';
import { PetSelectorSwallowingAbomination } from './pet-selector-swallowing-abomination';

@Directive()
export class PetSelectorSwallowing extends PetSelectorSwallowingAbomination {
  setBelugaSwallow(value: string) {
    let pet = this.player.getPet(this.index);
    if (pet == null) {
      return;
    }
    pet.belugaSwallowedPet = value;
  }

  setParrotCopyPet(value: string) {
    let pet = this.player.getPet(this.index);
    if (pet == null) {
      return;
    }
    pet.parrotCopyPet = value;
    if (value !== 'Beluga Whale') {
      pet.parrotCopyPetBelugaSwallowedPet = null;
      this.formGroup
        .get('parrotCopyPetBelugaSwallowedPet')
        ?.setValue(null, { emitEvent: false });
    }
    if (value !== 'Abomination') {
      this.clearParrotCopyPetAbominationSettings(pet);
    }
  }

  setParrotCopyPetBelugaSwallowedPet(value: string) {
    let pet = this.player.getPet(this.index);
    if (pet == null) {
      return;
    }
    pet.parrotCopyPetBelugaSwallowedPet = value;
  }

  getParrotCopyAbominationSlotCount(): number {
    const exp = Number(this.formGroup.get('exp')?.value ?? 0);
    if (exp < 2) {
      return 1;
    }
    if (exp < 5) {
      return 2;
    }
    return 3;
  }

  getAbominationSwallowedSlotCount(): number {
    const exp = Number(this.formGroup.get('exp')?.value ?? 0);
    if (exp < 2) {
      return 1;
    }
    if (exp < 5) {
      return 2;
    }
    return 3;
  }
}
