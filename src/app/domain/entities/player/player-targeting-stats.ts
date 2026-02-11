import { shuffle } from 'lodash-es';
import { Pet } from '../pet.class';
import { getRandomInt } from 'app/runtime/random';
import { hasSilly } from './player-utils';
import { getRandomLivingPet, getRandomLivingPets } from './player-targeting-random';
import type { PlayerLike } from './player-like.types';
import { PetRandomResult, PetsRandomResult } from './player-targeting.types';
import { chooseRandomOption } from 'app/runtime/random-decision-state';

function buildPetOption(pet: Pet) {
  const side = pet.parent?.isOpponent ? 'opponent' : 'player';
  const sideShort = pet.parent?.isOpponent ? 'O' : 'P';
  const position = Number.isFinite(pet.savedPosition) ? pet.savedPosition + 1 : 0;
  return {
    id: `${side}:${position}:${pet.name}`,
    label: `${sideShort}${position} ${pet.name}`,
  };
}

function describePetRef(pet: Pet | undefined): string {
  if (!pet) {
    return 'unknown caller';
  }
  const side = pet.parent?.isOpponent ? 'O' : 'P';
  const position = Number.isFinite(pet.savedPosition) ? pet.savedPosition + 1 : 0;
  return `${side}${position} ${pet.name}`;
}

function describePool(pets: Pet[]): string {
  const hasPlayer = pets.some((pet) => !pet.parent?.isOpponent);
  const hasOpponent = pets.some((pet) => pet.parent?.isOpponent);
  if (hasPlayer && hasOpponent) {
    return 'both teams';
  }
  if (hasOpponent) {
    return 'opponent team';
  }
  return 'player team';
}

function pickPet(
  key: string,
  label: string,
  pets: Pet[],
  callingPet?: Pet,
): PetRandomResult {
  if (pets.length === 0) {
    return { pet: null, random: false };
  }
  const decision = chooseRandomOption(
    {
      key,
      label: `${describePetRef(callingPet)} -> ${label} (${describePool(pets)}, ${pets.length} options)`,
      options: pets.map((pet) => buildPetOption(pet)),
    },
    () => getRandomInt(0, pets.length - 1),
  );
  return {
    pet: pets[decision.index] ?? null,
    random: decision.randomEvent,
  };
}

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

  return pickPet(
    'target.highest-health',
    'Highest health tie-break',
    highestHealthPets,
    callingPet,
  );
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
  return pickPet(
    'target.highest-attack',
    'Highest attack tie-break',
    highestAttackPets,
    callingPet,
  );
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
  return pickPet(
    'target.lowest-attack',
    'Lowest attack tie-break',
    lowestAttackPets,
    callingPet,
  );
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
  return pickPet(
    'target.lowest-health',
    'Lowest health tie-break',
    lowestHealthPets,
    callingPet,
  );
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

  return pickPet(
    'target.tier-x-or-lower',
    `Tier ${tier} or lower target`,
    availablePets,
    callingPet,
  );
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

  return pickPet(
    'target.strongest-pet',
    'Strongest pet tie-break',
    strongestPets,
    callingPet,
  );
};

