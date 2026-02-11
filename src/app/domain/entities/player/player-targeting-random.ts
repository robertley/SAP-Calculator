import { clone } from 'lodash-es';
import { Pet } from '../pet.class';
import { getRandomInt } from 'app/runtime/random';
import { getPetsWithEquipment, hasSilly } from './player-utils';
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

function pickPetFromPool(
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
  return { pet: pets[decision.index] ?? null, random: decision.randomEvent };
}

export const getRandomPet = (
  player: PlayerLike,
  excludePets?: Pet[],
  donut?: boolean,
  blueberry?: boolean,
  notFiftyFifty?: boolean,
  callingPet?: Pet,
  includeOpponent?: boolean,
): PetRandomResult => {
  if (callingPet && hasSilly(callingPet)) {
    const localExclude = excludePets ? [...excludePets] : [];
    if (!localExclude.includes(callingPet)) {
      localExclude.push(callingPet);
    }
    return getRandomLivingPet(player, localExclude, true);
  }

  let pets: Pet[] = includeOpponent
    ? [...player.opponent.petArray, ...player.petArray]
    : player.petArray;

  if (donut && blueberry) {
    const donutPets = getPetsWithEquipment(player, 'Donut').filter(
      (pet) => !excludePets?.includes(pet),
    );
    const blueberryPets = getPetsWithEquipment(player, 'Blueberry').filter(
      (pet) => !excludePets?.includes(pet),
    );
    if (donutPets.length > 0 || blueberryPets.length > 0) {
      pets = [...donutPets, ...blueberryPets];
    }
  } else if (donut) {
    const donutPets = getPetsWithEquipment(player, 'Donut').filter(
      (pet) => !excludePets?.includes(pet),
    );
    if (donutPets.length > 0) {
      pets = donutPets;
    }
    if (notFiftyFifty) {
      pets = pets.filter((pet) => {
        return (
          pet.health !== 50 ||
          pet.attack !== 50 ||
          pet.hasTrigger(undefined, 'Pet', 'BehemothAbility') ||
          pet.hasTrigger(undefined, 'Pet', 'GiantTortoiseAbility')
        );
      });

      if (pets.length === 0) {
        pets = player.petArray;
      }
    }
  } else if (blueberry) {
    const blueberryPets = getPetsWithEquipment(player, 'Blueberry').filter(
      (pet) => !excludePets?.includes(pet),
    );
    if (blueberryPets.length > 0) {
      pets = blueberryPets;
    }
  }

  pets = pets.filter((pet) => {
    let keep = true;
    if (excludePets) {
      keep = !excludePets.includes(pet);
    }
    return keep && pet.health > 0;
  });

  if (notFiftyFifty) {
    const beforeFilterPets = clone(pets);
    pets = pets.filter((pet) => pet.health !== 50 || pet.attack !== 50);
    if (pets.length === 0) {
      pets = beforeFilterPets;
    }
  }

  if (pets.length === 0) {
    return { pet: null, random: false };
  }
  return pickPetFromPool(
    'target.random-pet',
    'Random pet target',
    pets,
    callingPet,
  );
};

export const getRandomPets = (
  player: PlayerLike,
  amt: number,
  excludePets?: Pet[],
  donut?: boolean,
  blueberry?: boolean,
  callingPet?: Pet,
  includeOpponent?: boolean,
): PetsRandomResult => {
  if (callingPet && hasSilly(callingPet)) {
    const localExclude = excludePets ? [...excludePets] : [];
    if (!localExclude.includes(callingPet)) {
      localExclude.push(callingPet);
    }
    return getRandomLivingPets(player, amt, true, localExclude);
  }

  const pets: Pet[] = [];
  const localExclude = excludePets ?? [];
  let random = true;
  for (let i = 0; i < amt; i++) {
    const petResp = getRandomPet(
      player,
      localExclude,
      donut,
      blueberry,
      undefined,
      callingPet,
      includeOpponent,
    );
    random = petResp.random;
    if (petResp.pet == null) {
      break;
    }
    localExclude.push(petResp.pet);
    pets.push(petResp.pet);
  }

  return { pets, random };
};

