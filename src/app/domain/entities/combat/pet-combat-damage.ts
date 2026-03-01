import type { Pet } from '../pet.class';
import { Equipment } from '../equipment.class';
import { Salt } from 'app/domain/entities/catalog/equipment/puppy/salt.class';
import { Cheese } from 'app/domain/entities/catalog/equipment/star/cheese.class';
import { FortuneCookie } from 'app/domain/entities/catalog/equipment/custom/fortune-cookie.class';
import { Pepper } from 'app/domain/entities/catalog/equipment/star/pepper.class';
import { Guava, GuavaAttack } from 'app/domain/entities/catalog/equipment/custom/guava.class';
import { MapleSyrup, MapleSyrupAttack } from 'app/domain/entities/catalog/equipment/golden/maple-syrup.class';
import {
  HoneydewMelon,
  HoneydewMelonAttack,
} from 'app/domain/entities/catalog/equipment/golden/honeydew-melon.class';
import {
  applyDamageReductions,
  applyManticoreMultiplier,
} from './damage-reduction';
import {
  calculateIncomingDamageBeforeReductions,
  prepareDefenseForIncomingDamage,
} from './defense-damage-calculation';
import { chooseRandomOption } from 'app/runtime/random-decision-state';
import { getRandomInt } from 'app/runtime/random';

export type CombatDamageResponse = {
  defenseEquipment: Equipment | null;
  attackEquipment: Equipment | null;
  damage: number;
  fortuneCookie: boolean;
  nurikabe: number;
  fairyBallReduction?: number;
  fanMusselReduction?: number;
  mapleSyrupReduction?: number;
  ghostKittenReduction?: number;
};

export function calculateDamage(
  self: Pet,
  pet: Pet,
  manticoreMult: number[],
  power?: number,
  snipe = false,
): CombatDamageResponse {
  let attackMultiplier = self.equipment?.multiplier ?? 1;
  let defenseMultiplier: number;
  const manticoreAttackAilments = ['Inked'];
  const preparedDefense = prepareDefenseForIncomingDamage(pet, manticoreMult, {
    includeShieldSnipe: snipe,
    nullifyMapleSyrupDefense: snipe,
  });
  let defenseEquipment = preparedDefense.defenseEquipment;
  defenseMultiplier = preparedDefense.defenseMultiplier;

  let attackEquipment: Equipment | null;
  let attackAmt: number;
  if (snipe) {
    attackEquipment =
      self.equipment?.equipmentClass == 'attack-snipe' ? self.equipment : null;
    const basePower = power ?? 0;
    attackAmt = basePower + (attackEquipment?.power ?? 0);
  } else {
    if (self.equipment instanceof HoneydewMelon) {
      attackEquipment = new HoneydewMelonAttack();
    } else if (self.equipment instanceof MapleSyrup) {
      attackEquipment = new MapleSyrupAttack();
    } else if (self.equipment instanceof Guava) {
      attackEquipment = new GuavaAttack();
    } else {
      attackEquipment =
        self.equipment?.equipmentClass == 'attack' ||
        self.equipment?.equipmentClass == 'ailment-attack'
          ? self.equipment
          : null;
    }
    if (attackEquipment != null) {
      const attackEquipName = attackEquipment?.name ?? '';
      attackMultiplier = applyManticoreMultiplier(
        attackMultiplier,
        attackEquipName,
        manticoreMult,
        manticoreAttackAilments,
      );
      const basePower =
        attackEquipment.originalPower ?? attackEquipment.power ?? 0;
      attackEquipment.power = basePower * attackMultiplier;
    }

    let petAttack = self.attack;
    if (self.name == 'Monty') {
      petAttack *= self.level + 1;
    }
    const baseAttack = power != null ? power : petAttack;
    const equipmentBonus = attackEquipment?.power ?? 0;
    attackAmt = baseAttack + equipmentBonus;
  }
  let mapleSyrupReduction = 0;
  if (pet.equipment instanceof MapleSyrup && pet.equipment.uses > 0 && !snipe) {
    attackAmt = Math.floor(attackAmt * Math.pow(0.5, defenseMultiplier));
  }

  if (attackEquipment instanceof Salt && !snipe) {
    attackAmt *= 2 + attackMultiplier - 1;
  }

  if (attackEquipment instanceof MapleSyrupAttack && !snipe) {
    attackAmt = Math.floor(attackAmt * Math.pow(0.5, attackMultiplier));
  }

  let fortuneCookie = false;
  if (attackEquipment instanceof FortuneCookie && !snipe) {
    const fortuneDecision = chooseRandomOption(
      {
        key: 'equipment.fortune-cookie',
        label: 'Fortune Cookie outcome',
        options: [
          { id: 'double-damage', label: 'Double damage' },
          { id: 'no-bonus', label: 'No bonus' },
        ],
      },
      () => getRandomInt(0, 1),
    );
    if (fortuneDecision.index === 0) {
      attackAmt *= 2 + attackMultiplier - 1;
      fortuneCookie = true;
    }
  }

  if (attackEquipment instanceof Cheese && !snipe) {
    attackAmt = Math.max(15, attackAmt);
  }

  let damage = calculateIncomingDamageBeforeReductions(
    pet,
    attackAmt,
    defenseEquipment,
    manticoreMult,
  );

  if (self.equipment?.name === 'Inked' && damage > 0) {
    damage = Math.max(0, damage - 3);
  }
  if (defenseEquipment instanceof Pepper) {
    damage = Math.min(damage, pet.health - 1);
  }
  const reductionResult = applyDamageReductions(pet, damage, {
    includeGhostKitten: snipe,
    fairyMinimumOne: true,
    fairyRequiresPositiveDamage: false,
    nurikabeConsumesOnZeroHit: true,
    fanMusselConsumesOnZeroHit: true,
  });
  damage = reductionResult.damage;
  const fairyBallReduction = reductionResult.fairyBallReduction;
  const nurikabe = reductionResult.nurikabe;
  const fanMusselReduction = reductionResult.fanMusselReduction;
  const ghostKittenReduction = reductionResult.ghostKittenReduction;

  return {
    defenseEquipment: defenseEquipment,
    attackEquipment: attackEquipment,
    damage: damage,
    fortuneCookie: fortuneCookie,
    nurikabe: nurikabe,
    fairyBallReduction: fairyBallReduction,
    fanMusselReduction: fanMusselReduction,
    mapleSyrupReduction: mapleSyrupReduction,
    ghostKittenReduction: ghostKittenReduction,
  };
}
