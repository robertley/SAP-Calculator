import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Corncob } from 'app/domain/entities/catalog/equipment/custom/corncob.class';
import { Ambrosia } from 'app/domain/entities/catalog/equipment/unicorn/ambrosia.class';
import { WhiteOkra } from 'app/domain/entities/catalog/equipment/danger/white-okra.class';
import { Strawberry } from 'app/domain/entities/catalog/equipment/star/strawberry.class';
import { Blackberry } from 'app/domain/entities/catalog/equipment/puppy/blackberry.class';
import { Equipment } from '../equipment.class';
import { Player } from '../player.class';
import { PetAbilityFacade } from './pet-ability-facade';

export abstract class PetEquipmentFacade extends PetAbilityFacade {
  protected abstract abilityService: AbilityService;
  protected abstract logService: LogService;
  abstract name: string;
  abstract attack: number;
  abstract health: number;
  abstract level: number;
  abstract alive: boolean;
  abstract parent: Player;
  abstract equipment?: Equipment;
  abstract lastLostEquipment?: Equipment;
  abstract getSparrowLevel(): number;
  abstract increaseAttack(amt: number): void;
  abstract increaseHealth(amt: number): void;

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

    if (
      equipment.equipmentClass == 'ailment-attack' ||
      equipment.equipmentClass == 'ailment-defense' ||
      equipment.equipmentClass == 'ailment-other'
    ) {
      if (this.applyAilmentEquipment(equipment, pandorasBoxLevel)) {
        return;
      }
    } else {
      this.applyStandardEquipment(equipment, pandorasBoxLevel);
    }
  }

  applyEquipment(equipment: Equipment, pandorasBoxLevel: number = 1) {
    if (equipment == null) {
      return;
    }
    this.equipment = equipment;
    this.setEquipmentMultiplier(pandorasBoxLevel);
    this.removeAbility(undefined, 'Equipment');
    if (this.equipment.callback) {
      this.equipment.callback(this.asPet());
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
    this.lastLostEquipment = this.equipment;
    this.removeAbility(undefined, 'Equipment');
    this.equipment = null;

    if (!wasAilment) {
      this.abilityService.triggerPerkLossEvents(
        this.asPet(),
        this.lastLostEquipment?.name,
      );
    }
  }

  setEquipmentMultiplier(pandorasBoxLevel: number = 1) {
    if (!this.equipment) {
      return;
    }

    let baseMultiplier = this.equipment.baseMultiplier ?? 1;
    const configuredMultiplier = this.equipment.multiplier ?? 1;
    if (baseMultiplier === 1 && configuredMultiplier !== 1) {
      baseMultiplier = configuredMultiplier;
    }
    this.equipment.baseMultiplier = baseMultiplier;
    let multiplier = baseMultiplier;
    let messages: string[] = [];

    if (
      this.name === 'Panther' &&
      this.equipment.equipmentClass !== 'ailment-attack' &&
      this.equipment.equipmentClass !== 'ailment-defense' &&
      this.equipment.equipmentClass !== 'ailment-other'
    ) {
      multiplier += this.level;
      messages.push(`x${this.level + 1} (Panther)`);
    }

    if (pandorasBoxLevel && pandorasBoxLevel > 1) {
      multiplier += pandorasBoxLevel - 1;
      messages.push(`x${pandorasBoxLevel} (Pandora's Box)`);
    }

    this.equipment.multiplier = multiplier;
    this.equipment.multiplierMessage =
      messages.length > 0 ? ` ${messages.join(' ')}` : '';
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
    this.abilityService.triggerFoodEvents(this.asPet(), 'corn');
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
    this.abilityService.triggerAilmentGainEvents(this.asPet(), equipment.name);
    return true;
  }

  private applyStandardEquipment(
    equipment: Equipment,
    pandorasBoxLevel: number,
  ): void {
    if (equipment instanceof Blackberry) {
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

    this.abilityService.triggerPerkGainEvents(this.asPet(), equipment.name);
    this.abilityService.triggerFoodEvents(this.asPet(), equipment.name);
  }
}
