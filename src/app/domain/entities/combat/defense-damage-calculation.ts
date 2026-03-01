import type { Pet } from '../pet.class';
import type { Equipment } from '../equipment.class';
import { MapleSyrup } from 'app/domain/entities/catalog/equipment/golden/maple-syrup.class';
import { applyIckyMultiplier, applyManticoreMultiplier } from './damage-reduction';
import { getStrawberrySparrowBlockAmount } from './combat-snipe-utils';

type PrepareDefenseOptions = {
  includeShieldSnipe?: boolean;
  nullifyMapleSyrupDefense?: boolean;
  manticoreDefenseAilments?: string[];
};

export type PreparedDefense = {
  defenseEquipment: Equipment | null;
  defenseMultiplier: number;
};

const DEFAULT_MANTICORE_DEFENSE_AILMENTS = ['Cold', 'Weak', 'Spooked'];

export function prepareDefenseForIncomingDamage(
  pet: Pet,
  manticoreMultipliers: number[],
  options: PrepareDefenseOptions = {},
): PreparedDefense {
  let defenseMultiplier = pet.equipment?.multiplier ?? 1;
  const includeShieldSnipe = options.includeShieldSnipe ?? false;
  const nullifyMapleSyrupDefense = options.nullifyMapleSyrupDefense ?? false;
  const manticoreDefenseAilments =
    options.manticoreDefenseAilments ?? DEFAULT_MANTICORE_DEFENSE_AILMENTS;

  let defenseEquipment: Equipment | null =
    pet.equipment?.equipmentClass == 'defense' ||
    pet.equipment?.equipmentClass == 'shield' ||
    pet.equipment?.equipmentClass == 'ailment-defense' ||
    (includeShieldSnipe && pet.equipment?.equipmentClass == 'shield-snipe')
      ? pet.equipment
      : null;

  if (defenseEquipment == null) {
    return { defenseEquipment: null, defenseMultiplier };
  }

  if (defenseEquipment.name === 'Strawberry') {
    const strawberryBlockAmount = getStrawberrySparrowBlockAmount(pet);
    if (strawberryBlockAmount <= 0) {
      return { defenseEquipment: null, defenseMultiplier };
    }
    defenseEquipment.power = strawberryBlockAmount;
    return { defenseEquipment, defenseMultiplier };
  }

  if (nullifyMapleSyrupDefense && defenseEquipment instanceof MapleSyrup) {
    return { defenseEquipment: null, defenseMultiplier };
  }

  defenseMultiplier = applyManticoreMultiplier(
    defenseMultiplier,
    defenseEquipment.name,
    manticoreMultipliers,
    manticoreDefenseAilments,
  );
  const basePower = defenseEquipment.originalPower ?? defenseEquipment.power ?? 0;
  defenseEquipment.power = basePower * defenseMultiplier;

  return { defenseEquipment, defenseMultiplier };
}

export function calculateIncomingDamageBeforeReductions(
  pet: Pet,
  incomingPower: number,
  defenseEquipment: Equipment | null,
  manticoreMultipliers: number[],
): number {
  const adjustedIncomingPower = applyIckyMultiplier(
    incomingPower,
    pet.equipment,
    manticoreMultipliers,
  );
  const defenseAmount = defenseEquipment?.power ?? 0;

  let min =
    defenseEquipment?.equipmentClass == 'shield' ||
    defenseEquipment?.equipmentClass == 'shield-snipe'
      ? 0
      : 1;
  if (defenseEquipment?.minimumDamage !== undefined) {
    min = defenseEquipment.minimumDamage;
  }

  if (adjustedIncomingPower <= min && defenseAmount > 0) {
    return Math.max(adjustedIncomingPower, 0);
  }
  return Math.max(min, adjustedIncomingPower - defenseAmount);
}
