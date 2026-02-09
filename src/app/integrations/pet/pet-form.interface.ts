import { Equipment } from 'app/domain/entities/equipment.class';

export interface PetForm {
  name: string;
  attack?: number | null;
  health?: number | null;
  mana?: number | null;
  triggersConsumed?: number;
  foodsEaten?: number;
  exp: number;
  hasRandomEvents?: boolean;
  equipment?: string | Equipment | { name?: string } | null;
  belugaSwallowedPet?: string;
  parrotCopyPet?: string;
  parrotCopyPetBelugaSwallowedPet?: string;
  parrotCopyPetAbominationSwallowedPet1?: string | null;
  parrotCopyPetAbominationSwallowedPet2?: string | null;
  parrotCopyPetAbominationSwallowedPet3?: string | null;
  parrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet?: string | null;
  parrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet?: string | null;
  parrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet?: string | null;
  parrotCopyPetAbominationSwallowedPet1Level?: number;
  parrotCopyPetAbominationSwallowedPet2Level?: number;
  parrotCopyPetAbominationSwallowedPet3Level?: number;
  parrotCopyPetAbominationSwallowedPet1TimesHurt?: number;
  parrotCopyPetAbominationSwallowedPet2TimesHurt?: number;
  parrotCopyPetAbominationSwallowedPet3TimesHurt?: number;
  parrotCopyPetAbominationSwallowedPet1ParrotCopyPet?: string | null;
  parrotCopyPetAbominationSwallowedPet2ParrotCopyPet?: string | null;
  parrotCopyPetAbominationSwallowedPet3ParrotCopyPet?: string | null;
  parrotCopyPetAbominationSwallowedPet1ParrotCopyPetBelugaSwallowedPet?:
    | string
    | null;
  parrotCopyPetAbominationSwallowedPet2ParrotCopyPetBelugaSwallowedPet?:
    | string
    | null;
  parrotCopyPetAbominationSwallowedPet3ParrotCopyPetBelugaSwallowedPet?:
    | string
    | null;
  parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1?:
    | string
    | null;
  parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2?:
    | string
    | null;
  parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3?:
    | string
    | null;
  parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1?:
    | string
    | null;
  parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2?:
    | string
    | null;
  parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3?:
    | string
    | null;
  parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1?:
    | string
    | null;
  parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2?:
    | string
    | null;
  parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3?:
    | string
    | null;
  parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet?:
    | string
    | null;
  parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet?:
    | string
    | null;
  parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet?:
    | string
    | null;
  parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet?:
    | string
    | null;
  parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet?:
    | string
    | null;
  parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet?:
    | string
    | null;
  parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet?:
    | string
    | null;
  parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet?:
    | string
    | null;
  parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet?:
    | string
    | null;
  parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1Level?: number;
  parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2Level?: number;
  parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3Level?: number;
  parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1Level?: number;
  parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2Level?: number;
  parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3Level?: number;
  parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1Level?: number;
  parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2Level?: number;
  parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3Level?: number;
  parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1TimesHurt?: number;
  parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2TimesHurt?: number;
  parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3TimesHurt?: number;
  parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1TimesHurt?: number;
  parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2TimesHurt?: number;
  parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3TimesHurt?: number;
  parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1TimesHurt?: number;
  parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2TimesHurt?: number;
  parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3TimesHurt?: number;
  sarcasticFringeheadSwallowedPet?: string;
  abominationSwallowedPet1?: string;
  abominationSwallowedPet2?: string;
  abominationSwallowedPet3?: string;
  abominationSwallowedPet1BelugaSwallowedPet?: string | null;
  abominationSwallowedPet2BelugaSwallowedPet?: string | null;
  abominationSwallowedPet3BelugaSwallowedPet?: string | null;
  abominationSwallowedPet1ParrotCopyPet?: string | null;
  abominationSwallowedPet2ParrotCopyPet?: string | null;
  abominationSwallowedPet3ParrotCopyPet?: string | null;
  abominationSwallowedPet1ParrotCopyPetBelugaSwallowedPet?: string | null;
  abominationSwallowedPet2ParrotCopyPetBelugaSwallowedPet?: string | null;
  abominationSwallowedPet3ParrotCopyPetBelugaSwallowedPet?: string | null;
  abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1?: string | null;
  abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2?: string | null;
  abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3?: string | null;
  abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1?: string | null;
  abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2?: string | null;
  abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3?: string | null;
  abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1?: string | null;
  abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2?: string | null;
  abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3?: string | null;
  abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet?:
    | string
    | null;
  abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet?:
    | string
    | null;
  abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet?:
    | string
    | null;
  abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet?:
    | string
    | null;
  abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet?:
    | string
    | null;
  abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet?:
    | string
    | null;
  abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet?:
    | string
    | null;
  abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet?:
    | string
    | null;
  abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet?:
    | string
    | null;
  abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1Level?: number;
  abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2Level?: number;
  abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3Level?: number;
  abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1Level?: number;
  abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2Level?: number;
  abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3Level?: number;
  abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1Level?: number;
  abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2Level?: number;
  abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3Level?: number;
  abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1TimesHurt?: number;
  abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2TimesHurt?: number;
  abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3TimesHurt?: number;
  abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1TimesHurt?: number;
  abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2TimesHurt?: number;
  abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3TimesHurt?: number;
  abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1TimesHurt?: number;
  abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2TimesHurt?: number;
  abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3TimesHurt?: number;
  abominationSwallowedPet1Level?: number;
  abominationSwallowedPet2Level?: number;
  abominationSwallowedPet3Level?: number;
  abominationSwallowedPet1TimesHurt?: number;
  abominationSwallowedPet2TimesHurt?: number;
  abominationSwallowedPet3TimesHurt?: number;
  battlesFought?: number;
  timesHurt?: number;
  friendsDiedBeforeBattle?: number;
  equipmentUses?: number;
}
