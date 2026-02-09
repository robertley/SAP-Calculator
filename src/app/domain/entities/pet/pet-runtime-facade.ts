import { GameAPI } from 'app/domain/interfaces/gameAPI.interface';
import { Log } from 'app/domain/interfaces/log.interface';
import { Dazed } from 'app/domain/entities/catalog/equipment/ailments/dazed.class';
import { Crisp } from 'app/domain/entities/catalog/equipment/ailments/crisp.class';
import { Toasty } from 'app/domain/entities/catalog/equipment/ailments/toasty.class';
import { EquipmentDamageHandler } from 'app/domain/entities/combat/equipment-damage.handler';
import {
  attackPet as attackPetImpl,
  calculateDamage as calculateDamageImpl,
  dealDamage as dealDamageImpl,
  jumpAttack as jumpAttackImpl,
  snipePet as snipePetImpl,
} from '../combat/pet-combat';
import { resetPetState } from '../combat/pet-state';
import { Equipment } from '../equipment.class';
import type { Pet } from '../pet.class';
import { PetTargetingRuntimeFacade } from './pet-targeting-runtime-facade';

export abstract class PetRuntimeFacade extends PetTargetingRuntimeFacade {
  [key: string]: any;

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
    this.abilityList.forEach((ability: any) => {
      ability.reset();
    });
  }

  initAbilityUses() {
    this.abilityList.forEach((ability: any) => {
      ability.initUses();
    });
  }

  attackPet(
    pet: Pet,
    jumpAttack: boolean = false,
    power?: number,
    random: boolean = false,
  ) {
    attackPetImpl(this as any, pet as any, jumpAttack, power, random);
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
      this as any,
      pet as any,
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
    return calculateDamageImpl(this as any, pet as any, manticoreMult, power, snipe);
  }

  resetPet() {
    resetPetState(this as any);
  }

  jumpAttackPrep(target: Pet) {
    this.abilityService.triggerBeforeAttackEvent(this as unknown as Pet);
    this.abilityService.triggerBeforeAttackEvent(target);
    this.abilityService.executeBeforeAttackEvents();
  }

  jumpAttack(
    target: Pet,
    tiger?: boolean,
    damage?: number,
    randomEvent: boolean = false,
  ) {
    jumpAttackImpl(this as any, target as any, tiger, damage, randomEvent);
  }

  get alive(): boolean {
    return this.health > 0;
  }

  setFaintEventIfPresent() {
    this.abilityService.triggerFaintEvents(this as unknown as Pet);
    if (this.mana > 0) {
      if (this.suppressManaSnipeOnFaint) {
        return;
      }
      this.abilityService.setManaEvent({
        priority: this.attack,
        callback: (
          _trigger: any,
          _abilityTrigger: any,
          _gameApi: GameAPI,
          _triggerPet?: Pet,
        ) => {
          if (this.mana == 0) {
            return;
          }
          if (this.kitsuneCheck()) {
            return;
          }
          const opponent = this.parent.opponent;
          const targetResp = opponent.getRandomPet([], false, true, false, this);

          if (targetResp.pet == null) {
            return;
          }
          this.snipePet(targetResp.pet, this.mana, targetResp.random, false, false, false, true);
          this.mana = 0;
        },
        pet: this as unknown as Pet,
        triggerPet: this as unknown as Pet,
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

  increaseAttack(amt: number) {
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
    this.abilityService.triggerFriendGainsHealthEvents(this as unknown as Pet);
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
    dealDamageImpl(this as any, pet as any, damage);
  }

  triggerHurtEventsFor(pet: Pet, damage: number): void {
    this.abilityService.triggerHurtEvents(pet, damage);
  }

  triggerKillEventsFor(pet: Pet): void {
    this.abilityService.triggerKillEvents(this as unknown as Pet, pet);
  }

  triggerAttackEventsFor(): void {
    this.abilityService.triggerAttacksEvents(this as unknown as Pet);
  }

  executeAfterAttackEvents(): void {
    this.abilityService.executeAfterAttackEvents();
  }

  triggerJumpEventsFor(): void {
    this.abilityService.triggerJumpEvents(this as unknown as Pet);
  }

  createLog(entry: Log): void {
    this.logService.createLog(entry);
  }

  increaseExp(amt: number) {
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
      this.abilityService.triggerLevelUpEvents(this as unknown as Pet);
      this.abilityService.executeFriendlyLevelUpToyEvents();
      this.resetAbilityUses();
    }
    for (let i = 0; i < Math.min(amt, 5); i++) {
      this.abilityService.triggerFriendGainedExperienceEvents(
        this as unknown as Pet,
      );
    }
  }

  increaseMana(amt: number) {
    this.mana += amt;
    this.mana = Math.min(this.mana, 50);
    this.abilityService.triggerManaGainedEvents(this as unknown as Pet);
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

}
