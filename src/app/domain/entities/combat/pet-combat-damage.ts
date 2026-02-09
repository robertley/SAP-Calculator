import type { Pet } from '../pet.class';
import { Equipment } from '../equipment.class';
import { Salt } from 'app/domain/entities/catalog/equipment/puppy/salt.class';
import { Cheese } from 'app/domain/entities/catalog/equipment/star/cheese.class';
import { FortuneCookie } from 'app/domain/entities/catalog/equipment/custom/fortune-cookie.class';
import { Pepper } from 'app/domain/entities/catalog/equipment/star/pepper.class';
import { Icky } from 'app/domain/entities/catalog/equipment/ailments/icky.class';
import { Guava, GuavaAttack } from 'app/domain/entities/catalog/equipment/custom/guava.class';
import { MapleSyrup, MapleSyrupAttack } from 'app/domain/entities/catalog/equipment/golden/maple-syrup.class';
import {
  HoneydewMelon,
  HoneydewMelonAttack,
} from 'app/domain/entities/catalog/equipment/golden/honeydew-melon.class';
import {
  applyDamageReductions,
  applyIckyMultiplier,
  applyManticoreMultiplier,
} from './damage-reduction';

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
  let defenseMultiplier = pet.equipment?.multiplier ?? 1;

  const manticoreDefenseAilments = ['Cold', 'Weak', 'Spooked'];
  const manticoreAttackAilments = ['Inked'];

  let defenseEquipment: Equipment | null =
    pet.equipment?.equipmentClass == 'defense' ||
    pet.equipment?.equipmentClass == 'shield' ||
    pet.equipment?.equipmentClass == 'ailment-defense' ||
    (snipe && pet.equipment?.equipmentClass == 'shield-snipe')
      ? pet.equipment
      : null;

  if (defenseEquipment != null) {
    if (defenseEquipment.name === 'Strawberry') {
      const sparrowLevel = pet.getSparrowLevel();
      if (
        sparrowLevel <= 0 ||
        (defenseEquipment.uses != null && defenseEquipment.uses <= 0)
      ) {
        defenseEquipment = null;
      } else {
        defenseEquipment.power = sparrowLevel * 5;
      }
    } else {
      const defenseEquipName = defenseEquipment?.name ?? '';
      defenseMultiplier = applyManticoreMultiplier(
        defenseMultiplier,
        defenseEquipName,
        manticoreMult,
        manticoreDefenseAilments,
      );
      const basePower =
        defenseEquipment.originalPower ?? defenseEquipment.power ?? 0;
      defenseEquipment.power = basePower * defenseMultiplier;
    }
  }

  let attackEquipment: Equipment | null;
  let attackAmt: number;
  if (snipe) {
    attackEquipment =
      self.equipment?.equipmentClass == 'attack-snipe' ? self.equipment : null;
    const basePower = power ?? 0;
    attackAmt = basePower + (attackEquipment?.power ?? 0);
    if (defenseEquipment instanceof MapleSyrup) {
      defenseEquipment = null;
    }
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
  let defenseAmt = defenseEquipment?.power ?? 0;

  let sparrowLevel = pet.getSparrowLevel();
  if (pet.equipment?.name === 'Strawberry' && sparrowLevel > 0) {
    defenseAmt += sparrowLevel * 5;
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
    if (Math.random() < 0.5) {
      attackAmt *= 2 + attackMultiplier - 1;
      fortuneCookie = true;
    }
  }

  if (attackEquipment instanceof Cheese && !snipe) {
    attackAmt = Math.max(15, attackAmt);
  }

  attackAmt = applyIckyMultiplier(attackAmt, pet.equipment, manticoreMult);
  let min =
    defenseEquipment?.equipmentClass == 'shield' ||
    defenseEquipment?.equipmentClass == 'shield-snipe'
      ? 0
      : 1;
  if (defenseEquipment?.minimumDamage !== undefined) {
    min = defenseEquipment.minimumDamage;
  }

  let damage: number;
  if (attackAmt <= min && defenseAmt > 0) {
    damage = Math.max(attackAmt, 0);
  } else {
    damage = Math.max(min, attackAmt - defenseAmt);
  }

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