export const getRandomEnemyPetsWithSillyFallback = (
  player: PlayerLike,
  amt: number,
  excludePets?: Pet[],
  donut?: boolean,
  blueberry?: boolean,
  callingPet?: Pet,
): PetsRandomResult => {
  if (callingPet && hasSilly(callingPet)) {
    const localExclude = excludePets ? [...excludePets] : [];
    if (!localExclude.includes(callingPet)) {
      localExclude.push(callingPet);
    }
    return getRandomPets(
      player,
      amt,
      localExclude,
      donut,
      blueberry,
      undefined,
      true,
    );
  }

  return getRandomPets(
    player.opponent,
    amt,
    excludePets,
    donut,
    blueberry,
    callingPet,
  );
};

export const getPetsWithEquipmentWithSillyFallback = (
  player: PlayerLike,
  equipmentName: string,
  callingPet?: Pet,
): Pet[] => {
  if (callingPet && hasSilly(callingPet)) {
    return [
      ...getPetsWithEquipment(player, equipmentName),
      ...getPetsWithEquipment(player.opponent, equipmentName),
    ];
  }

  return getPetsWithEquipment(player.opponent, equipmentName);
};

export const getRandomLivingPets = (
  player: PlayerLike,
  amt: number,
  ignoreEquipmentPriority = false,
  excludePets?: Pet[],
): PetsRandomResult => {
  const pets: Pet[] = [];
  const localExcludePets: Pet[] = excludePets ? [...excludePets] : [];

  const getCandidatePool = (excludes: Pet[]) => {
    let candidates = [...player.petArray, ...player.opponent.petArray];

    if (!ignoreEquipmentPriority) {
      const donutPets = getPetsWithEquipment(player, 'Donut').filter(
        (pet) => !excludes?.includes(pet),
      );
      const blueberryPets = getPetsWithEquipment(player, 'Blueberry').filter(
        (pet) => !excludes?.includes(pet),
      );
      const opponentDonutPets = getPetsWithEquipment(
        player.opponent,
        'Donut',
      ).filter((pet) => !excludes?.includes(pet));
      const opponentBlueberryPets = getPetsWithEquipment(
        player.opponent,
        'Blueberry',
      ).filter((pet) => !excludes?.includes(pet));

      if (
        donutPets.length > 0 ||
        blueberryPets.length > 0 ||
        opponentDonutPets.length > 0 ||
        opponentBlueberryPets.length > 0
      ) {
        candidates = [
          ...donutPets,
          ...blueberryPets,
          ...opponentDonutPets,
          ...opponentBlueberryPets,
        ];
      }
    }

    return candidates.filter((pet) => {
      let keep = true;
      if (excludes) {
        keep = !excludes.includes(pet);
      }
      return keep && pet.health > 0;
    });
  };

  const initialCandidateCount = getCandidatePool(localExcludePets).length;

  for (let i = 0; i < amt; i++) {
    const petResp = getRandomLivingPet(
      player,
      localExcludePets,
      ignoreEquipmentPriority,
    );
    if (petResp.pet == null) {
      break;
    }
    localExcludePets.push(petResp.pet);
    pets.push(petResp.pet);
  }

  return { pets, random: initialCandidateCount > pets.length };
};

export const getRandomLivingPet = (
  player: PlayerLike,
  excludePets?: Pet[],
  ignoreEquipmentPriority = false,
): PetRandomResult => {
  let pets = [...player.opponent.petArray, ...player.petArray];

  if (!ignoreEquipmentPriority) {
    const donutPets = getPetsWithEquipment(player, 'Donut').filter(
      (pet) => !excludePets?.includes(pet),
    );
    const blueberryPets = getPetsWithEquipment(player, 'Blueberry').filter(
      (pet) => !excludePets?.includes(pet),
    );
    const opponentDonutPets = getPetsWithEquipment(
      player.opponent,
      'Donut',
    ).filter((pet) => !excludePets?.includes(pet));
    const opponentBlueberryPets = getPetsWithEquipment(
      player.opponent,
      'Blueberry',
    ).filter((pet) => !excludePets?.includes(pet));

    if (
      donutPets.length > 0 ||
      blueberryPets.length > 0 ||
      opponentDonutPets.length > 0 ||
      opponentBlueberryPets.length > 0
    ) {
      pets = [
        ...opponentDonutPets,
        ...opponentBlueberryPets,
        ...donutPets,
        ...blueberryPets,
      ];
    }
  }

  pets = pets.filter((pet) => {
    let keep = true;
    if (excludePets) {
      keep = !excludePets.includes(pet);
    }
    return keep && pet.health > 0;
  });

  if (pets.length === 0) {
    return { pet: null, random: false };
  }
  return pickPetFromPool(
    'target.random-living-pet',
    'Random living pet target',
    pets,
    undefined,
  );
};

