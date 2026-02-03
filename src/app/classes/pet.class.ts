import { GameAPI } from 'app/interfaces/gameAPI.interface';
import { LogService } from 'app/services/log.service';
import { Equipment } from './equipment.class';
import { Player } from './player.class';
import { Corncob } from 'app/classes/equipment/custom/corncob.class';
import { AbilityService } from 'app/services/ability/ability.service';
import { Dazed } from 'app/classes/equipment/ailments/dazed.class';
import { Crisp } from 'app/classes/equipment/ailments/crisp.class';
import { Toasty } from 'app/classes/equipment/ailments/toasty.class';
import { Blackberry } from 'app/classes/equipment/puppy/blackberry.class';
import { WhiteOkra } from 'app/classes/equipment/danger/white-okra.class';
import { Ambrosia } from 'app/classes/equipment/unicorn/ambrosia.class';
import { Ability, AbilityTrigger, AbilityType } from 'app/classes/ability.class';
import { minExpForLevel } from 'app/util/leveling';
import { EquipmentDamageHandler } from 'app/classes/equipment/equipment-damage.handler';
import { getRandomInt } from 'app/util/helper-functions';
import { resetPetState } from './pet/pet-state';
import { Log } from 'app/interfaces/log.interface';
import { Strawberry } from 'app/classes/equipment/star/strawberry.class';
import { attackPet as attackPetImpl, calculateDamage as calculateDamageImpl, dealDamage as dealDamageImpl, jumpAttack as jumpAttackImpl, snipePet as snipePetImpl } from './pet/pet-combat';


export type Pack =
  | 'Turtle'
  | 'Puppy'
  | 'Star'
  | 'Golden'
  | 'Unicorn'
  | 'Custom'
  | 'Danger';

export abstract class Pet {
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

  initAbilities() {
    this.initAbilityUses();
    this.setAbilityEquipments();
  }

  abilityValidCheck() {
    if (this.savedPosition == null) {
      return false;
    }

    if (this.equipment instanceof Dazed) {
      this.logService.createLog({
        message: `${this.name}'s ability was not activated because of Dazed.`,
        type: 'ability',
        player: this.parent,
      });
      return false;
    }
    return true;
  }

  resetAbilityUses() {
    // Set initialCurrentUses to 0 for level-up refresh, then reset
    this.abilityList.forEach((ability) => {
      ability.reset();
    });
  }
  initAbilityUses() {
    // Reset usage counters for new ability system
    // Set initialCurrentUses to 0 for level-up refresh, then reset
    this.abilityList.forEach((ability) => {
      ability.initUses();
    });
  }

  attackPet(
    pet: Pet,
    jumpAttack: boolean = false,
    power?: number,
    random: boolean = false,
  ) {
    attackPetImpl(this, pet, jumpAttack, power, random);
  }

  applyCrisp() {
    const parent = this.parent;
    const opponent = parent?.opponent;
    if (!parent || !opponent) {
      return;
    }
    const manticoreMult = opponent.getManticoreMult();
    for (let pet of parent.petArray) {
      if (pet.equipment instanceof Crisp) {
        EquipmentDamageHandler.applyDamage({
          pet,
          baseDamage: 6,
          perkName: 'Crisp',
          manticoreMultipliers: manticoreMult,
          logService: this.logService,
          afterDamage: (target) => target.removePerk(),
        });
      } else if (pet.equipment instanceof Toasty && pet.equipment.uses > 0) {
        EquipmentDamageHandler.applyDamage({
          pet,
          baseDamage: 1,
          perkName: 'Toasty',
          manticoreMultipliers: manticoreMult,
          logService: this.logService,
          afterDamage: (target) => {
            target.equipment.uses--;
            if (target.equipment.uses <= 0) {
              target.removePerk();
            }
          },
        });
      }
    }
  }

  /**
   *
   * @param pet
   * @param power
   * @param randomEvent
   * @param tiger
   * @param pteranodon
   * @param equipment
   * @param mana
   * @returns damage amount
   */
  snipePet(
    pet: Pet,
    power: number,
    randomEvent?: boolean,
    tiger?: boolean,
    pteranodon?: boolean,
    equipment?: boolean,
    mana?: boolean,
    logVerb?: 'sniped' | 'attacked',
    basePowerForLog?: number,
  ) {
    return snipePetImpl(
      this,
      pet,
      power,
      randomEvent,
      tiger,
      pteranodon,
      equipment,
      mana,
      logVerb,
      basePowerForLog,
    );
  }

