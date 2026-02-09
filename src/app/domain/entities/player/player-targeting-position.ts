import { Pet } from '../pet.class';
import { getPetAtPosition, hasSilly } from './player-utils';
import { getRandomLivingPet, getRandomLivingPets } from './player-targeting-random';
import type { PlayerLike } from './player-like.types';
import { PetRandomResult, PetsRandomResult } from './player-targeting.types';

export const getAll = (
  player: PlayerLike,
  includeOpponent: boolean,
  callingPet?: Pet,
  excludeSelf?: boolean,
): PetsRandomResult => {
  if (callingPet && hasSilly(callingPet)) {
    const allLivingPets = [...player.petArray, ...player.opponent.petArray].filter(
      (pet) => pet.alive,
    );
    return { pets: allLivingPets, random: false };
  }

  let pets: Pet[] = includeOpponent
    ? [...player.petArray, ...player.opponent.petArray]
    : [...player.petArray];
  if (excludeSelf) {
    pets = pets.filter((pet) => pet !== callingPet);
  }

  pets = pets.filter((pet) => pet.alive);
  return { pets, random: false };
};

export const getMiddleFriend = (
  player: PlayerLike,
  callingPet?: Pet,
): PetRandomResult => {
  if (callingPet && hasSilly(callingPet)) {
    return getRandomLivingPet(player, [callingPet], true);
  }
  const pet = player.getPet(2);
  if (pet && !pet.alive) {
    return { pet: null, random: false };
  }
  return { pet: pet ?? null, random: false };
};

export const getLastPet = (
  player: PlayerLike,
  excludePets?: Pet[],
  callingPet?: Pet,
): PetRandomResult => {
  if (callingPet && hasSilly(callingPet)) {
    return getRandomLivingPet(player, [callingPet], true);
  }

  for (const pet of [...player.petArray].reverse()) {
    if (pet.alive && (!excludePets || !excludePets.includes(pet))) {
      return { pet, random: false };
    }
  }
  return { pet: null, random: false };
};

export const getLastPets = (
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

  const reversedPets = [...availablePets].reverse();
  const targets = reversedPets.slice(0, count);

  return { pets: targets, random: false };
};

export const getFurthestUpPet = (
  player: PlayerLike,
  callingPet?: Pet,
  excludePets?: Pet[],
): PetRandomResult => {
  if (callingPet && hasSilly(callingPet)) {
    return getRandomLivingPet(player, [callingPet], true);
  }

  for (const pet of player.petArray) {
    if (pet.alive) {
      if (excludePets && excludePets.includes(pet)) {
        continue;
      }
      return { pet, random: false };
    }
  }
  return { pet: null, random: false };
};

export const getFurthestUpPets = (
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

  const targets = availablePets.slice(0, count);
  return { pets: targets, random: false };
};

export const nearestPetsBehind = (
  player: PlayerLike,
  amt: number,
  callingPet: Pet,
  excludePets?: Pet[],
): PetsRandomResult => {
  if (callingPet && hasSilly(callingPet)) {
    const localExclude = excludePets ? [...excludePets] : [];
    if (!localExclude.includes(callingPet)) {
      localExclude.push(callingPet);
    }
    return getRandomLivingPets(player, amt, true, localExclude);
  }

  const allPetsBehind = callingPet.getPetsBehind(amt * 2);
  const filteredPets = allPetsBehind.filter(
    (pet) => !excludePets || !excludePets.includes(pet),
  );
  const pets = filteredPets.slice(0, amt);
  return { pets, random: false };
};

export const getThis = (player: PlayerLike, callingPet: Pet): PetRandomResult => {
  if (callingPet && hasSilly(callingPet)) {
    return getRandomLivingPet(player, [callingPet], true);
  }

  return { pet: callingPet, random: false };
};

export const getSpecificPet = (
  player: PlayerLike,
  callingPet: Pet,
  target: Pet,
): PetRandomResult => {
  if (callingPet && hasSilly(callingPet)) {
    return getRandomLivingPet(player, undefined, true);
  }

  if (!target || !target.alive) {
    return { pet: null, random: false };
  }

  return { pet: target, random: false };
};

export const nearestPetsAhead = (
  player: PlayerLike,
  amt: number,
  callingPet: Pet,
  excludePets?: Pet[],
  includeOpponent?: boolean,
  excludeEquipment?: string,
): PetsRandomResult => {
  if (callingPet && hasSilly(callingPet)) {
    const localExclude = excludePets ? [...excludePets] : [];
    if (!localExclude.includes(callingPet)) {
      localExclude.push(callingPet);
    }
    return getRandomLivingPets(player, amt, true, localExclude);
  }

  const pets: Pet[] = [];
  let petAhead = callingPet.petAhead;
  while (petAhead) {
    if (pets.length >= amt) {
      break;
    }
    if (excludeEquipment && petAhead.equipment?.name === excludeEquipment) {
      petAhead = petAhead.petAhead;
      continue;
    }
    if (!excludePets || !excludePets.includes(petAhead)) {
      pets.push(petAhead);
    }
    petAhead = petAhead.petAhead;
  }

  if (pets.length < amt && includeOpponent) {
    let opponentPet = player.opponent.furthestUpPet;
    while (opponentPet) {
      if (pets.length >= amt) {
        break;
      }
      if (excludeEquipment && opponentPet.equipment?.name === excludeEquipment) {
        opponentPet = opponentPet.petBehind();
        continue;
      }
      if (!excludePets || !excludePets.includes(opponentPet)) {
        pets.push(opponentPet);
      }
      opponentPet = opponentPet.petBehind();
    }
  }
  return { pets, random: false };
};

export const getPetsWithinXSpaces = (
  player: PlayerLike,
  callingPet: Pet,
  range: number,
): PetsRandomResult => {
  if (callingPet && hasSilly(callingPet)) {
    return getRandomLivingPets(player, range * 2, true, [callingPet]);
  }

  const callingPosition = callingPet.savedPosition;
  const targets: Pet[] = [];

  for (const pet of player.petArray) {
    if (pet.alive && pet !== callingPet) {
      const distance = Math.abs(pet.position - callingPosition);
      if (distance > 0 && distance <= range) {
        targets.push(pet);
      }
    }
  }

  for (const pet of player.opponent.petArray) {
    if (pet.alive) {
      const distance = callingPosition + pet.position + 1;
      if (distance <= range) {
        targets.push(pet);
      }
    }
  }

  return { pets: targets, random: false };
};

export const getOppositeEnemyPet = (
  player: PlayerLike,
  callingPet: Pet,
): PetRandomResult => {
  if (callingPet && hasSilly(callingPet)) {
    return getRandomLivingPet(player, [callingPet], true);
  }

  const position = callingPet.position;

  let target = getPetAtPosition(player.opponent, position);
  if (target && target.alive) {
    return { pet: target, random: false };
  }

  for (let distance = 1; distance <= 4; distance++) {
    target = getPetAtPosition(player.opponent, position + distance);
    if (target && target.alive) {
      return { pet: target, random: false };
    }

    target = getPetAtPosition(player.opponent, position - distance);
    if (target && target.alive) {
      return { pet: target, random: false };
    }
  }

  return { pet: null, random: false };
};

