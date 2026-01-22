import { Equipment } from '../classes/equipment.class';

export function cloneEquipment(equipment: Equipment): Equipment {
  if (!equipment) {
    return null;
  }
  const clone = Object.create(Object.getPrototypeOf(equipment));
  Object.assign(clone, equipment);
  return clone;
}

export function cloneEquipmentWithUses(
  equipment: Equipment,
  uses?: number,
): Equipment {
  const clone = cloneEquipment(equipment);
  if (!clone) {
    return null;
  }
  if (uses != null) {
    clone.uses = uses;
    clone.originalUses = uses;
  }
  return clone;
}
