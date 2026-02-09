import { LogService } from 'app/integrations/log.service';
import { Equipment } from './equipment.class';
import { Player } from './player.class';
import { AbilityService } from 'app/integrations/ability/ability.service';
import { Ability } from 'app/domain/entities/ability.class';
import { PetRuntimeFacade } from './pet/pet-runtime-facade';


export type Pack =
  | 'Turtle'
  | 'Puppy'
  | 'Star'
  | 'Golden'
  | 'Unicorn'
  | 'Custom'
  | 'Danger';

export abstract class Pet extends PetRuntimeFacade {
  name: string;
  baseName: string;
  tier: number;
  pack: Pack;
  hidden: boolean = false;
  parent: Player;
  health: number;
  attack: number;
  exp?: number = 0;
  equipment?: Equipment;
  mana: number = 0;
  suppressManaSnipeOnFaint: boolean = false;
  triggersConsumed: number = 0;
  foodsEaten: number = 0;
  sellValue: number = 1;
  baseSellValue: number = 1;
  //memories
  swallowedPets?: Pet[] = [];
  abominationSwallowedPet1?: string;
  abominationSwallowedPet2?: string;
  abominationSwallowedPet3?: string;
  abominationSwallowedPet1BelugaSwallowedPet?: string;
  abominationSwallowedPet2BelugaSwallowedPet?: string;
  abominationSwallowedPet3BelugaSwallowedPet?: string;
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
  abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1TimesHurt: number = 0;
  abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2TimesHurt: number = 0;
  abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3TimesHurt: number = 0;
  abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1TimesHurt: number = 0;
  abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2TimesHurt: number = 0;
  abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3TimesHurt: number = 0;
  abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1TimesHurt: number = 0;
  abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2TimesHurt: number = 0;
  abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3TimesHurt: number = 0;
  abominationSwallowedPet1Level?: number;
  abominationSwallowedPet2Level?: number;
  abominationSwallowedPet3Level?: number;
  abominationSwallowedPet1TimesHurt: number = 0;
  abominationSwallowedPet2TimesHurt: number = 0;
  abominationSwallowedPet3TimesHurt: number = 0;
  belugaSwallowedPet: string | null = null;
  parrotCopyPet: string | null = null;
  parrotCopyPetBelugaSwallowedPet: string | null = null;
  parrotCopyPetAbominationSwallowedPet1?: string | null;
  parrotCopyPetAbominationSwallowedPet2?: string | null;
  parrotCopyPetAbominationSwallowedPet3?: string | null;
  parrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet?: string | null;
  parrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet?: string | null;
  parrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet?: string | null;
  parrotCopyPetAbominationSwallowedPet1Level?: number;
  parrotCopyPetAbominationSwallowedPet2Level?: number;
  parrotCopyPetAbominationSwallowedPet3Level?: number;
  parrotCopyPetAbominationSwallowedPet1TimesHurt: number = 0;
  parrotCopyPetAbominationSwallowedPet2TimesHurt: number = 0;
  parrotCopyPetAbominationSwallowedPet3TimesHurt: number = 0;
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
  parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1TimesHurt: number = 0;
  parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2TimesHurt: number = 0;
  parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3TimesHurt: number = 0;
  parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1TimesHurt: number = 0;
  parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2TimesHurt: number = 0;
  parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3TimesHurt: number = 0;
  parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1TimesHurt: number = 0;
  parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2TimesHurt: number = 0;
  parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3TimesHurt: number = 0;
  sarcasticFringeheadSwallowedPet?: string;
  friendsDiedBeforeBattle: number = 0;
  timesHurt: number = 0;
  timesAttacked: number = 0;
  battlesFought: number = 0;
  currentTarget?: Pet; // Who this pet is currently attacking
  lastAttacker?: Pet; // Who last attacked this pet //TO DO: This might be useless
  killedBy?: Pet; // Who caused this pet to faint
  transformedInto: Pet | null = null;
  lastLostEquipment?: Equipment;
  abilityCounter: number = 0;
  targettedFriends: Set<Pet> = new Set();

  originalHealth: number;
  originalAttack: number;
  originalMana: number;
  originalTriggersConsumed: number;
  originalFoodsEaten: number;
  originalEquipment?: Equipment;
  originalExp?: number = 0;
  originalTimesHurt: number = 0;

  //flags
  faintPet: boolean = false;
  toyPet = false;
  transformed: boolean = false;
  removed: boolean = false;
  startOfBattleTriggered: boolean = false;
  jumped: boolean = false;
  // flags to make sure events/logs are not triggered multiple times
  done = false;
  seenDead = false;
  // fixes bug where eggplant ability is triggered multiple times
  // if we already set eggplant ability make sure not to set it again
  eggplantTouched = false;
  cherryTouched = false;
  clearFrontTriggered = false;
  //ability memory
  maxAbilityUses: number = null;

  // New ability system
  abilityList: Ability[] = [];
  originalAbilityList: Ability[] = [];

  savedPosition: 0 | 1 | 2 | 3 | 4;
  originalSavedPosition?: 0 | 1 | 2 | 3 | 4;
  hasRandomEvents: boolean = false;

  constructor(
    protected logService: LogService,
    protected abilityService: AbilityService,
    parent: Player,
  ) {
    super();
    this.parent = parent;
  }

  initPet(
    exp?: number,
    health?: number,
    attack?: number,
    mana?: number,
    equipment?: Equipment,
    triggersConsumed?: number,
  ) {
    this.baseName = this.baseName ?? this.name;
    const expValue = exp ?? this.exp ?? 0;
    this.exp = expValue;
    this.health = health ?? this.health + expValue;
    this.attack = attack ?? this.attack + expValue;
    this.mana = mana ?? this.mana;
    this.triggersConsumed = triggersConsumed ?? this.triggersConsumed;
    this.originalHealth = this.health;
    this.originalAttack = this.attack;
    this.originalMana = this.mana;
    this.originalTriggersConsumed = this.triggersConsumed;
    this.originalFoodsEaten = this.foodsEaten;
    this.equipment = equipment;
    this.originalEquipment = equipment;
    this.originalExp = this.exp;
    this.baseSellValue = this.level;
    this.sellValue = this.baseSellValue;

    this.initAbilities();

    // Save complete ability list after full initialization (pet + equipment abilities)
    this.originalAbilityList = [...this.abilityList];
  }

}








