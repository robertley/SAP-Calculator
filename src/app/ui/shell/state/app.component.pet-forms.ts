import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { Player } from 'app/domain/entities/player.class';
import { Pet } from 'app/domain/entities/pet.class';

export function initPetForms(
  formGroup: FormGroup,
  player: Player,
  opponent: Player,
) {
  const petsDummyArray = [0, 1, 2, 3, 4];
  const buildPetFormGroup = (pet?: Pet) =>
    new FormGroup({
      name: new FormControl(pet?.name),
      attack: new FormControl(pet?.attack ?? 0),
      health: new FormControl(pet?.health ?? 0),
      exp: new FormControl(pet?.exp ?? 0),
      equipment: new FormControl(pet?.equipment?.name ?? null),
      equipmentUses: new FormControl(pet?.equipment?.uses ?? null),
      belugaSwallowedPet: new FormControl(pet?.belugaSwallowedPet),
      parrotCopyPet: new FormControl(pet?.parrotCopyPet ?? null),
      parrotCopyPetBelugaSwallowedPet: new FormControl(
        pet?.parrotCopyPetBelugaSwallowedPet ?? null,
      ),
      parrotCopyPetAbominationSwallowedPet1: new FormControl(
        pet?.parrotCopyPetAbominationSwallowedPet1 ?? null,
      ),
      parrotCopyPetAbominationSwallowedPet2: new FormControl(
        pet?.parrotCopyPetAbominationSwallowedPet2 ?? null,
      ),
      parrotCopyPetAbominationSwallowedPet3: new FormControl(
        pet?.parrotCopyPetAbominationSwallowedPet3 ?? null,
      ),
      parrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet: new FormControl(
        pet?.parrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet ?? null,
      ),
      parrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet: new FormControl(
        pet?.parrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet ?? null,
      ),
      parrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet: new FormControl(
        pet?.parrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet ?? null,
      ),
      parrotCopyPetAbominationSwallowedPet1Level: new FormControl(
        pet?.parrotCopyPetAbominationSwallowedPet1Level ?? 1,
      ),
      parrotCopyPetAbominationSwallowedPet2Level: new FormControl(
        pet?.parrotCopyPetAbominationSwallowedPet2Level ?? 1,
      ),
      parrotCopyPetAbominationSwallowedPet3Level: new FormControl(
        pet?.parrotCopyPetAbominationSwallowedPet3Level ?? 1,
      ),
      parrotCopyPetAbominationSwallowedPet1TimesHurt: new FormControl(
        pet?.parrotCopyPetAbominationSwallowedPet1TimesHurt ?? 0,
      ),
      parrotCopyPetAbominationSwallowedPet2TimesHurt: new FormControl(
        pet?.parrotCopyPetAbominationSwallowedPet2TimesHurt ?? 0,
      ),
      parrotCopyPetAbominationSwallowedPet3TimesHurt: new FormControl(
        pet?.parrotCopyPetAbominationSwallowedPet3TimesHurt ?? 0,
      ),
      parrotCopyPetAbominationSwallowedPet1ParrotCopyPet: new FormControl(
        pet?.parrotCopyPetAbominationSwallowedPet1ParrotCopyPet ?? null,
      ),
      parrotCopyPetAbominationSwallowedPet2ParrotCopyPet: new FormControl(
        pet?.parrotCopyPetAbominationSwallowedPet2ParrotCopyPet ?? null,
      ),
      parrotCopyPetAbominationSwallowedPet3ParrotCopyPet: new FormControl(
        pet?.parrotCopyPetAbominationSwallowedPet3ParrotCopyPet ?? null,
      ),
      parrotCopyPetAbominationSwallowedPet1ParrotCopyPetBelugaSwallowedPet:
        new FormControl(
          pet?.parrotCopyPetAbominationSwallowedPet1ParrotCopyPetBelugaSwallowedPet ??
            null,
        ),
      parrotCopyPetAbominationSwallowedPet2ParrotCopyPetBelugaSwallowedPet:
        new FormControl(
          pet?.parrotCopyPetAbominationSwallowedPet2ParrotCopyPetBelugaSwallowedPet ??
            null,
        ),
      parrotCopyPetAbominationSwallowedPet3ParrotCopyPetBelugaSwallowedPet:
        new FormControl(
          pet?.parrotCopyPetAbominationSwallowedPet3ParrotCopyPetBelugaSwallowedPet ??
            null,
        ),
      parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1:
        new FormControl(
          pet?.parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1 ??
            null,
        ),
      parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2:
        new FormControl(
          pet?.parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2 ??
            null,
        ),
      parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3:
        new FormControl(
          pet?.parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3 ??
            null,
        ),
      parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1:
        new FormControl(
          pet?.parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1 ??
            null,
        ),
      parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2:
        new FormControl(
          pet?.parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2 ??
            null,
        ),
      parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3:
        new FormControl(
          pet?.parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3 ??
            null,
        ),
      parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1:
        new FormControl(
          pet?.parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1 ??
            null,
        ),
      parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2:
        new FormControl(
          pet?.parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2 ??
            null,
        ),
      parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3:
        new FormControl(
          pet?.parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3 ??
            null,
        ),
      parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet:
        new FormControl(
          pet?.parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet ??
            null,
        ),
      parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet:
        new FormControl(
          pet?.parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet ??
            null,
        ),
      parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet:
        new FormControl(
          pet?.parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet ??
            null,
        ),
      parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet:
        new FormControl(
          pet?.parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet ??
            null,
        ),
      parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet:
        new FormControl(
          pet?.parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet ??
            null,
        ),
      parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet:
        new FormControl(
          pet?.parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet ??
            null,
        ),
      parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet:
        new FormControl(
          pet?.parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet ??
            null,
        ),
      parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet:
        new FormControl(
          pet?.parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet ??
            null,
        ),
      parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet:
        new FormControl(
          pet?.parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet ??
            null,
        ),
      parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1Level:
        new FormControl(
          pet?.parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1Level ??
            1,
        ),
      parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2Level:
        new FormControl(
          pet?.parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2Level ??
            1,
        ),
      parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3Level:
        new FormControl(
          pet?.parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3Level ??
            1,
        ),
      parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1Level:
        new FormControl(
          pet?.parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1Level ??
            1,
        ),
      parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2Level:
        new FormControl(
          pet?.parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2Level ??
            1,
        ),
      parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3Level:
        new FormControl(
          pet?.parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3Level ??
            1,
        ),
      parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1Level:
        new FormControl(
          pet?.parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1Level ??
            1,
        ),
      parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2Level:
        new FormControl(
          pet?.parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2Level ??
            1,
        ),
      parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3Level:
        new FormControl(
          pet?.parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3Level ??
            1,
        ),
      parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1TimesHurt:
        new FormControl(
          pet?.parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1TimesHurt ??
            0,
        ),
      parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2TimesHurt:
        new FormControl(
          pet?.parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2TimesHurt ??
            0,
        ),
      parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3TimesHurt:
        new FormControl(
          pet?.parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3TimesHurt ??
            0,
        ),
      parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1TimesHurt:
        new FormControl(
          pet?.parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1TimesHurt ??
            0,
        ),
      parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2TimesHurt:
        new FormControl(
          pet?.parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2TimesHurt ??
            0,
        ),
      parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3TimesHurt:
        new FormControl(
          pet?.parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3TimesHurt ??
            0,
        ),
      parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1TimesHurt:
        new FormControl(
          pet?.parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1TimesHurt ??
            0,
        ),
      parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2TimesHurt:
        new FormControl(
          pet?.parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2TimesHurt ??
            0,
        ),
      parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3TimesHurt:
        new FormControl(
          pet?.parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3TimesHurt ??
            0,
        ),
      sarcasticFringeheadSwallowedPet: new FormControl(),
      mana: new FormControl(pet?.mana ?? 0),
      triggersConsumed: new FormControl(pet?.triggersConsumed ?? 0),
      foodsEaten: new FormControl(pet?.foodsEaten ?? 0),
      abominationSwallowedPet1: new FormControl(pet?.abominationSwallowedPet1),
      abominationSwallowedPet2: new FormControl(pet?.abominationSwallowedPet2),
      abominationSwallowedPet3: new FormControl(pet?.abominationSwallowedPet3),
      abominationSwallowedPet1BelugaSwallowedPet: new FormControl(
        pet?.abominationSwallowedPet1BelugaSwallowedPet ?? null,
      ),
      abominationSwallowedPet2BelugaSwallowedPet: new FormControl(
        pet?.abominationSwallowedPet2BelugaSwallowedPet ?? null,
      ),
      abominationSwallowedPet3BelugaSwallowedPet: new FormControl(
        pet?.abominationSwallowedPet3BelugaSwallowedPet ?? null,
      ),
      abominationSwallowedPet1SarcasticFringeheadSwallowedPet: new FormControl(
        pet?.abominationSwallowedPet1SarcasticFringeheadSwallowedPet ?? null,
      ),
      abominationSwallowedPet2SarcasticFringeheadSwallowedPet: new FormControl(
        pet?.abominationSwallowedPet2SarcasticFringeheadSwallowedPet ?? null,
      ),
      abominationSwallowedPet3SarcasticFringeheadSwallowedPet: new FormControl(
        pet?.abominationSwallowedPet3SarcasticFringeheadSwallowedPet ?? null,
      ),
      abominationSwallowedPet1ParrotCopyPet: new FormControl(
        pet?.abominationSwallowedPet1ParrotCopyPet ?? null,
      ),
      abominationSwallowedPet2ParrotCopyPet: new FormControl(
        pet?.abominationSwallowedPet2ParrotCopyPet ?? null,
      ),
      abominationSwallowedPet3ParrotCopyPet: new FormControl(
        pet?.abominationSwallowedPet3ParrotCopyPet ?? null,
      ),
      abominationSwallowedPet1ParrotCopyPetBelugaSwallowedPet: new FormControl(
        pet?.abominationSwallowedPet1ParrotCopyPetBelugaSwallowedPet ?? null,
      ),
      abominationSwallowedPet2ParrotCopyPetBelugaSwallowedPet: new FormControl(
        pet?.abominationSwallowedPet2ParrotCopyPetBelugaSwallowedPet ?? null,
      ),
      abominationSwallowedPet3ParrotCopyPetBelugaSwallowedPet: new FormControl(
        pet?.abominationSwallowedPet3ParrotCopyPetBelugaSwallowedPet ?? null,
      ),
      abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1:
        new FormControl(
          pet?.abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1 ??
            null,
        ),
      abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2:
        new FormControl(
          pet?.abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2 ??
            null,
        ),
      abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3:
        new FormControl(
          pet?.abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3 ??
            null,
        ),
      abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1:
        new FormControl(
          pet?.abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1 ??
            null,
        ),
      abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2:
        new FormControl(
          pet?.abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2 ??
            null,
        ),
      abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3:
        new FormControl(
          pet?.abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3 ??
            null,
        ),
      abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1:
        new FormControl(
          pet?.abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1 ??
            null,
        ),
      abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2:
        new FormControl(
          pet?.abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2 ??
            null,
        ),
      abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3:
        new FormControl(
          pet?.abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3 ??
            null,
        ),
      abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet:
        new FormControl(
          pet?.abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet ??
            null,
        ),
      abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet:
        new FormControl(
          pet?.abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet ??
            null,
        ),
      abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet:
        new FormControl(
          pet?.abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet ??
            null,
        ),
      abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet:
        new FormControl(
          pet?.abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet ??
            null,
        ),
      abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet:
        new FormControl(
          pet?.abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet ??
            null,
        ),
      abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet:
        new FormControl(
          pet?.abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet ??
            null,
        ),
      abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet:
        new FormControl(
          pet?.abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet ??
            null,
        ),
      abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet:
        new FormControl(
          pet?.abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet ??
            null,
        ),
      abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet:
        new FormControl(
          pet?.abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet ??
            null,
        ),
      abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1Level:
        new FormControl(
          pet?.abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1Level ??
            1,
        ),
      abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2Level:
        new FormControl(
          pet?.abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2Level ??
            1,
        ),
      abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3Level:
        new FormControl(
          pet?.abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3Level ??
            1,
        ),
      abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1Level:
        new FormControl(
          pet?.abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1Level ??
            1,
        ),
      abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2Level:
        new FormControl(
          pet?.abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2Level ??
            1,
        ),
      abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3Level:
        new FormControl(
          pet?.abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3Level ??
            1,
        ),
      abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1Level:
        new FormControl(
          pet?.abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1Level ??
            1,
        ),
      abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2Level:
        new FormControl(
          pet?.abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2Level ??
            1,
        ),
      abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3Level:
        new FormControl(
          pet?.abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3Level ??
            1,
        ),
      abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1TimesHurt:
        new FormControl(
          pet?.abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1TimesHurt ??
            0,
        ),
      abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2TimesHurt:
        new FormControl(
          pet?.abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2TimesHurt ??
            0,
        ),
      abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3TimesHurt:
        new FormControl(
          pet?.abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3TimesHurt ??
            0,
        ),
      abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1TimesHurt:
        new FormControl(
          pet?.abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1TimesHurt ??
            0,
        ),
      abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2TimesHurt:
        new FormControl(
          pet?.abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2TimesHurt ??
            0,
        ),
      abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3TimesHurt:
        new FormControl(
          pet?.abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3TimesHurt ??
            0,
        ),
      abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1TimesHurt:
        new FormControl(
          pet?.abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1TimesHurt ??
            0,
        ),
      abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2TimesHurt:
        new FormControl(
          pet?.abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2TimesHurt ??
            0,
        ),
      abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3TimesHurt:
        new FormControl(
          pet?.abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3TimesHurt ??
            0,
        ),
      abominationSwallowedPet1Level: new FormControl(
        pet?.abominationSwallowedPet1Level ?? 1,
      ),
      abominationSwallowedPet2Level: new FormControl(
        pet?.abominationSwallowedPet2Level ?? 1,
      ),
      abominationSwallowedPet3Level: new FormControl(
        pet?.abominationSwallowedPet3Level ?? 1,
      ),
      abominationSwallowedPet1TimesHurt: new FormControl(
        pet?.abominationSwallowedPet1TimesHurt ?? 0,
      ),
      abominationSwallowedPet2TimesHurt: new FormControl(
        pet?.abominationSwallowedPet2TimesHurt ?? 0,
      ),
      abominationSwallowedPet3TimesHurt: new FormControl(
        pet?.abominationSwallowedPet3TimesHurt ?? 0,
      ),
      friendsDiedBeforeBattle: new FormControl(
        pet?.friendsDiedBeforeBattle ?? 0,
      ),
      battlesFought: new FormControl(pet?.battlesFought ?? 0),
      timesHurt: new FormControl(pet?.timesHurt ?? 0),
    });

  const playerPetFormGroups = petsDummyArray.map((foo) =>
    buildPetFormGroup(player.getPet(foo)),
  );

  const playerFormArray = formGroup.get('playerPets') as FormArray;
  playerFormArray.clear();
  for (const petFormGroup of playerPetFormGroups) {
    playerFormArray.push(petFormGroup);
  }

  const opponentFormGroups = petsDummyArray.map((foo) =>
    buildPetFormGroup(opponent.getPet(foo)),
  );

  const opponentFormArray = formGroup.get('opponentPets') as FormArray;
  opponentFormArray.clear();
  for (const petFormGroup of opponentFormGroups) {
    opponentFormArray.push(petFormGroup);
  }
}