import { SwallowedPetTarget } from './pet-selector.constants';

type ResolveArgs = {
  target: SwallowedPetTarget;
  swallowedPetIndex?: number;
  swallowedPetParentIndex?: number;
  petName?: string;
};

export function resolveSwallowedPetControlPath({
  target,
  swallowedPetIndex,
  swallowedPetParentIndex,
  petName,
}: ResolveArgs): string | null {
  switch (target) {
    case 'abomination-beluga':
      return withIndex(
        swallowedPetIndex,
        (idx) => `abominationSwallowedPet${idx}BelugaSwallowedPet`,
      );
    case 'abomination-sarcastic':
      return withIndex(
        swallowedPetIndex,
        (idx) => `abominationSwallowedPet${idx}SarcasticFringeheadSwallowedPet`,
      );
    case 'parrot':
      return 'parrotCopyPet';
    case 'parrot-beluga':
      return 'parrotCopyPetBelugaSwallowedPet';
    case 'parrot-abomination':
      return withIndex(
        swallowedPetIndex,
        (idx) => `parrotCopyPetAbominationSwallowedPet${idx}`,
      );
    case 'parrot-abomination-beluga':
      return withIndex(
        swallowedPetIndex,
        (idx) => `parrotCopyPetAbominationSwallowedPet${idx}BelugaSwallowedPet`,
      );
    case 'abomination-parrot':
      return withIndex(
        swallowedPetIndex,
        (idx) => `abominationSwallowedPet${idx}ParrotCopyPet`,
      );
    case 'abomination-parrot-beluga':
      return withIndex(
        swallowedPetIndex,
        (idx) => `abominationSwallowedPet${idx}ParrotCopyPetBelugaSwallowedPet`,
      );
    case 'abomination-parrot-abomination':
      return withParentAndIndex(swallowedPetParentIndex, swallowedPetIndex, (parentIdx, idx) => {
        return `abominationSwallowedPet${parentIdx}ParrotCopyPetAbominationSwallowedPet${idx}`;
      });
    case 'abomination-parrot-abomination-beluga':
      return withParentAndIndex(swallowedPetParentIndex, swallowedPetIndex, (parentIdx, idx) => {
        return `abominationSwallowedPet${parentIdx}ParrotCopyPetAbominationSwallowedPet${idx}BelugaSwallowedPet`;
      });
    case 'parrot-abomination-parrot':
      return withIndex(
        swallowedPetIndex,
        (idx) => `parrotCopyPetAbominationSwallowedPet${idx}ParrotCopyPet`,
      );
    case 'parrot-abomination-parrot-beluga':
      return withIndex(
        swallowedPetIndex,
        (idx) => `parrotCopyPetAbominationSwallowedPet${idx}ParrotCopyPetBelugaSwallowedPet`,
      );
    case 'parrot-abomination-parrot-abomination':
      return withParentAndIndex(swallowedPetParentIndex, swallowedPetIndex, (parentIdx, idx) => {
        return `parrotCopyPetAbominationSwallowedPet${parentIdx}ParrotCopyPetAbominationSwallowedPet${idx}`;
      });
    case 'parrot-abomination-parrot-abomination-beluga':
      return withParentAndIndex(swallowedPetParentIndex, swallowedPetIndex, (parentIdx, idx) => {
        return `parrotCopyPetAbominationSwallowedPet${parentIdx}ParrotCopyPetAbominationSwallowedPet${idx}BelugaSwallowedPet`;
      });
    default:
      return resolveDefaultControlPath(target, swallowedPetIndex, petName);
  }
}

function withIndex(
  index: number | undefined,
  formatter: (index: number) => string,
): string | null {
  if (index == null) {
    return null;
  }
  return formatter(index);
}

function withParentAndIndex(
  parentIndex: number | undefined,
  index: number | undefined,
  formatter: (parentIndex: number, index: number) => string,
): string | null {
  if (parentIndex == null || index == null) {
    return null;
  }
  return formatter(parentIndex, index);
}

function resolveDefaultControlPath(
  target: SwallowedPetTarget,
  swallowedPetIndex: number | undefined,
  petName?: string,
): string | null {
  if (petName === 'Beluga Whale') {
    return 'belugaSwallowedPet';
  }
  if (target === 'abomination' || petName === 'Abomination') {
    return withIndex(
      swallowedPetIndex,
      (idx) => `abominationSwallowedPet${idx}`,
    );
  }
  if (petName === 'Sarcastic Fringehead') {
    return 'sarcasticFringeheadSwallowedPet';
  }
  return null;
}
