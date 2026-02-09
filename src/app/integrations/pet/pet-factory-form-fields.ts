import { Pet } from 'app/domain/entities/pet.class';
import { PetForm } from './pet-form.interface';

const PET_INDEXES = [1, 2, 3] as const;

type PetFormField = keyof PetForm;

const buildParrotFormFields = (): ReadonlyArray<PetFormField> => {
  const fields: PetFormField[] = [
    'parrotCopyPet',
    'parrotCopyPetBelugaSwallowedPet',
  ];

  for (const i of PET_INDEXES) {
    fields.push(`parrotCopyPetAbominationSwallowedPet${i}` as PetFormField);
    fields.push(
      `parrotCopyPetAbominationSwallowedPet${i}BelugaSwallowedPet` as PetFormField,
    );
    fields.push(
      `parrotCopyPetAbominationSwallowedPet${i}Level` as PetFormField,
    );
    fields.push(
      `parrotCopyPetAbominationSwallowedPet${i}TimesHurt` as PetFormField,
    );
    fields.push(
      `parrotCopyPetAbominationSwallowedPet${i}ParrotCopyPet` as PetFormField,
    );
    fields.push(
      `parrotCopyPetAbominationSwallowedPet${i}ParrotCopyPetBelugaSwallowedPet` as PetFormField,
    );

    for (const j of PET_INDEXES) {
      fields.push(
        `parrotCopyPetAbominationSwallowedPet${i}ParrotCopyPetAbominationSwallowedPet${j}` as PetFormField,
      );
      fields.push(
        `parrotCopyPetAbominationSwallowedPet${i}ParrotCopyPetAbominationSwallowedPet${j}BelugaSwallowedPet` as PetFormField,
      );
      fields.push(
        `parrotCopyPetAbominationSwallowedPet${i}ParrotCopyPetAbominationSwallowedPet${j}Level` as PetFormField,
      );
      fields.push(
        `parrotCopyPetAbominationSwallowedPet${i}ParrotCopyPetAbominationSwallowedPet${j}TimesHurt` as PetFormField,
      );
    }
  }

  return fields;
};

const buildAbominationFormFields = (): ReadonlyArray<PetFormField> => {
  const fields: PetFormField[] = [];

  for (const i of PET_INDEXES) {
    fields.push(
      `abominationSwallowedPet${i}BelugaSwallowedPet` as PetFormField,
    );
    fields.push(`abominationSwallowedPet${i}ParrotCopyPet` as PetFormField);
    fields.push(
      `abominationSwallowedPet${i}ParrotCopyPetBelugaSwallowedPet` as PetFormField,
    );

    for (const j of PET_INDEXES) {
      fields.push(
        `abominationSwallowedPet${i}ParrotCopyPetAbominationSwallowedPet${j}` as PetFormField,
      );
      fields.push(
        `abominationSwallowedPet${i}ParrotCopyPetAbominationSwallowedPet${j}BelugaSwallowedPet` as PetFormField,
      );
      fields.push(
        `abominationSwallowedPet${i}ParrotCopyPetAbominationSwallowedPet${j}Level` as PetFormField,
      );
      fields.push(
        `abominationSwallowedPet${i}ParrotCopyPetAbominationSwallowedPet${j}TimesHurt` as PetFormField,
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
  for (const field of fields) {
    const value = (petForm as any)[field];
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
  for (const field of fields) {
    const value = (petForm as any)[field];
    if (value != null) {
      (target as any)[field] = value;
      continue;
    }
    const fieldName = String(field);
    if (fieldName.endsWith('Level')) {
      (target as any)[field] = 1;
      continue;
    }
    if (fieldName.endsWith('TimesHurt')) {
      (target as any)[field] = 0;
      continue;
    }
    (target as any)[field] = null;
  }
}