  calculateDamage(
    pet: Pet,
    manticoreMult: number[],
    power?: number,
    snipe = false,
  ): {
    defenseEquipment: Equipment;
    attackEquipment: Equipment;
    damage: number;
    fortuneCookie: boolean;
    nurikabe: number;
    fairyBallReduction?: number;
    fanMusselReduction?: number;
    mapleSyrupReduction?: number;
    ghostKittenReduction?: number;
  } {
    return calculateDamageImpl(this, pet, manticoreMult, power, snipe);
  }

  resetPet() {
    resetPetState(this);
  }
  jumpAttackPrep(target: Pet) {
    // Trigger and execute before attack abilities on jumping pet and target
    this.abilityService.triggerBeforeAttackEvent(this);
    this.abilityService.triggerBeforeAttackEvent(target);
    this.abilityService.executeBeforeAttackEvents();
  }
  // Jump attack method for abilities that attack and then advance turn
  jumpAttack(
    target: Pet,
    tiger?: boolean,
    damage?: number,
    randomEvent: boolean = false,
  ) {
    jumpAttackImpl(this, target, tiger, damage, randomEvent);
  }

  get alive(): boolean {
    return this.health > 0;
  }

  setFaintEventIfPresent() {
    this.abilityService.triggerFaintEvents(this);
    // Add manaSnipe handling with all original logic
    if (this.mana > 0) {
      if (this.suppressManaSnipeOnFaint) {
        return;
      }
      this.abilityService.setManaEvent({
        priority: this.attack,
        callback: (
          trigger,
          abilityTrigger,
          gameApi: GameAPI,
          triggerPet?: Pet,
        ) => {
          if (this.mana == 0) {
            return;
          }
          if (this.kitsuneCheck()) {
            return;
          }
          // Get target using proper opponent logic
          const opponent = this.parent.opponent;
          const targetResp = opponent.getRandomPet(
            [],
            false,
            true,
            false,
            this,
          );

          if (targetResp.pet == null) {
            return;
          }
          // Execute snipe with all original parameters
          this.snipePet(
            targetResp.pet,
            this.mana,
            targetResp.random,
            false,
            false,
            false,
            true,
          );
          this.mana = 0;
        },
        pet: this,
        triggerPet: this,
        tieBreaker: Math.random(),
      });
    }
  }

  useDefenseEquipment(snipe = false) {
    if (!this.canConsumeDefenseEquipment(snipe)) {
      return;
    }
    this.equipment.uses -= 1;
    if (this.equipment.uses == 0) {
      this.removePerk();
    }
  }

  useAttackDefenseEquipment() {
    if (!this.canConsumeAttackDefenseEquipment()) {
      return;
    }
    this.equipment.uses -= 1;
    if (this.equipment.uses == 0) {
      this.removePerk();
    }
  }

  private canConsumeDefenseEquipment(snipe: boolean): boolean {
    if (!this.equipment) {
      return false;
    }
    if (
      this.equipment.equipmentClass == 'ailment-defense' ||
      this.equipment.name == 'Icky'
    ) {
      // allowed
    } else if (
      this.equipment.equipmentClass != 'defense' &&
      this.equipment.equipmentClass != 'shield' &&
      snipe &&
      this.equipment.equipmentClass != 'shield-snipe'
    ) {
      return false;
    }
    if (this.equipment.uses == null) {
      return false;
    }
    if (this.equipment.name === 'Strawberry') {
      if (this.getSparrowLevel() <= 0 || this.equipment.uses <= 0) {
        return false;
      }
    }
    return true;
  }

  private canConsumeAttackDefenseEquipment(): boolean {
    if (!this.equipment) {
      return false;
    }
    if (this.equipment.uses == null) {
      return false;
    }
    if (this.equipment.name === 'Strawberry') {
      if (this.getSparrowLevel() <= 0 || this.equipment.uses <= 0) {
        return false;
      }
    }
    if (
      this.equipment.equipmentClass != 'attack' &&
      this.equipment.equipmentClass != 'defense' &&
      this.equipment.equipmentClass != 'shield' &&
      this.equipment.equipmentClass != 'snipe' &&
      this.equipment.equipmentClass != 'ailment-attack' &&
      this.equipment.equipmentClass != 'ailment-defense' &&
      this.equipment.name != 'Icky'
    ) {
      return false;
    }
    if (isNaN(this.equipment.uses)) {
      console.warn('uses is NaN', this.equipment);
    }
    return true;
  }

