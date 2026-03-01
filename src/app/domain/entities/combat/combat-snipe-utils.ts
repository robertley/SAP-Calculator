import type { Pet } from '../pet.class';
import type { Equipment } from '../equipment.class';

const STRAWBERRY_BLOCK_PER_SPARROW_LEVEL = 5;
const MANTICORE_AILMENTS = ['Weak', 'Cold', 'Icky', 'Spooked'];

export function getStrawberrySparrowBlockAmount(pet: Pet): number {
  if (pet.equipment?.name !== 'Strawberry') {
    return 0;
  }
  if ((pet.equipment.uses ?? 0) <= 0) {
    return 0;
  }
  const sparrowLevel = pet.getSparrowLevel();
  if (sparrowLevel <= 0) {
    return 0;
  }
  return sparrowLevel * STRAWBERRY_BLOCK_PER_SPARROW_LEVEL;
}

type SnipeDefenseMessageOptions = {
  consumeDefenseEquipment?: boolean;
  includeMultiplierMessage?: boolean;
  coconutAsBlock?: boolean;
};

type SnipeReductionSummary = {
  nurikabe?: number;
  fairyBallReduction?: number;
  fanMusselReduction?: number;
  ghostKittenReduction?: number;
};

export function appendSnipeDefenseEquipmentMessage(
  message: string,
  pet: Pet,
  defenseEquipment: Equipment | null,
  options: SnipeDefenseMessageOptions = {},
): string {
  if (!defenseEquipment) {
    return message;
  }

  if (options.consumeDefenseEquipment) {
    pet.useDefenseEquipment(true);
  }

  const defensePower = defenseEquipment.power ?? 0;
  let power = Math.abs(defensePower);
  let sign = '-';
  if (defensePower < 0) {
    sign = '+';
  }

  if (options.coconutAsBlock && defenseEquipment.name === 'Coconut') {
    message += ` (${defenseEquipment.name} block)`;
  } else if (defenseEquipment.name === 'Strawberry') {
    const strawberryBlockAmount =
      defenseEquipment.power ?? getStrawberrySparrowBlockAmount(pet);
    if (strawberryBlockAmount > 0) {
      power = strawberryBlockAmount;
      message += ` (Strawberry -${power} (Sparrow))`;
    }
  } else {
    message += ` (${defenseEquipment.name} ${sign}${power})`;
  }

  if (options.includeMultiplierMessage) {
    message += defenseEquipment.multiplierMessage ?? '';
  }

  return message;
}

export function appendSnipeContextAndReductionMessages(
  message: string,
  pet: Pet,
  manticoreMultipliers: number[],
  reductions: SnipeReductionSummary,
): string {
  if (pet.equipment?.name == 'Icky') {
    message += 'x2 (Icky)';
    if (pet.equipment.multiplier > 1) {
      message += pet.equipment.multiplierMessage;
    }
  }

  const petEquipName = pet.equipment?.name ?? '';
  if (
    manticoreMultipliers.length > 0 &&
    MANTICORE_AILMENTS.includes(petEquipName)
  ) {
    for (const mult of manticoreMultipliers) {
      message += ` x${mult + 1} (Manticore)`;
    }
  }

  if ((reductions.nurikabe ?? 0) > 0) {
    message += ` -${reductions.nurikabe} (Nurikabe)`;
  }
  if ((reductions.fairyBallReduction ?? 0) > 0) {
    message += ` -${reductions.fairyBallReduction} (Fairy Ball)`;
  }
  if ((reductions.fanMusselReduction ?? 0) > 0) {
    message += ` -${reductions.fanMusselReduction} (Fan Mussel)`;
  }
  if ((reductions.ghostKittenReduction ?? 0) > 0) {
    message += ` -${reductions.ghostKittenReduction} (Ghost Kitten)`;
  }

  return message;
}
