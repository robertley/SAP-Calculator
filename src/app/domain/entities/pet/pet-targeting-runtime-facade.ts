import { minExpForLevel } from 'app/runtime/experience';
import { getRandomInt } from 'app/runtime/random';
import type { Pet } from '../pet.class';
import { PetEquipmentFacade } from './pet-equipment-facade';

export abstract class PetTargetingRuntimeFacade extends PetEquipmentFacade {
  [key: string]: any;

  petBehind(seenDead = false, deadOrAlive = false): Pet {
    if (!this.parent) {
      return null;
    }
    let currentPosition =
      this.position !== undefined ? this.position : this.savedPosition;
    for (let i = currentPosition + 1; i < 5; i++) {
      let pet = this.parent.getPetAtPosition(i);
      if (deadOrAlive) {
        if (pet != null) {
          return pet;
        }
      }
      if (seenDead) {
        if (pet != null) {
          if (!pet.alive && !pet.seenDead) {
            return null;
          }
        }
      }
      if (pet != null && pet.alive) {
        return pet;
      }
    }
    return null;
  }

  getManticoreMult(): number[] {
    const parent = this.parent;
    if (!parent || !parent.petArray) {
      return [];
    }
    let mult: number[] = [];
    for (let pet of parent.petArray) {
      if (pet.name == 'Manticore') {
        mult.push(pet.level);
      }
    }
    return mult;
  }

  getSparrowLevel(): number {
    const parent = this.parent;
    if (!parent || !Array.isArray(parent.petArray)) {
      return 0;
    }
    let highestLevel = 0;
    for (let pet of parent.petArray) {
      if (pet.name == 'Sparrow') {
        highestLevel = Math.max(highestLevel, pet.level);
      }
    }
    return highestLevel;
  }

  getPetsBehind(amt: number, excludeEquipment?: string): Pet[] {
    const sillyTargets = this.getSillyRandomTargets(amt, excludeEquipment);
    if (sillyTargets.length > 0) {
      return sillyTargets;
    }

    let targetsBehind: Pet[] = [];
    let petBehind = this.petBehind();
    if (
      excludeEquipment &&
      petBehind &&
      petBehind.equipment?.name === excludeEquipment
    ) {
      petBehind = petBehind.petBehind();
    }
    while (petBehind) {
      if (targetsBehind.length >= amt) {
        break;
      }
      targetsBehind.push(petBehind);
      petBehind = petBehind.petBehind();
    }
    return targetsBehind;
  }

  kitsuneCheck(): boolean {
    let petBehind = this.petBehind();
    let first = true;
    while (petBehind) {
      if (petBehind.name == 'Kitsune' && first) {
        return false;
      }
      first = false;
      if (petBehind.name == 'Kitsune') {
        return true;
      }
      petBehind = petBehind.petBehind();
    }
    return false;
  }

  get petAhead(): Pet {
    const parent = this.parent;
    if (!parent) {
      return null;
    }
    const start =
      this.position !== undefined ? this.position : this.savedPosition;
    for (let i = start - 1; i > -1; i--) {
      let pet = parent.getPetAtPosition(i);
      if (pet != null && pet.alive) {
        return pet;
      }
    }
    return null;
  }

  get minExpForLevel(): number {
    return minExpForLevel(this.level);
  }

  private getSillyRandomTargets(amt: number, excludeEquipment?: string): Pet[] {
    if (!this.parent?.opponent) {
      return [];
    }
    const equipment = this.equipment as unknown;
    const sillyActive =
      (typeof equipment === 'string' && equipment === 'Silly') ||
      (equipment &&
        typeof (equipment as { name?: string }).name === 'string' &&
        (equipment as { name?: string }).name === 'Silly');
    if (!sillyActive) {
      return [];
    }

    const candidates = [...this.parent.petArray, ...this.parent.opponent.petArray].filter(
      (pet) => {
        if (!pet.alive || pet === this) {
          return false;
        }
        if (excludeEquipment && pet.equipment?.name === excludeEquipment) {
          return false;
        }
        return true;
      },
    );

    const targets: Pet[] = [];
    const pool = [...candidates];
    while (targets.length < amt && pool.length > 0) {
      const index = getRandomInt(0, pool.length - 1);
      targets.push(pool.splice(index, 1)[0]);
    }
    return targets;
  }
}