  increaseAttack(amt) {
    let max = 50;
    if (this.name == 'Behemoth') {
      max = 100;
    }
    if (amt > 0 && this.equipment?.name === 'Sad') {
      return;
    }
    if (!this.alive) {
      return;
    }
    this.attack = Math.min(Math.max(this.attack + amt, 1), max);
  }

  increaseHealth(amt: number) {
    let max = 50;
    if (this.name == 'Behemoth' || this.name == 'Giant Tortoise') {
      max = 100;
    }
    if (amt > 0 && this.equipment?.name === 'Sad') {
      return;
    }
    if (!this.alive) {
      return;
    }
    this.health = Math.min(Math.max(this.health + amt, 1), max);

    this.abilityService.triggerFriendGainsHealthEvents(this);
  }

  increaseSellValue(amt: number) {
    if (amt <= 0) {
      return;
    }
    this.sellValue += amt;
  }

  dealDamage(pet: Pet, damage: number) {
    if (damage > 0 && this.equipment?.name === 'Kiwano') {
      damage += 8;
      this.logService.createLog({
        message: `${this.name} added +8 damage. (Kiwano)`,
        type: 'equipment',
        player: this.parent,
      });
      this.removePerk();
    }
    dealDamageImpl(this, pet, damage);
  }

  triggerHurtEventsFor(pet: Pet, damage: number): void {
    this.abilityService.triggerHurtEvents(pet, damage);
  }

  triggerKillEventsFor(pet: Pet): void {
    this.abilityService.triggerKillEvents(this, pet);
  }

  triggerAttackEventsFor(): void {
    this.abilityService.triggerAttacksEvents(this);
  }

  executeAfterAttackEvents(): void {
    this.abilityService.executeAfterAttackEvents();
  }

  triggerJumpEventsFor(): void {
    this.abilityService.triggerJumpEvents(this);
  }

  createLog(entry: Log): void {
    this.logService.createLog(entry);
  }

  increaseExp(amt) {
    let level = this.level;
    this.increaseAttack(amt);
    this.increaseHealth(amt);
    this.exp = Math.min(this.exp + amt, 5);
    let timesLevelled = this.level - level;
    if (timesLevelled > 0) {
      this.baseSellValue += timesLevelled;
      this.sellValue += timesLevelled;
    }
    for (let i = 0; i < timesLevelled; i++) {
      this.logService.createLog({
        message: `${this.name} leveled up to level ${this.level}.`,
        type: 'ability',
        player: this.parent,
      });
      this.abilityService.triggerLevelUpEvents(this);
      //TO DO: THis needs change
      this.abilityService.executeFriendlyLevelUpToyEvents();
      this.resetAbilityUses();
    }
    for (let i = 0; i < Math.min(amt, 5); i++) {
      this.abilityService.triggerFriendGainedExperienceEvents(this);
    }
  }

  increaseMana(amt) {
    this.mana += amt;
    this.mana = Math.min(this.mana, 50);
    this.abilityService.triggerManaGainedEvents(this);
  }

  givePetEquipment(equipment: Equipment, pandorasBoxLevel: number = 1) {
    if (equipment == null) {
      console.warn(
        `givePetEquipment called with null equipment for pet: ${this.name}`,
      );
      return;
    }
    if (!this.alive) {
      return;
    }
    if (
      this.equipment?.name === 'Bloated' &&
      !equipment.equipmentClass?.startsWith('ailment')
    ) {
      this.logService.createLog({
        message: `${this.name} blocked gaining ${equipment.name}. (Bloated)`,
        type: 'equipment',
        player: this.parent,
      });
      this.removePerk();
      return;
    }

    if (this.handleCorncobEquipment(equipment)) {
      return;
    }

    // Handle ailments with Ambrosia or White Okra blocking
    if (
      equipment.equipmentClass == 'ailment-attack' ||
      equipment.equipmentClass == 'ailment-defense' ||
      equipment.equipmentClass == 'ailment-other'
    ) {
      if (this.applyAilmentEquipment(equipment, pandorasBoxLevel)) {
        return;
      }
    }
    // Handle standard equipment
    else {
      this.applyStandardEquipment(equipment, pandorasBoxLevel);
    }
  }

