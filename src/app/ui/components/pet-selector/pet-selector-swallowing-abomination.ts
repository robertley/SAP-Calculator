import { Directive } from '@angular/core';
import { Pet } from 'app/domain/entities/pet.class';
import {
  PARROT_COPY_ABOMINATION_SWALLOWED_FIELDS,
  supportsTimesHurtPet,
} from './pet-selector.constants';
import { PetSelectorPackFiltering } from './pet-selector-pack-filtering';

type SlotIndex = 1 | 2 | 3;

interface AbominationSwallowedSlotDescriptor {
  index: SlotIndex;
  nameField: string;
  belugaField: string;
  sarcasticField: string;
  levelField: string;
  timesHurtField: string;
}

interface ParrotCopyAbominationSlotDescriptor {
  index: SlotIndex;
  petField: string;
  belugaField: string;
  levelField: string;
  timesHurtField: string;
}

const ABOMINATION_SWALLOWED_SLOT_DESCRIPTORS: ReadonlyArray<AbominationSwallowedSlotDescriptor> =
  [1, 2, 3].map((index) => ({
    index: index as SlotIndex,
    nameField: `abominationSwallowedPet${index}`,
    belugaField: `abominationSwallowedPet${index}BelugaSwallowedPet`,
    sarcasticField: `abominationSwallowedPet${index}SarcasticFringeheadSwallowedPet`,
    levelField: `abominationSwallowedPet${index}Level`,
    timesHurtField: `abominationSwallowedPet${index}TimesHurt`,
  }));

const PARROT_COPY_ABOMINATION_SLOT_DESCRIPTORS: ReadonlyArray<ParrotCopyAbominationSlotDescriptor> =
  [1, 2, 3].map((index) => ({
    index: index as SlotIndex,
    petField: `parrotCopyPetAbominationSwallowedPet${index}`,
    belugaField: `parrotCopyPetAbominationSwallowedPet${index}BelugaSwallowedPet`,
    levelField: `parrotCopyPetAbominationSwallowedPet${index}Level`,
    timesHurtField: `parrotCopyPetAbominationSwallowedPet${index}TimesHurt`,
  }));

@Directive()
export class PetSelectorSwallowingAbomination extends PetSelectorPackFiltering {
  protected substitutePet(_nameChange = false): void {}

  setAbominationParrotCopySettings(_value: unknown) {
    let pet = this.player.getPet(this.index);
    if (pet == null) {
      return;
    }
    const slots = [1, 2, 3];
    for (const slot of slots) {
      const base = `abominationSwallowedPet${slot}`;
      const swallowedName = this.formGroup.get(base)?.value;
      if (swallowedName !== 'Parrot') {
        this.clearAbominationParrotCopySettings(pet, slot);
        continue;
      }

      const parrotCopyPet =
        this.formGroup.get(`${base}ParrotCopyPet`)?.value ?? null;
      const parrotCopyBeluga =
        this.formGroup.get(`${base}ParrotCopyPetBelugaSwallowedPet`)?.value ??
        null;

      this.setPetField(pet, `${base}ParrotCopyPet`, parrotCopyPet);
      this.setPetField(
        pet,
        `${base}ParrotCopyPetBelugaSwallowedPet`,
        parrotCopyPet === 'Beluga Whale' ? parrotCopyBeluga : null,
      );
      if (parrotCopyPet !== 'Beluga Whale') {
        this.formGroup
          .get(`${base}ParrotCopyPetBelugaSwallowedPet`)
          ?.setValue(null, { emitEvent: false });
      }

      if (parrotCopyPet !== 'Abomination') {
        this.clearAbominationParrotCopyAbominationSettings(pet, slot);
        continue;
      }

      for (let inner = 1; inner <= 3; inner++) {
        const innerBase = `${base}ParrotCopyPetAbominationSwallowedPet${inner}`;
        const innerName = this.formGroup.get(innerBase)?.value ?? null;
        const innerBeluga =
          this.formGroup.get(`${innerBase}BelugaSwallowedPet`)?.value ?? null;
        const innerLevel = Number(
          this.formGroup.get(`${innerBase}Level`)?.value ?? 1,
        );
        this.setPetField(pet, innerBase, innerName);
        this.setPetField(
          pet,
          `${innerBase}BelugaSwallowedPet`,
          innerName === 'Beluga Whale' ? innerBeluga : null,
        );
        this.setPetField(pet, `${innerBase}Level`, innerLevel || 1);
        this.setPetField(
          pet,
          `${innerBase}TimesHurt`,
          this.getAbominationParrotCopyAbominationTimesHurtValue(
            `${innerBase}TimesHurt`,
          ),
        );

        if (innerName !== 'Beluga Whale') {
          this.formGroup
            .get(`${innerBase}BelugaSwallowedPet`)
            ?.setValue(null, { emitEvent: false });
        }
      }
    }
  }

