type SwallowSlot = 1 | 2 | 3;

type SwallowedPetPrefix =
  | `abominationSwallowedPet${SwallowSlot}`
  | `parrotCopyPetAbominationSwallowedPet${SwallowSlot}`;

type SwallowedPetStringSuffix =
  | ''
  | 'BelugaSwallowedPet'
  | 'ParrotCopyPet'
  | 'ParrotCopyPetBelugaSwallowedPet'
  | `ParrotCopyPetAbominationSwallowedPet${SwallowSlot}`
  | `ParrotCopyPetAbominationSwallowedPet${SwallowSlot}BelugaSwallowedPet`;

type SwallowedPetNumberSuffix =
  | 'Level'
  | 'TimesHurt'
  | `ParrotCopyPetAbominationSwallowedPet${SwallowSlot}Level`
  | `ParrotCopyPetAbominationSwallowedPet${SwallowSlot}TimesHurt`;

type SwallowedPetStringField = `${SwallowedPetPrefix}${SwallowedPetStringSuffix}`;
type SwallowedPetNumberField = `${SwallowedPetPrefix}${SwallowedPetNumberSuffix}`;

export type PetMemoryStringField =
  | 'belugaSwallowedPet'
  | 'parrotCopyPet'
  | 'parrotCopyPetBelugaSwallowedPet'
  | 'sarcasticFringeheadSwallowedPet'
  | SwallowedPetStringField;

export type PetMemoryNumberField = SwallowedPetNumberField;

export type PetMemoryField = PetMemoryStringField | PetMemoryNumberField;

export type PetMemoryState = Partial<
  Record<PetMemoryStringField, string | null>
> &
  Partial<Record<PetMemoryNumberField, number | null>>;