  private handleCorncobEquipment(equipment: Equipment): boolean {
    if (equipment.name !== 'Corncob') {
      return false;
    }
    const cob = equipment as Corncob;
    const multiplier = Math.max(1, Math.floor(cob.effectMultiplier ?? 1));
    if (this.attack <= this.health) {
      this.increaseAttack(multiplier);
    } else {
      this.increaseHealth(multiplier);
    }
    this.abilityService.triggerFoodEvents(this, 'corn');
    return true;
  }

  private applyAilmentEquipment(
    equipment: Equipment,
    pandorasBoxLevel: number,
  ): boolean {
    if (this.equipment?.name === equipment.name) {
      return true;
    }
    if (this.equipment instanceof Ambrosia) {
      this.equipment.uses--;
      this.logService.createLog({
        message: `${this.name} blocked ${equipment.name}. (Ambrosia)`,
        type: 'equipment',
        player: this.parent,
      });
      if (this.equipment.uses == 0) {
        this.removePerk();
      }
      return true;
    }
    if (this.equipment instanceof WhiteOkra) {
      this.logService.createLog({
        message: `${this.name} blocked ${equipment.name}. (White Okra)`,
        type: 'equipment',
        player: this.parent,
      });
      // Remove equipment immediately after blocking ailment
      this.removePerk();
      return true;
    }
    if (
      this.equipment instanceof Strawberry &&
      this.getSparrowLevel() > 0 &&
      this.equipment.uses > 0
    ) {
      this.logService.createLog({
        message: `${this.name} blocked ${equipment.name}. (Strawberry)`,
        type: 'equipment',
        player: this.parent,
      });
      this.removePerk();
      return true;
    }
    if (this.equipment != null) {
      this.removePerk(true);
    }
    this.applyEquipment(equipment, pandorasBoxLevel);
    this.abilityService.triggerAilmentGainEvents(this, equipment.name);
    return true;
  }

  private applyStandardEquipment(
    equipment: Equipment,
    pandorasBoxLevel: number,
  ): void {
    if (equipment instanceof Blackberry) {
      // Apply equipment first to get multiplier
      this.applyEquipment(equipment, pandorasBoxLevel);

      const attackGain = 1 * equipment.multiplier;
      const healthGain = 2 * equipment.multiplier;
      this.increaseAttack(attackGain);
      this.increaseHealth(healthGain);
      this.logService.createLog({
        message: `${this.name} gained ${attackGain} attack and ${healthGain} health (Blackberry)${equipment.multiplierMessage}`,
        type: 'equipment',
        player: this.parent,
      });
    } else {
      this.applyEquipment(equipment, pandorasBoxLevel);
    }

    this.abilityService.triggerPerkGainEvents(this, equipment.name);
    this.abilityService.triggerFoodEvents(this, equipment.name);
  }

  applyEquipment(equipment: Equipment, pandorasBoxLevel: number = 1) {
    if (equipment == null) {
      return;
    }
    this.equipment = equipment;
    this.setEquipmentMultiplier(pandorasBoxLevel);
    this.removeAbility(undefined, 'Equipment');
    if (this.equipment.callback) {
      this.equipment.callback(this);
    }
  }

  removePerk(perkOnly: boolean = false) {
    if (this.equipment == null) {
      return;
    }

    let wasAilment =
      this.equipment.equipmentClass == 'ailment-attack' ||
      this.equipment.equipmentClass == 'ailment-defense' ||
      this.equipment.equipmentClass == 'ailment-other';

    if (perkOnly && wasAilment) {
      return;
    }
    // Store the lost equipment before removing it
    this.lastLostEquipment = this.equipment;

    // Remove equipment-based abilities from new system
    this.removeAbility(undefined, 'Equipment');

    this.equipment = null;

    // Only trigger friendLostPerk events for perks, not ailments
    if (!wasAilment) {
      this.abilityService.triggerPerkLossEvents(
        this,
        this.lastLostEquipment?.name,
      );
    }
  }

