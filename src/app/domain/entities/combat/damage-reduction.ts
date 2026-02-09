import type { Pet } from '../pet.class';
import type { Equipment } from '../equipment.class';

export interface DamageReductionResult {
  damage: number;
  fairyBallReduction: number;
  nurikabe: number;
  fanMusselReduction: number;
  ghostKittenReduction: number;
}

export function applyManticoreMultiplier(
  baseMultiplier: number,
  equipmentName: string | undefined,
  manticoreMult: number[],
  affectedAilments: string[],
): number {
  if (!equipmentName || !affectedAilments.includes(equipmentName)) {
    return baseMultiplier;
  }

  let multiplier = baseMultiplier;
  for (const mult of manticoreMult) {
    multiplier += mult;
  }
  return multiplier;
}

export function applyIckyMultiplier(
  basePower: number,
  equipment: Equipment | null | undefined,
  manticoreMult: number[],
): number {
  if (equipment?.name !== 'Icky') {
    return basePower;
  }

  let totalMultiplier = 2;
  for (const mult of manticoreMult) {
    totalMultiplier += mult;
  }
  totalMultiplier += (equipment.multiplier ?? 1) - 1;
  return basePower * totalMultiplier;
}

export function applyDamageReductions(
  pet: Pet,
  startingDamage: number,
  options?: {
    includeGhostKitten?: boolean;
    fairyMinimumOne?: boolean;
    fairyRequiresPositiveDamage?: boolean;
    nurikabeConsumesOnZeroHit?: boolean;
    fanMusselConsumesOnZeroHit?: boolean;
  },
): DamageReductionResult {
  const includeGhostKitten = options?.includeGhostKitten ?? false;
  const fairyMinimumOne = options?.fairyMinimumOne ?? false;
  const fairyRequiresPositiveDamage = options?.fairyRequiresPositiveDamage ?? true;
  const nurikabeConsumesOnZeroHit =
    options?.nurikabeConsumesOnZeroHit ?? false;
  const fanMusselConsumesOnZeroHit =
    options?.fanMusselConsumesOnZeroHit ?? false;

  let workingDamage = startingDamage;
  let fairyBallReduction = 0;
  let nurikabe = 0;
  let fanMusselReduction = 0;
  let ghostKittenReduction = 0;

  const shouldApplyFairy =
    !fairyRequiresPositiveDamage || workingDamage > 0;
  if (pet.hasTrigger(undefined, 'Pet', 'FairyAbility') && shouldApplyFairy) {
    for (const ability of pet.abilityList) {
      if (ability.name == 'FairyAbility') {
        const reduction = ability.level * 2;
        fairyBallReduction += reduction;
        workingDamage = Math.max(0, workingDamage - reduction);
      }
    }
    if (fairyMinimumOne && workingDamage < 1) {
      workingDamage = 1;
    }
  }

  const shouldApplyNurikabe =
    pet.hasTrigger(undefined, 'Pet', 'NurikabeAbility') &&
    (workingDamage > 0 ||
      (nurikabeConsumesOnZeroHit && startingDamage <= 0));
  if (shouldApplyNurikabe) {
    for (const ability of pet.abilityList) {
      if (ability.name == 'NurikabeAbility') {
        const reduction = ability.level * 4;
        nurikabe += reduction;
        if (workingDamage > 0) {
          workingDamage = Math.max(0, workingDamage - reduction);
        }
        ability.currentUses++;
      }
    }
  }

  const shouldApplyFanMussel =
    pet.hasTrigger(undefined, 'Pet', 'FanMusselAbility') &&
    (workingDamage > 0 ||
      (fanMusselConsumesOnZeroHit && startingDamage <= 0));
  if (shouldApplyFanMussel) {
    for (const ability of pet.abilityList) {
      if (ability.name == 'FanMusselAbility') {
        const reduction = ability.level;
        fanMusselReduction += reduction;
        if (workingDamage > 0) {
          workingDamage = Math.max(0, workingDamage - reduction);
        }
        ability.currentUses++;
      }
    }
  }

  if (
    includeGhostKitten &&
    pet.hasTrigger(undefined, 'Pet', 'GhostKittenAbility') &&
    workingDamage > 0
  ) {
    for (const ability of pet.abilityList) {
      if (ability.name == 'GhostKittenAbility') {
        const reduction = ability.level * 3;
        ghostKittenReduction += reduction;
        workingDamage = Math.max(0, workingDamage - reduction);
      }
    }
  }

  return {
    damage: workingDamage,
    fairyBallReduction,
    nurikabe,
    fanMusselReduction,
    ghostKittenReduction,
  };
}
