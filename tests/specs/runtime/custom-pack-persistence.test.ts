import { FormGroup } from '@angular/forms';
import { describe, expect, it } from 'vitest';
import { getOutFinderCatalog } from '../../../src/app/integrations/simulation/out-finder';
import { SimulationConfig } from '../../../src/app/domain/interfaces/simulation-config.interface';
import {
  createPack,
  getCustomPackSpellItems,
} from '../../../src/app/runtime/custom-pack-form';
import { buildSimulationConfigFromForm } from '../../../src/app/runtime/state/simulation-form-mapper';

describe('custom pack persistence', () => {
  it('retains food, perk, and legacy spell cards when restoring a pack form', () => {
    const pack = createPack({
      name: 'Deck with shop cards',
      foods: ['Apple', 117],
      perks: ['Honey', 60],
      spells: ['Blueberry'],
    });

    expect(pack.get('foods')?.value).toEqual(['Apple', 117]);
    expect(pack.get('perks')?.value).toEqual(['Honey', 60]);
    expect(pack.get('spells')?.value).toEqual(['Blueberry']);
  });

  it('includes food and perk cards in the normalized simulation config', () => {
    const values: Record<string, unknown> = {
      playerPack: 'Deck with shop cards',
      opponentPack: 'Turtle',
      turn: 1,
      playerPets: [],
      opponentPets: [],
      customPacks: [
        {
          name: 'Deck with shop cards',
          foods: [' Apple ', 117, null],
          perks: [' Honey ', 60, false],
          spells: [' Blueberry '],
        },
      ],
    };
    const formGroup = {
      get: (controlName: string) => ({ value: values[controlName] }),
    } as unknown as FormGroup;

    const config = buildSimulationConfigFromForm(formGroup, 1, {
      maxLoggedBattles: 1,
    });

    expect(config.customPacks).toEqual([
      {
        name: 'Deck with shop cards',
        tier1Pets: [],
        tier2Pets: [],
        tier3Pets: [],
        tier4Pets: [],
        tier5Pets: [],
        tier6Pets: [],
        foods: ['Apple', 117],
        perks: ['Honey', 60],
        spells: ['Blueberry'],
      },
    ]);
  });

  it('uses persisted food and perk cards in the custom shop pool', () => {
    const config: SimulationConfig = {
      playerPack: 'Deck with shop cards',
      opponentPack: 'Turtle',
      turn: 1,
      playerPets: [],
      opponentPets: [],
      customPacks: [
        {
          name: 'Deck with shop cards',
          foods: ['Apple'],
          perks: ['Honey'],
        },
      ],
    };

    const catalog = getOutFinderCatalog(config, 'player');

    expect(catalog.foods.map((food) => food.Name)).toEqual(
      expect.arrayContaining(['Apple', 'Honey']),
    );
  });

  it('exports persisted food and perk cards through the SAP Spells array', () => {
    expect(
      getCustomPackSpellItems({
        foods: ['Apple', 117],
        perks: ['Honey', 60],
        spells: ['Blueberry'],
      }),
    ).toEqual(['Apple', 117, 'Honey', 60, 'Blueberry']);
  });
});
