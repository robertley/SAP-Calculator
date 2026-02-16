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

function shouldUseSillyRandom(callingPet?: Pet): callingPet is Pet {
  return Boolean(callingPet && hasSilly(callingPet));
}

function getAvailableLivingPets(player: PlayerLike, excludePets?: Pet[]): Pet[] {
  return [...player.petArray].filter(
    (pet) => pet.alive && (!excludePets || !excludePets.includes(pet)),
  );
}

function collectExtremePets(
  pets: Pet[],
  selector: (pet: Pet) => number,
  mode: 'max' | 'min',
  excludePet?: Pet,
): Pet[] {
  let selected: Pet[] = [];

  for (const pet of pets) {
    if (pet === excludePet || !pet.alive) {
      continue;
    }
    if (selected.length === 0) {
      selected = [pet];
      continue;
    }

    const current = selector(pet);
    const best = selector(selected[0]);
    if (current === best) {
      selected.push(pet);
      continue;
    }
    if (mode === 'max' ? current > best : current < best) {
      selected = [pet];
    }
  }

  return selected;
}

function selectSortedPetsWithTieRandom(
  availablePets: Pet[],
  count: number,
  compare: (a: Pet, b: Pet) => number,
  valueAt: (pet: Pet) => number,
): PetsRandomResult {
  if (availablePets.length === 0) {
    return { pets: [], random: false };
  }

  const shuffledPets = shuffle(availablePets);
  shuffledPets.sort(compare);
  const targets = shuffledPets.slice(0, count);

  let isRandom = false;
  if (targets.length === count && shuffledPets.length > count) {
    const lastSelectedValue = valueAt(targets[count - 1]);
    const nextPetValue = valueAt(shuffledPets[count]);
    if (lastSelectedValue === nextPetValue) {
      isRandom = true;
    }
  }

  return { pets: targets, random: isRandom };
}

export const getHighestHealthPet = (
  player: PlayerLike,
  excludePet?: Pet,
  callingPet?: Pet,
): PetRandomResult => {
  if (shouldUseSillyRandom(callingPet)) {
    return getRandomLivingPet(player, [callingPet], true);
  }

  const highestHealthPets = collectExtremePets(
    player.petArray,
    (pet) => pet.health,
    'max',
    excludePet,
  );

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
  if (shouldUseSillyRandom(callingPet)) {
    return getRandomLivingPet(player, [callingPet], true);
  }
  const highestAttackPets = collectExtremePets(
    player.petArray,
    (pet) => pet.attack,
    'max',
    excludePet,
  );
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
  if (shouldUseSillyRandom(callingPet)) {
    return getRandomLivingPets(player, count, true, [callingPet]);
  }

  return selectSortedPetsWithTieRandom(
    getAvailableLivingPets(player, excludePets),
    count,
    (a, b) => b.attack - a.attack,
    (pet) => pet.attack,
  );
};

export const getLowestAttackPets = (
  player: PlayerLike,
  count: number,
  excludePets?: Pet[],
  callingPet?: Pet,
): PetsRandomResult => {
  if (shouldUseSillyRandom(callingPet)) {
    return getRandomLivingPets(player, count, true, [callingPet]);
  }

  return selectSortedPetsWithTieRandom(
    getAvailableLivingPets(player, excludePets),
    count,
    (a, b) => a.attack - b.attack,
    (pet) => pet.attack,
  );
};

export const getLowestAttackPet = (
  player: PlayerLike,
  excludePet?: Pet,
  callingPet?: Pet,
): PetRandomResult => {
  if (shouldUseSillyRandom(callingPet)) {
    return getRandomLivingPet(player, [callingPet], true);
  }
  const lowestAttackPets = collectExtremePets(
    player.petArray,
    (pet) => pet.attack,
    'min',
    excludePet,
  );
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
  if (shouldUseSillyRandom(callingPet)) {
    return getRandomLivingPet(player, [callingPet], true);
  }
  const lowestHealthPets = collectExtremePets(
    player.petArray,
    (pet) => pet.health,
    'min',
    excludePet,
  );
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
  if (shouldUseSillyRandom(callingPet)) {
    return getRandomLivingPets(player, count, true, [callingPet]);
  }

  return selectSortedPetsWithTieRandom(
    getAvailableLivingPets(player, excludePets),
    count,
    (a, b) => a.health - b.health,
    (pet) => pet.health,
  );
};

export const getHighestHealthPets = (
  player: PlayerLike,
  count: number,
  excludePets?: Pet[],
  callingPet?: Pet,
): PetsRandomResult => {
  if (shouldUseSillyRandom(callingPet)) {
    return getRandomLivingPets(player, count, true, [callingPet]);
  }

  return selectSortedPetsWithTieRandom(
    getAvailableLivingPets(player, excludePets),
    count,
    (a, b) => b.health - a.health,
    (pet) => pet.health,
  );
};

export const getHighestTierPets = (
  player: PlayerLike,
  count: number,
  excludePets?: Pet[],
  callingPet?: Pet,
): PetsRandomResult => {
  if (shouldUseSillyRandom(callingPet)) {
    return getRandomLivingPets(player, count, true, [callingPet]);
  }

  return selectSortedPetsWithTieRandom(
    getAvailableLivingPets(player, excludePets),
    count,
    (a, b) => b.tier - a.tier,
    (pet) => pet.tier,
  );
};

export const getTierXOrLowerPet = (
  player: PlayerLike,
  tier: number,
  excludePets?: Pet[],
  callingPet?: Pet,
): PetRandomResult => {
  if (shouldUseSillyRandom(callingPet)) {
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
  if (shouldUseSillyRandom(callingPet)) {
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