  setEquipmentMultiplier(pandorasBoxLevel: number = 1) {
    if (!this.equipment) {
      return;
    }

    const baseMultiplier =
      this.equipment.baseMultiplier ?? this.equipment.multiplier ?? 1;
    this.equipment.baseMultiplier = baseMultiplier;
    let multiplier = baseMultiplier;
    let messages: string[] = [];

    // Panther multiplies equipment effects based on level
    if (
      this.name === 'Panther' &&
      this.equipment.equipmentClass !== 'ailment-attack' &&
      this.equipment.equipmentClass !== 'ailment-defense' &&
      this.equipment.equipmentClass !== 'ailment-other'
    ) {
      multiplier += this.level;
      messages.push(`x${this.level + 1} (Panther)`);
    }

    // Pandora's Box multiplies equipment effects based on toy level
    if (pandorasBoxLevel && pandorasBoxLevel > 1) {
      multiplier += pandorasBoxLevel - 1;
      messages.push(`x${pandorasBoxLevel} (Pandora's Box)`);
    }

    // Set the multiplier properties
    this.equipment.multiplier = multiplier;
    this.equipment.multiplierMessage =
      messages.length > 0 ? ` ${messages.join(' ')}` : '';
  }

  get level(): number {
    if (this.exp < 2) {
      return 1;
    }
    if (this.exp < 5) {
      return 2;
    }
    return 3;
  }

  get position(): number {
    const parent = this.parent;
    if (!parent) {
      return this.savedPosition;
    }
    if (this == parent.pet0) {
      return 0;
    }
    if (this == parent.pet1) {
      return 1;
    }
    if (this == parent.pet2) {
      return 2;
    }
    if (this == parent.pet3) {
      return 3;
    }
    if (this == parent.pet4) {
      return 4;
    }
    return this.savedPosition;
  }

  /**
   *
   * @param seenDead if true, consider pets that are not seenDead. if the pet is dead, but not seen(checked), return null.
   * @returns
   */
  petBehind(seenDead = false, deadOrAlive = false): Pet {
    if (!this.parent) {
      return null;
    }
    let currentPosition =
      this.position !== undefined ? this.position : this.savedPosition;
    for (let i = currentPosition + 1; i < 5; i++) {
      let pet = this.parent.getPetAtPosition(i);
      if (deadOrAlive) {
        if (pet != null) {
          return pet;
        }
      }
      if (seenDead) {
        if (pet != null) {
          if (!pet.alive && !pet.seenDead) {
            return null;
          }
        }
      }
      if (pet != null && pet.alive) {
        return pet;
      }
    }
    return null;
  }

  getManticoreMult(): number[] {
    const parent = this.parent;
    if (!parent || !parent.petArray) {
      return [];
    }
    let mult = [];
    for (let pet of parent.petArray) {
      if (pet.name == 'Manticore') {
        mult.push(pet.level);
      }
    }

    return mult;
  }

  getSparrowLevel(): number {
    const parent = this.parent;
    if (!parent || !Array.isArray(parent.petArray)) {
      return 0;
    }
    let highestLevel = 0;
    for (let pet of parent.petArray) {
      if (pet.name == 'Sparrow') {
        highestLevel = Math.max(highestLevel, pet.level);
      }
    }
    return highestLevel;
  }

  private getSillyRandomTargets(amt: number, excludeEquipment?: string): Pet[] {
    if (!this.parent?.opponent) {
      return [];
    }
    const equipment = this.equipment as unknown;
    const sillyActive =
      (typeof equipment === 'string' && equipment === 'Silly') ||
      (equipment &&
        typeof (equipment as { name?: string }).name === 'string' &&
        (equipment as { name?: string }).name === 'Silly');
    if (!sillyActive) {
      return [];
    }

    const candidates = [
      ...this.parent.petArray,
      ...this.parent.opponent.petArray,
    ].filter((pet) => {
      if (!pet.alive || pet === this) {
        return false;
      }
      if (excludeEquipment && pet.equipment?.name === excludeEquipment) {
        return false;
      }
      return true;
    });

    const targets: Pet[] = [];
    const pool = [...candidates];
    while (targets.length < amt && pool.length > 0) {
      const index = getRandomInt(0, pool.length - 1);
      targets.push(pool.splice(index, 1)[0]);
    }
    return targets;
  }

