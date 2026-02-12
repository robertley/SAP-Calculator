import { Directive } from '@angular/core';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import {
  PARROT_COPY_ABOMINATION_PARROT_FIELDS,
  PARROT_COPY_ABOMINATION_SWALLOWED_FIELDS,
} from './pet-selector.constants';
import { PetSelectorSwallowing } from './pet-selector-swallowing';
import { PetForm } from 'app/integrations/pet/pet-factory.service';

function buildAbominationParrotCopyControlNames(): string[] {
  const controls: string[] = [];
  for (let outer = 1; outer <= 3; outer++) {
    const outerBase = `abominationSwallowedPet${outer}`;
    controls.push(
      `${outerBase}ParrotCopyPet`,
      `${outerBase}ParrotCopyPetBelugaSwallowedPet`,
    );
    for (let inner = 1; inner <= 3; inner++) {
      const innerBase = `${outerBase}ParrotCopyPetAbominationSwallowedPet${inner}`;
      controls.push(
        innerBase,
        `${innerBase}BelugaSwallowedPet`,
        `${innerBase}Level`,
        `${innerBase}TimesHurt`,
      );
    }
  }
  return controls;
}

const ABOMINATION_PARROT_COPY_FIELDS = buildAbominationParrotCopyControlNames();

type PetFormValue = {
  attack?: unknown;
  health?: unknown;
  mana?: unknown;
  triggersConsumed?: unknown;
  foodsEaten?: unknown;
  equipment?: unknown;
  [key: string]: unknown;
};

