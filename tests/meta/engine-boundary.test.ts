import { describe, expect, it } from 'vitest';
import { existsSync } from 'node:fs';
import { catalogs } from 'sap-battle-engine';
import { EquipmentService } from 'app/integrations/equipment/equipment.service';
import { PetService } from 'app/integrations/pet/pet.service';
import { Player } from 'app/domain/entities/player.class';
import { ToyService } from 'app/integrations/toy/toy.service';

describe('engine/editor boundary', () => {
  it('does not retain a second battle implementation or content catalog', () => {
    for (const file of ['src/app/gameplay/simulation-runner.ts', 'src/app/integrations/pet/pet-registry.ts', 'src/assets/data/pets.json']) {
      expect(existsSync(file)).toBe(false);
    }
  });

  it('builds editor defaults and independent equipment values from the engine catalog', () => {
    const equipment = new EquipmentService();
    const pets = new PetService(equipment);
    pets.init();
    const player = new Player();
    const ant = catalogs.pets.find((pet) => pet.Name === 'Ant')!;
    const first = pets.createPet({ name: 'Ant', exp: 2, equipment: 'Melon', equipmentUses: 3 }, player);
    const second = pets.createPet({ name: 'Ant', exp: 0, equipment: 'Melon' }, player);
    expect(first.attack).toBe(ant.Attack + 2);
    expect(first.health).toBe(ant.Health + 2);
    expect(first.level).toBe(2);
    expect(first.equipment?.uses).toBe(3);
    expect(second.equipment?.uses).toBe(1);
    expect(first.equipment).not.toBe(second.equipment);
    expect(pets.turtlePackPets.get(1)).toContain('Ant');
  });

  it('keeps toy selections as plain serializable editor data', () => {
    const toys = new ToyService();
    const name = catalogs.toys[0].Name;
    expect(toys.createToy(name, new Player(), 2)).toEqual({ name, level: 2 });
    expect(toys.createToy('unknown toy', new Player())).toBeNull();
  });
});
