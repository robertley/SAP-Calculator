import { Pet } from '../pet.class';
import type { PetLike, PlayerLike } from './player-like.types';


export const hasSilly = (pet: PetLike): boolean => {
  const equipment = pet.equipment as unknown;
  if (typeof equipment === 'string') {
    return equipment === 'Silly';
  }
  if (equipment && typeof (equipment as { name?: string }).name === 'string') {
    return (equipment as { name?: string }).name === 'Silly';
  }
  return false;
};

export const getPetsWithEquipment = (
  player: PlayerLike,
  equipmentName: string,
): Pet[] => {
  const pets: Pet[] = [];
  for (const pet of player.petArray) {
    if (!pet.alive) {
      continue;
    }
    if (equipmentName === 'perk') {
      if (
        pet.equipment &&
        !pet.equipment.equipmentClass?.startsWith('ailment')
      ) {
        pets.push(pet);
      }
    } else if (pet.equipment?.name === equipmentName) {
      pets.push(pet);
    }
  }
  return pets;
};

export const getPetsWithoutEquipment = (
  player: PlayerLike,
  equipmentName: string,
): Pet[] => {
  const pets: Pet[] = [];
  for (const pet of player.petArray) {
    if (!pet.alive) {
      continue;
    }
    if (equipmentName === 'Perk') {
      if (!pet.equipment || pet.equipment.name.startsWith('ailment')) {
        pets.push(pet);
      }
    } else {
      if (!pet.equipment || pet.equipment.name !== equipmentName) {
        pets.push(pet);
      }
    }
  }
  return pets;
};

export const getPetAtPosition = (
  player: PlayerLike,
  position: number,
): Pet | null => {
  for (const pet of player.petArray) {
    if (pet.position === position) {
      return pet;
    }
  }
  return null;
};

export const getManticoreMult = (player: PlayerLike): number[] => {
  const mult: number[] = [];
  for (const pet of player.petArray) {
    if (pet.hasTrigger(undefined, 'Pet', 'ManticoreAbility')) {
      for (const ability of pet.abilityList) {
        if (ability.name === 'ManticoreAbility') {
          mult.push(ability.level);
        }
      }
    }
  }

  return mult;
};