  shouldShowAbominationParrotCopyAbominationTimesHurt(
    outerIndex: number,
    innerIndex: number,
  ): boolean {
    const control = this.formGroup.get(
      `abominationSwallowedPet${outerIndex}ParrotCopyPetAbominationSwallowedPet${innerIndex}`,
    );
    return supportsTimesHurtPet(control?.value);
  }

  setParrotCopyPetAbominationSwallowedPets(_value: unknown) {
    let pet = this.player.getPet(this.index);
    if (pet == null) {
      return;
    }

    for (const slot of PARROT_COPY_ABOMINATION_SLOT_DESCRIPTORS) {
      const petName = this.formGroup.get(slot.petField)?.value ?? null;
      const beluga = this.formGroup.get(slot.belugaField)?.value ?? null;
      const level = Number(this.formGroup.get(slot.levelField)?.value ?? 1);

      this.setPetField(pet, slot.petField, petName);
      this.setPetField(
        pet,
        slot.belugaField,
        petName === 'Beluga Whale' ? beluga : null,
      );
      if (petName !== 'Beluga Whale') {
        this.formGroup.get(slot.belugaField)?.setValue(null, { emitEvent: false });
      }

      this.setPetField(pet, slot.levelField, level || 1);
      this.setPetField(
        pet,
        slot.timesHurtField,
        this.getParrotAbominationTimesHurtValue(slot.timesHurtField),
      );
    }

    this.setParrotCopyPetAbominationParrotSettings(null);
  }

  setParrotCopyPetAbominationParrotSettings(_value: unknown) {
    let pet = this.player.getPet(this.index);
    if (pet == null) {
      return;
    }
    for (let slot = 1; slot <= 3; slot++) {
      const base = `parrotCopyPetAbominationSwallowedPet${slot}`;
      const swallowedName = this.formGroup.get(base)?.value;
      if (swallowedName !== 'Parrot') {
        this.clearParrotCopyPetAbominationParrotSettings(pet, slot);
        continue;
      }

      const parrotCopyPet =
        this.formGroup.get(`${base}ParrotCopyPet`)?.value ?? null;
      const parrotCopyBeluga =
        this.formGroup.get(`${base}ParrotCopyPetBelugaSwallowedPet`)?.value ??
        null;

      this.setPetField(pet, `${base}ParrotCopyPet`, parrotCopyPet);
      this.setPetField(
        pet,
        `${base}ParrotCopyPetBelugaSwallowedPet`,
        parrotCopyPet === 'Beluga Whale' ? parrotCopyBeluga : null,
      );
      if (parrotCopyPet !== 'Beluga Whale') {
        this.formGroup
          .get(`${base}ParrotCopyPetBelugaSwallowedPet`)
          ?.setValue(null, { emitEvent: false });
      }

      if (parrotCopyPet !== 'Abomination') {
        this.clearParrotCopyPetAbominationParrotAbominationSettings(pet, slot);
        continue;
      }

      for (let inner = 1; inner <= 3; inner++) {
        const innerBase = `${base}ParrotCopyPetAbominationSwallowedPet${inner}`;
        const innerName = this.formGroup.get(innerBase)?.value ?? null;
        const innerBeluga =
          this.formGroup.get(`${innerBase}BelugaSwallowedPet`)?.value ?? null;
        const innerLevel = Number(
          this.formGroup.get(`${innerBase}Level`)?.value ?? 1,
        );
        this.setPetField(pet, innerBase, innerName);
        this.setPetField(
          pet,
          `${innerBase}BelugaSwallowedPet`,
          innerName === 'Beluga Whale' ? innerBeluga : null,
        );
        this.setPetField(pet, `${innerBase}Level`, innerLevel || 1);
        this.setPetField(
          pet,
          `${innerBase}TimesHurt`,
          this.getParrotCopyPetAbominationParrotAbominationTimesHurtValue(
            `${innerBase}TimesHurt`,
          ),
        );
        if (innerName !== 'Beluga Whale') {
          this.formGroup
            .get(`${innerBase}BelugaSwallowedPet`)
            ?.setValue(null, { emitEvent: false });
        }
      }
    }
  }

  shouldShowParrotCopyPetAbominationParrotAbominationTimesHurt(
    outerIndex: number,
    innerIndex: number,
  ): boolean {
    const control = this.formGroup.get(
      `parrotCopyPetAbominationSwallowedPet${outerIndex}ParrotCopyPetAbominationSwallowedPet${innerIndex}`,
    );
    return supportsTimesHurtPet(control?.value);
  }

