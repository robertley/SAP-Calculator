import { LogService } from 'app/integrations/log.service';
import { Equipment } from './equipment.class';
import { Player } from './player.class';
import { AbilityService } from 'app/integrations/ability/ability.service';
import { Ability } from 'app/domain/entities/ability.class';
import { PetMemoryState } from 'app/domain/interfaces/pet-memory.interface';
import { PetRuntimeFacade } from './pet/pet-runtime-facade';
import { installLogServiceFallback } from 'app/runtime/log-service-fallback';


export type Pack =
  | 'Turtle'
  | 'Puppy'
  | 'Star'
  | 'Golden'
  | 'Unicorn'
  | 'Custom'
  | 'Danger';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export abstract class Pet extends PetRuntimeFacade implements PetMemoryState {
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
  equipmentUsesOverride?: number | null;
  mana: number = 0;
  suppressManaSnipeOnFaint: boolean = false;
  triggersConsumed: number = 0;
  foodsEaten: number = 0;
  sellValue: number = 1;
  baseSellValue: number = 1;
  // Memory-heavy swallowed/copy state is typed in PetMemoryState.
  swallowedPets?: Pet[] = [];
  belugaSwallowedPet: string | null = null;
  parrotCopyPet: string | null = null;
  parrotCopyPetBelugaSwallowedPet: string | null = null;
  sarcasticFringeheadSwallowedPet?: string | null;
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
    installLogServiceFallback(this);
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

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging, no-redeclare
export interface Pet extends PetMemoryState {}








