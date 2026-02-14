import { Directive } from '@angular/core';
import { Pet } from 'app/domain/entities/pet.class';
import { PARROT_COPY_ABOMINATION_SWALLOWED_FIELDS } from './pet-selector.constants';
import { PetSelectorPackFiltering } from './pet-selector-pack-filtering';

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
    const name = control?.value;
    return name === 'Sabertooth Tiger' || name === 'Tuna';
  }

  setParrotCopyPetAbominationSwallowedPets(_value: unknown) {
    let pet = this.player.getPet(this.index);
    if (pet == null) {
      return;
    }
    const pet1 = this.formGroup.get(
      'parrotCopyPetAbominationSwallowedPet1',
    )?.value;
    const pet2 = this.formGroup.get(
      'parrotCopyPetAbominationSwallowedPet2',
    )?.value;
    const pet3 = this.formGroup.get(
      'parrotCopyPetAbominationSwallowedPet3',
    )?.value;
    const beluga1 =
      this.formGroup.get(
        'parrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet',
      )?.value ?? null;
    const beluga2 =
      this.formGroup.get(
        'parrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet',
      )?.value ?? null;
    const beluga3 =
      this.formGroup.get(
        'parrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet',
      )?.value ?? null;
    const level1 = Number(
      this.formGroup.get('parrotCopyPetAbominationSwallowedPet1Level')?.value ??
      1,
    );
    const level2 = Number(
      this.formGroup.get('parrotCopyPetAbominationSwallowedPet2Level')?.value ??
      1,
    );
    const level3 = Number(
      this.formGroup.get('parrotCopyPetAbominationSwallowedPet3Level')?.value ??
      1,
    );

    pet.parrotCopyPetAbominationSwallowedPet1 = pet1 ?? null;
    pet.parrotCopyPetAbominationSwallowedPet2 = pet2 ?? null;
    pet.parrotCopyPetAbominationSwallowedPet3 = pet3 ?? null;
    pet.parrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet =
      pet1 === 'Beluga Whale' ? beluga1 : null;
    pet.parrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet =
      pet2 === 'Beluga Whale' ? beluga2 : null;
    pet.parrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet =
      pet3 === 'Beluga Whale' ? beluga3 : null;
    if (pet1 !== 'Beluga Whale') {
      this.formGroup
        .get('parrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet')
        ?.setValue(null, { emitEvent: false });
    }
    if (pet2 !== 'Beluga Whale') {
      this.formGroup
        .get('parrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet')
        ?.setValue(null, { emitEvent: false });
    }
    if (pet3 !== 'Beluga Whale') {
      this.formGroup
        .get('parrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet')
        ?.setValue(null, { emitEvent: false });
    }
    pet.parrotCopyPetAbominationSwallowedPet1Level = level1 || 1;
    pet.parrotCopyPetAbominationSwallowedPet2Level = level2 || 1;
    pet.parrotCopyPetAbominationSwallowedPet3Level = level3 || 1;
    pet.parrotCopyPetAbominationSwallowedPet1TimesHurt =
      this.getParrotAbominationTimesHurtValue(
        'parrotCopyPetAbominationSwallowedPet1TimesHurt',
      );
    pet.parrotCopyPetAbominationSwallowedPet2TimesHurt =
      this.getParrotAbominationTimesHurtValue(
        'parrotCopyPetAbominationSwallowedPet2TimesHurt',
      );
    pet.parrotCopyPetAbominationSwallowedPet3TimesHurt =
      this.getParrotAbominationTimesHurtValue(
        'parrotCopyPetAbominationSwallowedPet3TimesHurt',
      );
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
    const name = control?.value;
    return name === 'Sabertooth Tiger' || name === 'Tuna';
  }

  shouldShowParrotCopyPetAbominationTimesHurt(index: number): boolean {
    const control = this.formGroup.get(
      `parrotCopyPetAbominationSwallowedPet${index + 1}`,
    );
    const name = control?.value;
    return name === 'Sabertooth Tiger' || name === 'Tuna';
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

    pet.abominationSwallowedPet1 = slots[0].name;
    pet.abominationSwallowedPet2 = slots[1].name;
    pet.abominationSwallowedPet3 = slots[2].name;
    pet.abominationSwallowedPet1BelugaSwallowedPet = slots[0].beluga;
    pet.abominationSwallowedPet2BelugaSwallowedPet = slots[1].beluga;
    pet.abominationSwallowedPet3BelugaSwallowedPet = slots[2].beluga;
    pet.abominationSwallowedPet1Level = slots[0].level;
    pet.abominationSwallowedPet2Level = slots[1].level;
    pet.abominationSwallowedPet3Level = slots[2].level;
    pet.abominationSwallowedPet1TimesHurt = this.getAbominationTimesHurtValue(
      'abominationSwallowedPet1TimesHurt',
    );
    pet.abominationSwallowedPet2TimesHurt = this.getAbominationTimesHurtValue(
      'abominationSwallowedPet2TimesHurt',
    );
    pet.abominationSwallowedPet3TimesHurt = this.getAbominationTimesHurtValue(
      'abominationSwallowedPet3TimesHurt',
    );
    this.setAbominationParrotCopySettings(null);
    this.substitutePet(false);
  }

  shouldShowAbominationSwallowTimesHurt(index: number): boolean {
    const control = this.formGroup.get(`abominationSwallowedPet${index + 1}`);
    const name = control?.value;
    return name === 'Sabertooth Tiger' || name === 'Tuna';
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
    index: 1 | 2 | 3;
    name: string | null;
    beluga: string | null;
    level: number;
  }> {
    const slots: Array<{
      index: 1 | 2 | 3;
      name: string | null;
      beluga: string | null;
      level: number;
    }> = [
      {
        index: 1,
        name: this.formGroup.get('abominationSwallowedPet1')?.value ?? null,
        beluga:
          this.formGroup.get('abominationSwallowedPet1BelugaSwallowedPet')
            ?.value ?? null,
        level: Number(this.formGroup.get('abominationSwallowedPet1Level')?.value ?? 1) || 1,
      },
      {
        index: 2,
        name: this.formGroup.get('abominationSwallowedPet2')?.value ?? null,
        beluga:
          this.formGroup.get('abominationSwallowedPet2BelugaSwallowedPet')
            ?.value ?? null,
        level: Number(this.formGroup.get('abominationSwallowedPet2Level')?.value ?? 1) || 1,
      },
      {
        index: 3,
        name: this.formGroup.get('abominationSwallowedPet3')?.value ?? null,
        beluga:
          this.formGroup.get('abominationSwallowedPet3BelugaSwallowedPet')
            ?.value ?? null,
        level: Number(this.formGroup.get('abominationSwallowedPet3Level')?.value ?? 1) || 1,
      },
    ];

    for (const slot of slots) {
      const normalizedName =
        typeof slot.name === 'string' && slot.name.trim().length > 0
          ? slot.name
          : null;
      slot.name = normalizedName;

      if (!normalizedName) {
        slot.beluga = null;
        this.formGroup
          .get(`abominationSwallowedPet${slot.index}BelugaSwallowedPet`)
          ?.setValue(null, { emitEvent: false });
        this.clearAbominationParrotCopySettings(pet, slot.index);
        continue;
      }

      if (normalizedName !== 'Beluga Whale') {
        slot.beluga = null;
        this.formGroup
          .get(`abominationSwallowedPet${slot.index}BelugaSwallowedPet`)
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