  getPetsBehind(amt: number, excludeEquipment?: string): Pet[] {
    const sillyTargets = this.getSillyRandomTargets(amt, excludeEquipment);
    if (sillyTargets.length > 0) {
      return sillyTargets;
    }

    let targetsBehind = [];
    let petBehind = this.petBehind();
    // Skip pets that already have the excluded equipment
    if (
      excludeEquipment &&
      petBehind &&
      petBehind.equipment?.name === excludeEquipment
    ) {
      petBehind = petBehind.petBehind();
    }
    while (petBehind) {
      if (targetsBehind.length >= amt) {
        break;
      }
      targetsBehind.push(petBehind);
      petBehind = petBehind.petBehind();
    }
    return targetsBehind;
  }

  kitsuneCheck(): boolean {
    let petBehind = this.petBehind();
    let first = true;
    while (petBehind) {
      if (petBehind.name == 'Kitsune' && first) {
        return false;
      }
      first = false;
      if (petBehind.name == 'Kitsune') {
        return true;
      }
      petBehind = petBehind.petBehind();
    }
    return false;
  }

  get petAhead(): Pet {
    const parent = this.parent;
    if (!parent) {
      return null;
    }
    const start =
      this.position !== undefined ? this.position : this.savedPosition;
    for (let i = start - 1; i > -1; i--) {
      let pet = parent.getPetAtPosition(i);
      if (pet != null && pet.alive) {
        return pet;
      }
    }
    return null;
  }

  get minExpForLevel(): number {
    return minExpForLevel(this.level);
  }
  //need to set when gave perk too
  setAbilityEquipments() {
    if (this.equipment?.name == 'Eggplant') {
      this.equipment.callback(this);
      this.eggplantTouched = true;
    } else if (this.equipment?.callback) {
      this.equipment.callback(this);
    }
  }



  getEquippedEquipmentInstance<T extends Equipment>(fallback: T): T {
    return ((this.equipment as T) ?? fallback);
  }
  // New Ability System Methods

  addAbility(ability: Ability): void {
    this.abilityList.push(ability);
  }

  removeAbility(abilityName?: string, abilityType?: AbilityType): boolean {
    const initialLength = this.abilityList.length;

    this.abilityList = this.abilityList.filter((ability) => {
      if (abilityName && ability.name === abilityName) return false;
      if (abilityType && ability.abilityType === abilityType) return false;
      if (!abilityName && !abilityType) return false; // Remove all if no criteria
      return true;
    });

    return this.abilityList.length < initialLength;
  }

  getAbilities(trigger?: AbilityTrigger, abilityType?: AbilityType): Ability[] {
    return this.abilityList.filter((ability) => {
      if (trigger && !ability.matchesTrigger(trigger)) return false;
      if (abilityType && ability.abilityType !== abilityType) return false;
      return true;
    });
  }
  getAbilitiesWithTrigger(
    trigger?: AbilityTrigger,
    abilityType?: AbilityType,
    abilityName?: string,
  ): Ability[] {
    return this.abilityList.filter((ability) => {
      if ((trigger && !ability.matchesTrigger(trigger)) || !ability.canUse())
        return false;
      if (abilityType && ability.abilityType !== abilityType) return false;
      if (abilityName && ability.name !== abilityName) return false;
      return true;
    });
  }
  executeAbilities(
    trigger: AbilityTrigger,
    gameApi: GameAPI,
    triggerPet?: Pet,
    tiger?: boolean,
    pteranodon?: boolean,
    customParams?: any,
  ): void {
    // If this pet has already transformed before this trigger fires, re-run the trigger on the current form
    if (this.transformed && this.transformedInto) {
      this.transformedInto.executeAbilities(
        trigger,
        gameApi,
        triggerPet,
        tiger,
        pteranodon,
        customParams,
      );
      return;
    }

    const matchingPetAbilities = this.getAbilitiesWithTrigger(trigger, 'Pet');
    for (const ability of matchingPetAbilities) {
      ability.execute(gameApi, triggerPet, tiger, pteranodon, customParams);
      // If this ability caused a transform, stop executing further abilities on the old form and re-run the trigger once on the new form
      if (this.transformed && this.transformedInto) {
        this.transformedInto.executeAbilities(
          trigger,
          gameApi,
          triggerPet,
          tiger,
          pteranodon,
          customParams,
        );
        return;
      }
    }

    const matchingEquipmentAbilities = this.getAbilitiesWithTrigger(
      trigger,
      'Equipment',
    );
    for (const ability of matchingEquipmentAbilities) {
      ability.execute(gameApi, triggerPet, tiger, pteranodon, customParams);
      if (this.transformed && this.transformedInto) {
        this.transformedInto.executeAbilities(
          trigger,
          gameApi,
          triggerPet,
          tiger,
          pteranodon,
          customParams,
        );
        return;
      }
    }
  }
  activateAbilities(
    trigger: AbilityTrigger,
    gameApi: GameAPI,
    type: AbilityType,
    triggerPet?: Pet,
    customParams?: any,
  ): void {
    const matchingAbilities = this.getAbilities(trigger, type);

    // Execute abilities in order (maintains ability list order within pet)
    for (const ability of matchingAbilities) {
      ability.execute(gameApi, triggerPet, undefined, undefined, customParams);
    }
  }

