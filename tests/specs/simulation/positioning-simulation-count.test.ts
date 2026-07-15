import { describe, expect, it } from 'vitest';
import type { PetConfig } from '../../../src/app/domain/interfaces/simulation-config.interface';
import { getPositioningSimulationCount } from '../../../src/app/integrations/simulation/positioning-optimizer';

const pet = (name: string): PetConfig => ({
  name,
  attack: 1,
  health: 1,
  exp: 1,
  equipment: null,
});

describe('positioning simulation count', () => {
  it('reduces simulations as the number of meaningful orders grows', () => {
    expect(getPositioningSimulationCount([pet('Ant'), null, null, null, null])).toBe(1000);
    expect(getPositioningSimulationCount([pet('Ant'), pet('Fish'), null, null, null])).toBe(600);
    expect(getPositioningSimulationCount([pet('Ant'), pet('Fish'), pet('Otter'), null, null])).toBe(200);
    expect(getPositioningSimulationCount([pet('Ant'), pet('Fish'), pet('Otter'), pet('Pig'), null])).toBe(100);
  });

  it('gives extended optimization a larger automatic budget', () => {
    const lineup = [pet('Ant'), pet('Fish'), pet('Otter'), pet('Pig'), pet('Duck')];
    expect(getPositioningSimulationCount(lineup, 'quick')).toBe(100);
    expect(getPositioningSimulationCount(lineup, 'extended')).toBe(500);
  });
});