  shouldShowParrotCopyPetAbominationTimesHurt(index: number): boolean {
    const control = this.formGroup.get(
      `parrotCopyPetAbominationSwallowedPet${index + 1}`,
    );
    return supportsTimesHurtPet(control?.value);
  }

  setSarcasticFringeheadSwallowedPet(value: string) {
    let pet = this.player.getPet(this.index);
    if (pet == null) {
      return;
    }
    pet.sarcasticFringeheadSwallowedPet = value;
  }

  setSwallowedPets(_value: unknown) {
    const pet = this.player.getPet(this.index);
    if (pet == null) {
      return;
    }
    const slots = this.normalizeAbominationSwallowedSlots(pet);

    for (const slot of slots) {
      const descriptor = ABOMINATION_SWALLOWED_SLOT_DESCRIPTORS[slot.index - 1];
      this.setPetField(pet, descriptor.nameField, slot.name);
      this.setPetField(pet, descriptor.belugaField, slot.beluga);
      this.setPetField(pet, descriptor.sarcasticField, slot.sarcastic);
      this.setPetField(pet, descriptor.levelField, slot.level);
      this.setPetField(
        pet,
        descriptor.timesHurtField,
        this.getAbominationTimesHurtValue(descriptor.timesHurtField),
      );
    }

    this.setAbominationParrotCopySettings(null);
    this.substitutePet(false);
  }

  shouldShowAbominationSwallowTimesHurt(index: number): boolean {
    const control = this.formGroup.get(`abominationSwallowedPet${index + 1}`);
    return supportsTimesHurtPet(control?.value);
  }

  setBattlesFought(value: number) {
    let pet = this.player.getPet(this.index);
    if (pet == null) {
      return;
    }
    pet.battlesFought = value;
  }

  setTimesHurt(value: number) {
    let pet = this.player.getPet(this.index);
    if (pet == null) {
      return;
    }
    pet.timesHurt = value;
    this.substitutePet(false);
  }

  private getAbominationParrotCopyAbominationTimesHurtValue(
    controlName: string,
  ): number {
    const control = this.formGroup.get(controlName);
    if (!control) {
      return 0;
    }
    const rawValue = Number(control.value);
    if (Number.isNaN(rawValue)) {
      return 0;
    }
    return Math.max(0, Math.min(99, rawValue));
  }

  private clearAbominationParrotCopySettings(pet: Pet, slot: number) {
    const base = `abominationSwallowedPet${slot}`;
    this.setPetField(pet, `${base}ParrotCopyPet`, null);
    this.setPetField(pet, `${base}ParrotCopyPetBelugaSwallowedPet`, null);
    this.formGroup
      .get(`${base}ParrotCopyPet`)
      ?.setValue(null, { emitEvent: false });
    this.formGroup
      .get(`${base}ParrotCopyPetBelugaSwallowedPet`)
      ?.setValue(null, { emitEvent: false });
    this.clearAbominationParrotCopyAbominationSettings(pet, slot);
  }

  private clearAbominationParrotCopyAbominationSettings(
    pet: Pet,
    slot: number,
  ) {
    for (let inner = 1; inner <= 3; inner++) {
      const innerBase = `abominationSwallowedPet${slot}ParrotCopyPetAbominationSwallowedPet${inner}`;
      this.setPetField(pet, innerBase, null);
      this.setPetField(pet, `${innerBase}BelugaSwallowedPet`, null);
      this.setPetField(pet, `${innerBase}Level`, 1);
      this.setPetField(pet, `${innerBase}TimesHurt`, 0);
      this.formGroup.get(innerBase)?.setValue(null, { emitEvent: false });
      this.formGroup
        .get(`${innerBase}BelugaSwallowedPet`)
        ?.setValue(null, { emitEvent: false });
      this.formGroup
        .get(`${innerBase}Level`)
        ?.setValue(1, { emitEvent: false });
      this.formGroup
        .get(`${innerBase}TimesHurt`)
        ?.setValue(0, { emitEvent: false });
    }
  }

  private getParrotCopyPetAbominationParrotAbominationTimesHurtValue(
    controlName: string,
  ): number {
    const control = this.formGroup.get(controlName);
    if (!control) {
      return 0;
    }
    const rawValue = Number(control.value);
    if (Number.isNaN(rawValue)) {
      return 0;
    }
    return Math.max(0, Math.min(99, rawValue));
  }

  private clearParrotCopyPetAbominationParrotSettings(pet: Pet, slot: number) {
    const base = `parrotCopyPetAbominationSwallowedPet${slot}`;
    this.setPetField(pet, `${base}ParrotCopyPet`, null);
    this.setPetField(pet, `${base}ParrotCopyPetBelugaSwallowedPet`, null);
    this.formGroup
      .get(`${base}ParrotCopyPet`)
      ?.setValue(null, { emitEvent: false });
    this.formGroup
      .get(`${base}ParrotCopyPetBelugaSwallowedPet`)
      ?.setValue(null, { emitEvent: false });
    this.clearParrotCopyPetAbominationParrotAbominationSettings(pet, slot);
  }

