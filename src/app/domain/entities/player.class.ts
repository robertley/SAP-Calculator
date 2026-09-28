import { Pet } from './pet.class';
import { Toy } from './toy.class';

/** Mutable board-editor state. Battles operate on serialized configs in sap-battle-engine. */
export class Player {
  opponent?: Player;
  pet0?: Pet; pet1?: Pet; pet2?: Pet; pet3?: Pet; pet4?: Pet;
  pack: string = 'Turtle';
  toy: Toy | null = null;
  hardToy: Toy | null = null;
  originalToy: Toy | null = null;
  isOpponent = false;
  allPets = false;
  tokenPets = false;
  getPet(index: number): Pet | null {
    return [this.pet0, this.pet1, this.pet2, this.pet3, this.pet4][index] ?? null;
  }
  setPet(index: number, pet: Pet | null, _init = false): void {
    switch (index) {
      case 0: this.pet0 = pet; break;
      case 1: this.pet1 = pet; break;
      case 2: this.pet2 = pet; break;
      case 3: this.pet3 = pet; break;
      case 4: this.pet4 = pet; break;
      default: return;
    }
    if (pet) { pet.parent = this; pet.savedPosition = index; }
  }
  get petArray(): Pet[] {
    return [this.pet0, this.pet1, this.pet2, this.pet3, this.pet4].filter((pet): pet is Pet => pet != null);
  }
}
