import type { PetConfig } from 'app/domain/interfaces/simulation-config.interface';

type EquipmentObject = Exclude<
  PetConfig['equipment'],
  string | null | undefined
>;

export function getPetConfigEquipmentName(
  equipment: PetConfig['equipment'],
): string | null {
  return typeof equipment === 'string' ? equipment : (equipment?.name ?? null);
}

export function clonePetConfigEquipment(
  equipment: PetConfig['equipment'],
): EquipmentObject | null {
  if (!equipment) {
    return null;
  }
  return typeof equipment === 'string' ? { name: equipment } : { ...equipment };
}