  copyAbilities(
    sourcePet: Pet,
    abilityType?: AbilityType,
    level?: number,
  ): void {
    const abilitiesToCopy = sourcePet.getAbilities(undefined, abilityType);
    this.removeAbility(undefined, abilityType);
    for (const ability of abilitiesToCopy) {
      const copiedAbility = ability.copy(this);
      if (copiedAbility == null) {
        continue;
      }
      if (level) {
        copiedAbility.abilityLevel = level;
        copiedAbility.alwaysIgnorePetLevel = true;
        copiedAbility.reset();
      }
      copiedAbility.native = false;

      // Wrap ability function to show "Owner's SourcePet" in logs
      const originalFunction = copiedAbility.abilityFunction;
      const sourcePetName = sourcePet.name;
      copiedAbility.abilityFunction = (context) => {
        const originalName = this.name;
        const baseName = this.baseName ?? originalName;
        this.name = `${baseName}'s ${sourcePetName}`;
        try {
          originalFunction(context);
        } finally {
          this.name = originalName;
        }
      };

      this.addAbility(copiedAbility);
    }
  }
  gainAbilities(
    sourcePet: Pet,
    abilityType?: AbilityType,
    level?: number,
  ): void {
    const abilitiesToCopy = sourcePet.getAbilities(undefined, abilityType);
    for (const ability of abilitiesToCopy) {
      const copiedAbility = ability.copy(this);
      if (copiedAbility == null) {
        continue;
      }
      if (level) {
        copiedAbility.abilityLevel = level;
        copiedAbility.alwaysIgnorePetLevel = true;
        copiedAbility.reset();
      }
      copiedAbility.native = false;

      // Wrap ability function to show "Owner's SourcePet" in logs
      const originalFunction = copiedAbility.abilityFunction;
      const sourcePetName = sourcePet.name;
      copiedAbility.abilityFunction = (context) => {
        const originalName = this.name;
        const baseName = this.baseName ?? originalName;
        this.name = `${baseName}'s ${sourcePetName}`;
        try {
          originalFunction(context);
        } finally {
          this.name = originalName;
        }
      };

      this.addAbility(copiedAbility);
    }
  }

  hasAbility(trigger: AbilityTrigger, abilityType?: AbilityType): boolean {
    return this.getAbilities(trigger, abilityType).length > 0;
  }

  hasTrigger(
    trigger?: AbilityTrigger,
    abilityType?: AbilityType,
    abilityName?: string,
  ): boolean {
    return (
      this.getAbilitiesWithTrigger(trigger, abilityType, abilityName).length > 0
    );
  }

  isSellPet(): boolean {
    let sellPets = [
      'Beaver',
      'Duck',
      'Pig',
      'Pillbug',
      'Kiwi',
      'Mouse',
      'Frog',
      'Bass',
      'Tooth Billed Pigeon',
      'Marmoset',
      'Capybara',
      'Platypus',
    ];
    if (
      sellPets.includes(this.name) ||
      this.originalAbilityList.filter((ability) => {
        return (
          ability.matchesTrigger('ThisSold') && ability.abilityType == 'Pet'
        );
      }).length > 0
    ) {
      return true;
    }
    return false;
  }
  isFaintPet(): boolean {
    if (
      this.originalAbilityList.filter((ability) => {
        return (
          (ability.matchesTrigger('PostRemovalFaint') ||
            ability.matchesTrigger('Faint')) &&
          ability.abilityType == 'Pet'
        );
      }).length > 0
    ) {
      return true;
    }
    return false;
  }
}

