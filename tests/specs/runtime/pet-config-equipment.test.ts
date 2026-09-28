import { describe, expect, it } from 'vitest';
import {
  clonePetConfigEquipment,
  getPetConfigEquipmentName,
} from 'app/integrations/equipment/pet-config-equipment';

describe('pet config equipment compatibility', () => {
  it('normalizes public string equipment to the calculator object shape', () => {
    expect(getPetConfigEquipmentName('Garlic')).toBe('Garlic');
    expect(clonePetConfigEquipment('Garlic')).toEqual({ name: 'Garlic' });
  });

  it('clones legacy equipment objects and preserves uses', () => {
    const equipment = { name: 'Melon', uses: 1 };
    const clone = clonePetConfigEquipment(equipment);

    expect(getPetConfigEquipmentName(equipment)).toBe('Melon');
    expect(clone).toEqual(equipment);
    expect(clone).not.toBe(equipment);
  });

  it('keeps absent equipment absent', () => {
    expect(getPetConfigEquipmentName(null)).toBeNull();
    expect(clonePetConfigEquipment(undefined)).toBeNull();
  });
});
