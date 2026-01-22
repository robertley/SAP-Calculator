import { LogService } from 'app/services/log.service';
import type { Pet } from '../pet.class';
import type { Equipment } from '../equipment.class';

export interface EquipmentDamageOptions {
  pet: Pet;
  baseDamage: number;
  perkName: string;
  manticoreMultipliers: number[];
  logService: LogService;
  afterDamage?: (pet: Pet) => void;
}

interface AbilityReductionConfig {
  name: string;
  label: string;
  perLevel: number;
  incrementUses?: boolean;
}

const ABILITY_REDUCTION_CONFIGS: AbilityReductionConfig[] = [
  { name: 'FairyAbility', label: 'FairyBall', perLevel: 2 },
  {
    name: 'NurikabeAbility',
    label: 'Nurikabe',
    perLevel: 4,
    incrementUses: true,
  },
  {
    name: 'FanMusselAbility',
    label: 'Fan Mussel',
    perLevel: 1,
    incrementUses: true,
  },
  { name: 'GhostKittenAbility', label: 'Ghost Kitten', perLevel: 3 },
];

export class EquipmentDamageHandler {
  static applyDamage(options: EquipmentDamageOptions): void {
    const {
      pet,
      baseDamage,
      perkName,
      manticoreMultipliers,
      logService,
      afterDamage,
    } = options;
    const equipment = pet.equipment;
    if (!equipment) {
      return;
    }

    let totalMultiplier = equipment.multiplier;
    for (let mult of manticoreMultipliers) {
      totalMultiplier += mult;
    }

    let damage = baseDamage * totalMultiplier;
    const reductionResult = this.applyAbilityReductions(pet, damage);
    const finalDamage = reductionResult.damage;

    const message = this.buildLogMessage({
      pet,
      finalDamage,
      equipment,
      perkName,
      reductions: reductionResult.reductions,
      manticoreMultipliers,
    });

    logService.createLog({
      message,
      type: 'ability',
      player: pet.parent,
    });

    pet.dealDamage(pet, finalDamage);

    if (afterDamage) {
      afterDamage(pet);
    }
  }

  private static applyAbilityReductions(
    pet: Pet,
    damage: number,
  ): {
    damage: number;
    reductions: { label: string; amount: number }[];
  } {
    let remainingDamage = damage;
    const reductions: { label: string; amount: number }[] = [];

    for (const config of ABILITY_REDUCTION_CONFIGS) {
      if (remainingDamage <= 0) {
        break;
      }
      if (!pet.hasTrigger(undefined, 'Pet', config.name)) {
        continue;
      }
      let totalReduction = 0;
      for (const ability of pet.abilityList) {
        if (ability.name !== config.name) {
          continue;
        }
        const reduction = ability.level * config.perLevel;
        if (reduction === 0) {
          continue;
        }
        totalReduction += reduction;
        remainingDamage = Math.max(0, remainingDamage - reduction);
        if (config.incrementUses) {
          ability.currentUses++;
        }
      }
      if (totalReduction > 0) {
        reductions.push({ label: config.label, amount: totalReduction });
      }
    }

    return { damage: remainingDamage, reductions };
  }

  private static buildLogMessage(args: {
    pet: Pet;
    finalDamage: number;
    equipment: Equipment;
    perkName: string;
    reductions: { label: string; amount: number }[];
    manticoreMultipliers: number[];
  }): string {
    let message = `${args.pet.name} took ${args.finalDamage} damage`;

    if (args.manticoreMultipliers.length > 0) {
      for (const mult of args.manticoreMultipliers) {
        message += ` x${mult + 1} (Manticore)`;
      }
    }

    if (args.equipment.multiplier > 1) {
      message += args.equipment.multiplierMessage;
    }

    for (const reduction of args.reductions) {
      message += ` -${reduction.amount} (${reduction.label})`;
    }

    message += ` (${args.perkName}).`;

    return message;
  }
}