  private clearParrotCopyPetAbominationParrotAbominationSettings(
    pet: Pet,
    slot: number,
  ) {
    for (let inner = 1; inner <= 3; inner++) {
      const innerBase = `parrotCopyPetAbominationSwallowedPet${slot}ParrotCopyPetAbominationSwallowedPet${inner}`;
      this.setPetField(pet, innerBase, null);
      this.setPetField(pet, `${innerBase}BelugaSwallowedPet`, null);
      this.setPetField(pet, `${innerBase}Level`, 1);
      this.setPetField(pet, `${innerBase}TimesHurt`, 0);
      this.formGroup.get(innerBase)?.setValue(null, { emitEvent: false });
      this.formGroup
        .get(`${innerBase}BelugaSwallowedPet`)
        ?.setValue(null, { emitEvent: false });
      this.formGroup
        .get(`${innerBase}Level`)
        ?.setValue(1, { emitEvent: false });
      this.formGroup
        .get(`${innerBase}TimesHurt`)
        ?.setValue(0, { emitEvent: false });
    }
  }

  private getParrotAbominationTimesHurtValue(controlName: string): number {
    const control = this.formGroup.get(controlName);
    if (!control) {
      return 0;
    }
    const rawValue = Number(control.value);
    if (Number.isNaN(rawValue)) {
      return 0;
    }
    return Math.max(0, Math.min(99, rawValue));
  }

  protected clearParrotCopyPetAbominationSettings(pet: Pet) {
    for (const field of PARROT_COPY_ABOMINATION_SWALLOWED_FIELDS) {
      const defaultValue = field.endsWith('Level')
        ? 1
        : field.endsWith('TimesHurt')
          ? 0
          : null;
      this.setPetField(pet, field, defaultValue);
      this.formGroup.get(field)?.setValue(defaultValue, { emitEvent: false });
    }
    for (let slot = 1; slot <= 3; slot++) {
      this.clearParrotCopyPetAbominationParrotSettings(pet, slot);
    }
  }

  private getAbominationTimesHurtValue(controlName: string): number {
    const control = this.formGroup.get(controlName);
    if (!control) {
      return 0;
    }
    const rawValue = Number(control.value);
    if (Number.isNaN(rawValue)) {
      return 0;
    }
    return Math.max(0, Math.min(99, rawValue));
  }

  private normalizeAbominationSwallowedSlots(pet: Pet): Array<{
    index: SlotIndex;
    name: string | null;
    beluga: string | null;
    sarcastic: string | null;
    level: number;
  }> {
    const slots = ABOMINATION_SWALLOWED_SLOT_DESCRIPTORS.map((descriptor) => ({
      index: descriptor.index,
      name: this.formGroup.get(descriptor.nameField)?.value ?? null,
      beluga: this.formGroup.get(descriptor.belugaField)?.value ?? null,
      sarcastic: this.formGroup.get(descriptor.sarcasticField)?.value ?? null,
      level: Number(this.formGroup.get(descriptor.levelField)?.value ?? 1) || 1,
    }));

    for (const slot of slots) {
      const descriptor = ABOMINATION_SWALLOWED_SLOT_DESCRIPTORS[slot.index - 1];
      const normalizedName =
        typeof slot.name === 'string' && slot.name.trim().length > 0
          ? slot.name
          : null;
      slot.name = normalizedName;

      if (!normalizedName) {
        slot.beluga = null;
        slot.sarcastic = null;
        this.formGroup.get(descriptor.belugaField)?.setValue(null, { emitEvent: false });
        this.formGroup
          .get(descriptor.sarcasticField)
          ?.setValue(null, { emitEvent: false });
        this.clearAbominationParrotCopySettings(pet, slot.index);
        continue;
      }

      if (normalizedName !== 'Beluga Whale') {
        slot.beluga = null;
        this.formGroup.get(descriptor.belugaField)?.setValue(null, { emitEvent: false });
      }
      if (normalizedName !== 'Sarcastic Fringehead') {
        slot.sarcastic = null;
        this.formGroup
          .get(descriptor.sarcasticField)
          ?.setValue(null, { emitEvent: false });
      }
      if (normalizedName !== 'Parrot') {
        this.clearAbominationParrotCopySettings(pet, slot.index);
      }
    }

    return slots;
  }

  private setPetField(pet: Pet, field: string, value: unknown): void {
    (pet as unknown as Record<string, unknown>)[field] = value;
  }
}