@Directive()
export class PetSelectorFormSubscriptions extends PetSelectorSwallowing {
  protected initForm() {
    const inputDebounceMs = 0;

    this.formGroup
      .get('name')
      .valueChanges.pipe(takeUntil(this.destroy$), distinctUntilChanged())
      .subscribe((value) => {
        this.petImageBroken = false;
        if (value == null) {
          this.removePet();
          return;
        }
        this.substitutePet(true);
      });

    this.subscribeDebouncedStat('attack', 0, 100);
    this.subscribeDebouncedStat('health', 0, 100);

    this.formGroup
      .get('exp')
      .valueChanges.pipe(takeUntil(this.destroy$), distinctUntilChanged())
      .subscribe(() => {
        this.substitutePet(false);
      });

    const equipmentUsesControl = this.formGroup.get('equipmentUses');
    this.formGroup
      .get('equipment')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.equipmentImageBroken = false;
        const equipmentName = this.normalizeEquipmentValue(value);
        if (equipmentName !== value) {
          this.formGroup
            .get('equipment')
            .setValue(equipmentName, { emitEvent: false });
        }
        if (!equipmentName) {
          equipmentUsesControl?.setValue(null, { emitEvent: false });
        }
        this.substitutePet(false);
      });

    this.formGroup
      .get('equipmentUses')
      ?.valueChanges.pipe(
        takeUntil(this.destroy$),
        debounceTime(inputDebounceMs),
        distinctUntilChanged(),
      )
      .subscribe(() => this.substitutePet(false));

    this.subscribeControl('belugaSwallowedPet', (value) =>
      this.setBelugaSwallow(value),
    );
    this.subscribeControl('parrotCopyPet', (value) => this.setParrotCopyPet(value));
    this.subscribeControl('parrotCopyPetBelugaSwallowedPet', (value) =>
      this.setParrotCopyPetBelugaSwallowedPet(value),
    );
    this.subscribeControls(PARROT_COPY_ABOMINATION_SWALLOWED_FIELDS, (value) =>
      this.setParrotCopyPetAbominationSwallowedPets(value),
    );
    this.subscribeControls(PARROT_COPY_ABOMINATION_PARROT_FIELDS, (value) =>
      this.setParrotCopyPetAbominationParrotSettings(value),
    );

    this.subscribeControl('sarcasticFringeheadSwallowedPet', (value) =>
      this.setSarcasticFringeheadSwallowedPet(value),
    );

    this.subscribeControls(
      [
        'abominationSwallowedPet1',
        'abominationSwallowedPet2',
        'abominationSwallowedPet3',
        'abominationSwallowedPet1BelugaSwallowedPet',
        'abominationSwallowedPet2BelugaSwallowedPet',
        'abominationSwallowedPet3BelugaSwallowedPet',
        'abominationSwallowedPet1Level',
        'abominationSwallowedPet2Level',
        'abominationSwallowedPet3Level',
        'abominationSwallowedPet1TimesHurt',
        'abominationSwallowedPet2TimesHurt',
        'abominationSwallowedPet3TimesHurt',
      ],
      (value) => this.setSwallowedPets(value),
    );

    this.subscribeControls(ABOMINATION_PARROT_COPY_FIELDS, (value) =>
      this.setAbominationParrotCopySettings(value),
    );

    this.subscribeDebouncedStat('mana', 0, 50);
    this.subscribeDebouncedStat('triggersConsumed', 0, 10);
    this.subscribeDebouncedStat('foodsEaten', 0, 99);

    this.formGroup
      .get('friendsDiedBeforeBattle')
      ?.valueChanges.pipe(
        takeUntil(this.destroy$),
        debounceTime(inputDebounceMs),
        distinctUntilChanged(),
      )
      .subscribe(() => {
        this.clampFriendsDiedBeforeBattle();
        this.substitutePet(false);
      });

    this.formGroup
      .get('battlesFought')
      .valueChanges.pipe(
        takeUntil(this.destroy$),
        debounceTime(inputDebounceMs),
        distinctUntilChanged(),
      )
      .subscribe((value) => {
        this.setBattlesFought(value);
      });

    this.formGroup
      .get('timesHurt')
      .valueChanges.pipe(
        takeUntil(this.destroy$),
        debounceTime(inputDebounceMs),
        distinctUntilChanged(),
      )
      .subscribe((value) => {
        this.setTimesHurt(value);
      });
  }

  private subscribeDebouncedStat(
    controlName: string,
    min: number,
    max: number,
  ): void {
    this.formGroup
      .get(controlName)
      ?.valueChanges.pipe(
        takeUntil(this.destroy$),
        debounceTime(0),
        distinctUntilChanged(),
      )
      .subscribe(() => {
        this.clampControl(controlName, min, max);
        this.substitutePet(false);
      });
  }

  private subscribeControl(
    controlName: string,
    onValue: (value: string | null) => void,
  ): void {
    this.formGroup
      .get(controlName)
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => onValue((value ?? null) as string | null));
  }

  private subscribeControls(
    controlNames: string[],
    onValue: (value: string | null) => void,
  ): void {
    for (const controlName of controlNames) {
      this.subscribeControl(controlName, onValue);
    }
  }

  substitutePet(nameChange = false) {
    setTimeout(() => {
      let formValue = this.formGroup.getRawValue() as PetFormValue;
      if (nameChange) {
        this.formGroup.get('attack').setValue(null, { emitEvent: false });
        this.formGroup.get('health').setValue(null, { emitEvent: false });
        this.formGroup.get('mana').setValue(null, { emitEvent: false });
        this.formGroup
          .get('triggersConsumed')
          .setValue(null, { emitEvent: false });
        this.formGroup.get('foodsEaten').setValue(null, { emitEvent: false });
        formValue = this.formGroup.getRawValue() as PetFormValue;
      }
      this.applyStatCaps(formValue);
      formValue.equipment = this.normalizeEquipmentValue(formValue.equipment);

      let pet = this.petService.createPet(
        formValue as unknown as PetForm,
        this.player,
      );
      this.player.setPet(this.index, pet, true);
      this.pet = pet;
      this.cdr.markForCheck();

      if (nameChange) {
        this.formGroup.get('attack').setValue(pet.attack, { emitEvent: false });
        this.formGroup.get('health').setValue(pet.health, { emitEvent: false });
        this.formGroup.get('mana').setValue(pet.mana, { emitEvent: false });
        this.formGroup
          .get('triggersConsumed')
          .setValue(pet.triggersConsumed, { emitEvent: false });
        this.formGroup
          .get('foodsEaten')
          .setValue(pet.foodsEaten ?? 0, { emitEvent: false });
        this.cdr.markForCheck();
      }
    });
  }

  protected applyStatCaps(formValue: PetFormValue) {
    const attack = this.clampValue(formValue.attack, 0, 100);
    const health = this.clampValue(formValue.health, 0, 100);
    const mana = this.clampValue(formValue.mana, 0, 50);
    const triggers = this.clampValue(formValue.triggersConsumed, 0, 10);
    const foodsEaten = this.clampValue(formValue.foodsEaten, 0, 99);

    if (attack !== formValue.attack && formValue.attack != null) {
      this.formGroup.get('attack').setValue(attack, { emitEvent: false });
      formValue.attack = attack;
    }
    if (health !== formValue.health && formValue.health != null) {
      this.formGroup.get('health').setValue(health, { emitEvent: false });
      formValue.health = health;
    }
    if (mana !== formValue.mana && formValue.mana != null) {
      this.formGroup.get('mana').setValue(mana, { emitEvent: false });
      formValue.mana = mana;
    }
    if (
      triggers !== formValue.triggersConsumed &&
      formValue.triggersConsumed != null
    ) {
      this.formGroup
        .get('triggersConsumed')
        .setValue(triggers, { emitEvent: false });
      formValue.triggersConsumed = triggers;
    }
    if (foodsEaten !== formValue.foodsEaten && formValue.foodsEaten != null) {
      this.formGroup
        .get('foodsEaten')
        .setValue(foodsEaten, { emitEvent: false });
      formValue.foodsEaten = foodsEaten;
    }
  }

  protected clampControl(controlName: string, min: number, max: number) {
    const control = this.formGroup.get(controlName);
    if (!control) {
      return;
    }
    const rawValue = control.value;
    const clamped = this.clampValue(rawValue, min, max);
    if (clamped !== rawValue && rawValue != null && rawValue !== '') {
      control.setValue(clamped, { emitEvent: false });
    }
  }

  protected clampValue(value: unknown, min: number, max: number) {
    if (value == null || value === '') {
      return value;
    }
    const numeric = Number(value);
    if (Number.isNaN(numeric)) {
      return value;
    }
    return Math.min(max, Math.max(min, numeric));
  }

  removePet() {
    this.player.setPet(this.index, null, true);
    this.formGroup.get('name').setValue(null, { emitEvent: false });
    this.formGroup.get('attack').setValue(0, { emitEvent: false });
    this.formGroup.get('health').setValue(0, { emitEvent: false });
    this.formGroup.get('exp').setValue(0, { emitEvent: false });
    this.formGroup.get('equipment').setValue(null, { emitEvent: false });
    this.formGroup.get('equipmentUses').setValue(null, { emitEvent: false });
    this.formGroup.get('mana').setValue(0, { emitEvent: false });
    this.formGroup.get('triggersConsumed').setValue(0, { emitEvent: false });
    this.formGroup.get('foodsEaten').setValue(0, { emitEvent: false });
  }

  protected clampFriendsDiedBeforeBattle() {
    const max = this.getFriendsDiedMax();
    this.clampControl('friendsDiedBeforeBattle', 0, max);
  }

  private getFriendsDiedMax(): number {
    const name = this.formGroup.get('name').value;
    return this.friendsDiedCaps.get(name) ?? 5;
  }
}
