import { Pet } from 'app/domain/entities/pet.class';
import {
  PET_MEMORY_SLOTS,
  createPetMemorySlotFields,
} from 'app/domain/entities/pet/pet-memory-fields';
import { PetForm } from './pet-form.interface';

type PetFormField = keyof PetForm;
type RecordShape = Record<string, unknown>;

const toFormRecord = (petForm: PetForm): Readonly<RecordShape> =>
  petForm as unknown as Readonly<RecordShape>;

const toPetRecord = (pet: Pet): RecordShape => pet as unknown as RecordShape;

const buildParrotFormFields = (): ReadonlyArray<PetFormField> => {
  const fields: PetFormField[] = [
    'parrotCopyPet',
    'parrotCopyPetBelugaSwallowedPet',
  ];

  for (const slot of PET_MEMORY_SLOTS) {
    const slotFields = createPetMemorySlotFields(
      'parrotCopyPetAbominationSwallowedPet',
      slot,
    );
    fields.push(
      slotFields.base as PetFormField,
      slotFields.belugaSwallowedPet as PetFormField,
      slotFields.sarcasticFringeheadSwallowedPet as PetFormField,
      slotFields.level as PetFormField,
      slotFields.timesHurt as PetFormField,
      slotFields.parrotCopyPet as PetFormField,
      slotFields.parrotCopyPetBelugaSwallowedPet as PetFormField,
    );

    for (const nestedSlot of PET_MEMORY_SLOTS) {
      const nestedFields = slotFields.nested(nestedSlot);
      fields.push(
        nestedFields.base as PetFormField,
        nestedFields.belugaSwallowedPet as PetFormField,
        nestedFields.sarcasticFringeheadSwallowedPet as PetFormField,
        nestedFields.level as PetFormField,
        nestedFields.timesHurt as PetFormField,
      );
    }
  }

  return fields;
};

const buildAbominationFormFields = (): ReadonlyArray<PetFormField> => {
  const fields: PetFormField[] = [];

  for (const slot of PET_MEMORY_SLOTS) {
    const slotFields = createPetMemorySlotFields('abominationSwallowedPet', slot);
    fields.push(
      slotFields.belugaSwallowedPet as PetFormField,
      slotFields.sarcasticFringeheadSwallowedPet as PetFormField,
      slotFields.parrotCopyPet as PetFormField,
      slotFields.parrotCopyPetBelugaSwallowedPet as PetFormField,
    );

    for (const nestedSlot of PET_MEMORY_SLOTS) {
      const nestedFields = slotFields.nested(nestedSlot);
      fields.push(
        nestedFields.base as PetFormField,
        nestedFields.belugaSwallowedPet as PetFormField,
        nestedFields.sarcasticFringeheadSwallowedPet as PetFormField,
        nestedFields.level as PetFormField,
        nestedFields.timesHurt as PetFormField,
      );
    }
  }

  return fields;
};

export const PARROT_FORM_FIELDS = buildParrotFormFields();
export const ABOMINATION_FORM_FIELDS = buildAbominationFormFields();

const isNonDefaultPetFormValue = (
  field: keyof PetForm,
  value: unknown,
): boolean => {
  if (value == null) {
    return false;
  }
  if (typeof value === 'string' && value.trim() === '') {
    return false;
  }
  const fieldName = String(field);
  if (fieldName.endsWith('Level')) {
    const numeric = typeof value === 'number' ? value : Number(value);
    return Number.isFinite(numeric) ? numeric !== 1 : false;
  }
  if (fieldName.endsWith('TimesHurt')) {
    const numeric = typeof value === 'number' ? value : Number(value);
    return Number.isFinite(numeric) ? numeric !== 0 : false;
  }
  return true;
};

export function hasNonDefaultFormValue(
  petForm: PetForm,
  fields: ReadonlyArray<keyof PetForm>,
): boolean {
  const formRecord = toFormRecord(petForm);
  for (const field of fields) {
    const value = formRecord[String(field)];
    if (isNonDefaultPetFormValue(field, value)) {
      return true;
    }
  }
  return false;
}

export function copyPetFormFields(
  target: Pet,
  petForm: PetForm,
  fields: ReadonlyArray<keyof PetForm>,
): void {
  const formRecord = toFormRecord(petForm);
  const targetRecord = toPetRecord(target);
  for (const field of fields) {
    const key = String(field);
    const value = formRecord[key];
    if (value != null) {
      targetRecord[key] = value;
      continue;
    }
    const fieldName = key;
    if (fieldName.endsWith('Level')) {
      targetRecord[key] = 1;
      continue;
    }
    if (fieldName.endsWith('TimesHurt')) {
      targetRecord[key] = 0;
      continue;
    }
    targetRecord[key] = null;
  }
}
