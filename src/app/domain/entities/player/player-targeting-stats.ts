import { shuffle } from 'lodash-es';
import { Pet } from '../pet.class';
import { getRandomInt } from 'app/runtime/random';
import { hasSilly } from './player-utils';
import { getRandomLivingPet, getRandomLivingPets } from './player-targeting-random';
import type { PlayerLike } from './player-like.types';
import { PetRandomResult, PetsRandomResult } from './player-targeting.types';

export const getHighestHealthPet = (
  player: PlayerLike,
  excludePet?: Pet,
  callingPet?: Pet,
): PetRandomResult => {
  if (callingPet && hasSilly(callingPet)) {
    return getRandomLivingPet(player, [callingPet], true);
  }

  const pets = player.petArray;
  let highestHealthPets: Pet[] = [];

  for (const pet of pets) {
    if (pet === excludePet || !pet.alive) {
      continue;
    }
    if (highestHealthPets.length === 0) {
      highestHealthPets = [pet];
      continue;
    }
    if (pet.health === highestHealthPets[0].health) {
      highestHealthPets.push(pet);
      continue;
    }
    if (pet.health > highestHealthPets[0].health) {
      highestHealthPets = [pet];
    }
  }

  if (highestHealthPets.length === 0) {
    return { pet: null, random: false };
  }

  return {
    pet: highestHealthPets[getRandomInt(0, highestHealthPets.length - 1)],
    random: highestHealthPets.length > 1,
  };
};

export const getHighestAttackPet = (
  player: PlayerLike,
  excludePet?: Pet,
  callingPet?: Pet,
): PetRandomResult => {
  if (callingPet && hasSilly(callingPet)) {
    return getRandomLivingPet(player, [callingPet], true);
  }

  const pets = player.petArray;
  let highestAttackPets: Pet[] = [];

  for (const pet of pets) {
    if (pet === excludePet || !pet.alive) {
      continue;
    }
    if (highestAttackPets.length === 0) {
      highestAttackPets = [pet];
      continue;
    }
    if (pet.attack === highestAttackPets[0].attack) {
      highestAttackPets.push(pet);
      continue;
    }
    if (pet.attack > highestAttackPets[0].attack) {
      highestAttackPets = [pet];
    }
  }
  const pet =
    highestAttackPets.length === 0
      ? null
      : highestAttackPets[getRandomInt(0, highestAttackPets.length - 1)];

  return {
    pet,
    random: pet == null ? false : highestAttackPets.length > 1,
  };
};

export const getHighestAttackPets = (
  player: PlayerLike,
  count: number,
  excludePets?: Pet[],
  callingPet?: Pet,
): PetsRandomResult => {
  if (callingPet && hasSilly(callingPet)) {
    return getRandomLivingPets(player, count, true, [callingPet]);
  }

  const availablePets = [...player.petArray].filter(
    (pet) => pet.alive && (!excludePets || !excludePets.includes(pet)),
  );

  if (availablePets.length === 0) {
    return { pets: [], random: false };
  }

  const shuffledPets = shuffle(availablePets);
  shuffledPets.sort((a, b) => b.attack - a.attack);
  const targets = shuffledPets.slice(0, count);
  let isRandom = false;
  if (targets.length === count && shuffledPets.length > count) {
    const lastSelectedAttack = targets[count - 1].attack;
    const nextPetAttack = shuffledPets[count].attack;
    if (lastSelectedAttack === nextPetAttack) {
      isRandom = true;
    }
  }
  return { pets: targets, random: isRandom };
};

export const getLowestAttackPets = (
  player: PlayerLike,
  count: number,
  excludePets?: Pet[],
  callingPet?: Pet,
): PetsRandomResult => {
  if (callingPet && hasSilly(callingPet)) {
    return getRandomLivingPets(player, count, true, [callingPet]);
  }

  const availablePets = [...player.petArray].filter(
    (pet) => pet.alive && (!excludePets || !excludePets.includes(pet)),
  );

  if (availablePets.length === 0) {
    return { pets: [], random: false };
  }

  const shuffledPets = shuffle(availablePets);
  shuffledPets.sort((a, b) => a.attack - b.attack);
  const targets = shuffledPets.slice(0, count);
  let isRandom = false;
  if (targets.length === count && shuffledPets.length > count) {
    const lastSelectedAttack = targets[count - 1].attack;
    const nextPetAttack = shuffledPets[count].attack;
    if (lastSelectedAttack === nextPetAttack) {
      isRandom = true;
    }
  }
  return { pets: targets, random: isRandom };
};

export const getLowestAttackPet = (
  player: PlayerLike,
  excludePet?: Pet,
  callingPet?: Pet,
): PetRandomResult => {
  if (callingPet && hasSilly(callingPet)) {
    return getRandomLivingPet(player, [callingPet], true);
  }

  const pets = player.petArray;
  let lowestAttackPets: Pet[] = [];

  for (const pet of pets) {
    if (pet === excludePet || !pet.alive) {
      continue;
    }
    if (lowestAttackPets.length === 0) {
      lowestAttackPets = [pet];
      continue;
    }
    if (pet.attack === lowestAttackPets[0].attack) {
      lowestAttackPets.push(pet);
      continue;
    }
    if (pet.attack < lowestAttackPets[0].attack) {
      lowestAttackPets = [pet];
    }
  }
  const pet =
    lowestAttackPets.length === 0
      ? null
      : lowestAttackPets[getRandomInt(0, lowestAttackPets.length - 1)];

  return {
    pet,
    random: pet == null ? false : lowestAttackPets.length > 1,
  };
};

