import {
  PetMemoryField,
  PetMemoryNumberField,
  PetMemoryState,
  PetMemoryStringField,
} from 'app/domain/interfaces/pet-memory.interface';

export const PET_MEMORY_SLOTS = [1, 2, 3] as const;
export type PetMemorySlot = (typeof PET_MEMORY_SLOTS)[number];

export type PetMemorySlotPrefix =
  | 'abominationSwallowedPet'
  | 'parrotCopyPetAbominationSwallowedPet';

type PetMemorySlotBaseField = `${PetMemorySlotPrefix}${PetMemorySlot}`;

export type PetMemoryNestedSlotFields = {
  base: PetMemoryStringField;
  belugaSwallowedPet: PetMemoryStringField;
  level: PetMemoryNumberField;
  timesHurt: PetMemoryNumberField;
};

export type PetMemorySlotFields = {
  base: PetMemoryStringField;
  belugaSwallowedPet: PetMemoryStringField;
  level: PetMemoryNumberField;
  timesHurt: PetMemoryNumberField;
  parrotCopyPet: PetMemoryStringField;
  parrotCopyPetBelugaSwallowedPet: PetMemoryStringField;
  nested: (slot: PetMemorySlot) => PetMemoryNestedSlotFields;
};

type PetMemoryReader = Partial<PetMemoryState>;
type PetMemoryWriter = Partial<PetMemoryState>;

export function createPetMemorySlotFields(
  prefix: PetMemorySlotPrefix,
  slot: PetMemorySlot,
): PetMemorySlotFields {
  const base = `${prefix}${slot}` as PetMemorySlotBaseField;
  return {
    base: base as PetMemoryStringField,
    belugaSwallowedPet: `${base}BelugaSwallowedPet` as PetMemoryStringField,
    level: `${base}Level` as PetMemoryNumberField,
    timesHurt: `${base}TimesHurt` as PetMemoryNumberField,
    parrotCopyPet: `${base}ParrotCopyPet` as PetMemoryStringField,
    parrotCopyPetBelugaSwallowedPet:
      `${base}ParrotCopyPetBelugaSwallowedPet` as PetMemoryStringField,
    nested: (nestedSlot: PetMemorySlot) => {
      const nestedBase =
        `${base}ParrotCopyPetAbominationSwallowedPet${nestedSlot}` as PetMemoryStringField;
      return {
        base: nestedBase,
        belugaSwallowedPet:
          `${nestedBase}BelugaSwallowedPet` as PetMemoryStringField,
        level: `${nestedBase}Level` as PetMemoryNumberField,
        timesHurt: `${nestedBase}TimesHurt` as PetMemoryNumberField,
      };
    },
  };
}

export function readPetMemoryString(
  source: PetMemoryReader,
  field: PetMemoryStringField,
  fallback: string | null = null,
): string | null {
  const value = source[field];
  if (typeof value === 'string' || value === null) {
    return value;
  }
  return fallback;
}

export function readPetMemoryNumber(
  source: PetMemoryReader,
  field: PetMemoryNumberField,
  fallback: number,
): number {
  const value = source[field];
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

export function writePetMemoryString(
  target: PetMemoryWriter,
  field: PetMemoryStringField,
  value: string | null,
): void {
  target[field] = value;
}

export function writePetMemoryNumber(
  target: PetMemoryWriter,
  field: PetMemoryNumberField,
  value: number,
): void {
  target[field] = value;
}

export type PetMemoryFieldValue =
  | string
  | number
  | null
  | undefined;

export type PetMemoryFieldMap = Partial<Record<PetMemoryField, PetMemoryFieldValue>>;
