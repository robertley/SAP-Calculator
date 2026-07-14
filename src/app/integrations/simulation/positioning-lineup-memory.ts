import { PetConfig } from 'app/domain/interfaces/simulation-config.interface';

const PARROT_MEMORY_PREFIX = 'parrotCopyPet';
const ABOMINATION_MEMORY_PREFIX = 'abominationSwallowedPet';

function clonePet(pet: PetConfig | null): PetConfig | null {
  if (!pet) {
    return null;
  }
  return {
    ...pet,
    equipment: pet.equipment ? { ...pet.equipment } : null,
  };
}

function clearParrotMemory(pet: Record<string, unknown>): void {
  Object.keys(pet).forEach((key) => {
    if (key.startsWith(PARROT_MEMORY_PREFIX)) {
      delete pet[key];
    }
  });
  pet.parrotCopyPet = null;
}

function copyResolvedParrotMemory(
  target: Record<string, unknown>,
  parrot: Record<string, unknown>,
): void {
  Object.entries(target).forEach(([key, value]) => {
    if (key.startsWith(PARROT_MEMORY_PREFIX)) {
      parrot[key] = value;
    }
  });
}

function copyTargetMemory(
  target: Record<string, unknown>,
  parrot: Record<string, unknown>,
): void {
  parrot.parrotCopyPet = target.name ?? null;
  if (target.name === 'Beluga Whale') {
    parrot.parrotCopyPetBelugaSwallowedPet =
      target.belugaSwallowedPet ?? null;
  }
  if (target.name !== 'Abomination') {
    return;
  }
  Object.entries(target).forEach(([key, value]) => {
    if (!key.startsWith(ABOMINATION_MEMORY_PREFIX)) {
      return;
    }
    parrot[`${PARROT_MEMORY_PREFIX}${key[0].toUpperCase()}${key.slice(1)}`] =
      value;
  });
}

function findNearestPetAhead(
  lineup: (PetConfig | null)[],
  index: number,
): PetConfig | null {
  for (let aheadIndex = index - 1; aheadIndex >= 0; aheadIndex -= 1) {
    const candidate = lineup[aheadIndex];
    if (candidate?.name) {
      return candidate;
    }
  }
  return null;
}

/**
 * Refreshes memory that is determined by the candidate's positions rather
 * than by the pet identity that moved into that position.
 */
export function refreshPositioningLineupMemory(
  lineup: (PetConfig | null)[],
): (PetConfig | null)[] {
  const refreshed = lineup.map(clonePet);
  for (let index = 0; index < refreshed.length; index += 1) {
    const pet = refreshed[index];
    if (pet?.name !== 'Parrot') {
      continue;
    }
    const petRecord = pet as unknown as Record<string, unknown>;
    clearParrotMemory(petRecord);
    const target = findNearestPetAhead(refreshed, index);
    if (!target) {
      continue;
    }
    const targetRecord = target as unknown as Record<string, unknown>;
    if (target.name === 'Parrot') {
      copyResolvedParrotMemory(targetRecord, petRecord);
    } else {
      copyTargetMemory(targetRecord, petRecord);
    }
  }
  return refreshed;
}