export const getLowestHealthPet = (
  player: PlayerLike,
  excludePet?: Pet,
  callingPet?: Pet,
): PetRandomResult => {
  if (callingPet && hasSilly(callingPet)) {
    return getRandomLivingPet(player, [callingPet], true);
  }

  const pets = player.petArray;
  let lowestHealthPets: Pet[] = [];

  for (const pet of pets) {
    if (pet === excludePet || !pet.alive) {
      continue;
    }
    if (lowestHealthPets.length === 0) {
      lowestHealthPets = [pet];
      continue;
    }
    if (pet.health === lowestHealthPets[0].health) {
      lowestHealthPets.push(pet);
      continue;
    }
    if (pet.health < lowestHealthPets[0].health) {
      lowestHealthPets = [pet];
    }
  }
  const pet =
    lowestHealthPets.length === 0
      ? null
      : lowestHealthPets[getRandomInt(0, lowestHealthPets.length - 1)];

  return {
    pet,
    random: pet == null ? false : lowestHealthPets.length > 1,
  };
};

export const getLowestHealthPets = (
  player: PlayerLike,
  count: number,
  excludePets?: Pet[],
  callingPet?: Pet,
): PetsRandomResult => {
  if (callingPet && hasSilly(callingPet)) {
    return getRandomLivingPets(player, count, true, [callingPet]);
  }

  const availablePets = [...player.petArray].filter(
    (pet) => pet.alive && (!excludePets || !excludePets.includes(pet)),
  );

  if (availablePets.length === 0) {
    return { pets: [], random: false };
  }

  const shuffledPets = shuffle(availablePets);
  shuffledPets.sort((a, b) => a.health - b.health);

  const targets = shuffledPets.slice(0, count);

  let isRandom = false;
  if (targets.length === count && shuffledPets.length > count) {
    const lastSelectedHealth = targets[count - 1].health;
    const nextPetHealth = shuffledPets[count].health;
    if (lastSelectedHealth === nextPetHealth) {
      isRandom = true;
    }
  }

  return { pets: targets, random: isRandom };
};

export const getHighestHealthPets = (
  player: PlayerLike,
  count: number,
  excludePets?: Pet[],
  callingPet?: Pet,
): PetsRandomResult => {
  if (callingPet && hasSilly(callingPet)) {
    return getRandomLivingPets(player, count, true, [callingPet]);
  }

  const availablePets = [...player.petArray].filter(
    (pet) => pet.alive && (!excludePets || !excludePets.includes(pet)),
  );

  if (availablePets.length === 0) {
    return { pets: [], random: false };
  }

  const shuffledPets = shuffle(availablePets);
  shuffledPets.sort((a, b) => b.health - a.health);

  const targets = shuffledPets.slice(0, count);

  let isRandom = false;
  if (targets.length === count && shuffledPets.length > count) {
    const lastSelectedHealth = targets[count - 1].health;
    const nextPetHealth = shuffledPets[count].health;
    if (lastSelectedHealth === nextPetHealth) {
      isRandom = true;
    }
  }

  return { pets: targets, random: isRandom };
};

export const getHighestTierPets = (
  player: PlayerLike,
  count: number,
  excludePets?: Pet[],
  callingPet?: Pet,
): PetsRandomResult => {
  if (callingPet && hasSilly(callingPet)) {
    return getRandomLivingPets(player, count, true, [callingPet]);
  }

  const availablePets = [...player.petArray].filter(
    (pet) => pet.alive && (!excludePets || !excludePets.includes(pet)),
  );

  if (availablePets.length === 0) {
    return { pets: [], random: false };
  }

  const shuffledPets = shuffle(availablePets);
  shuffledPets.sort((a, b) => b.tier - a.tier);

  const targets = shuffledPets.slice(0, count);

  let isRandom = false;
  if (targets.length === count && shuffledPets.length > count) {
    const lastSelectedTier = targets[count - 1].tier;
    const nextPetTier = shuffledPets[count].tier;
    if (lastSelectedTier === nextPetTier) {
      isRandom = true;
    }
  }

  return { pets: targets, random: isRandom };
};

export const getTierXOrLowerPet = (
  player: PlayerLike,
  tier: number,
  excludePets?: Pet[],
  callingPet?: Pet,
): PetRandomResult => {
  if (callingPet && hasSilly(callingPet)) {
    return getRandomLivingPet(player, [callingPet], true);
  }

  const availablePets = [...player.petArray].filter(
    (pet) =>
      pet.alive &&
      pet.tier <= tier &&
      (!excludePets || !excludePets.includes(pet)),
  );

  if (availablePets.length === 0) {
    return { pet: null, random: false };
  }

  const index = getRandomInt(0, availablePets.length - 1);
  return { pet: availablePets[index], random: availablePets.length > 1 };
};

export const getStrongestPet = (
  player: PlayerLike,
  callingPet?: Pet,
): PetRandomResult => {
  if (callingPet && hasSilly(callingPet)) {
    return getRandomLivingPet(player, [callingPet], true);
  }

  let strongestPets: Pet[] = [];
  let maxStrength = -1;
  const pets = shuffle(player.petArray.filter((p) => p.alive));

  for (const pet of pets) {
    const strength = pet.attack + pet.health;
    if (strength > maxStrength) {
      maxStrength = strength;
      strongestPets = [pet];
    } else if (strength === maxStrength) {
      strongestPets.push(pet);
    }
  }

  if (strongestPets.length === 0) {
    return { pet: null, random: false };
  }

  const selectedPet = strongestPets[getRandomInt(0, strongestPets.length - 1)];
  return {
    pet: selectedPet,
    random: strongestPets.length > 1,
  };
};

