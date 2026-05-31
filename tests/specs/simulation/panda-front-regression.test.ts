import { describe, expect, it } from 'vitest';
import { runSimulation, SimulationConfig } from '../../../simulation/simulate';

describe('Panda front regression', () => {
  it('does not faint at start of battle when there is no friend ahead', () => {
    const config: SimulationConfig = {
      playerPack: 'Custom',
      opponentPack: 'Custom',
      turn: 1,
      simulationCount: 1,
      oldStork: false,
      tokenPets: false,
      komodoShuffle: false,
      mana: true,
      playerPets: [
        {
          name: 'Panda',
          attack: 2,
          health: 4,
          exp: 0,
          equipment: null,
          mana: 0,
          triggersConsumed: 0,
          belugaSwallowedPet: null,
          abominationSwallowedPet1: null,
          abominationSwallowedPet2: null,
          abominationSwallowedPet3: null,
          battlesFought: 0,
          timesHurt: 0,
        },
        null,
        null,
        null,
        null,
      ],
      opponentPets: [
        {
          name: 'Ant',
          attack: 1,
          health: 1,
          exp: 0,
          equipment: null,
          mana: 0,
          triggersConsumed: 0,
          belugaSwallowedPet: null,
          abominationSwallowedPet1: null,
          abominationSwallowedPet2: null,
          abominationSwallowedPet3: null,
          battlesFought: 0,
          timesHurt: 0,
        },
        null,
        null,
        null,
        null,
      ],
    };

    const result = runSimulation(config);
    const messages = result.battles?.[0]?.logs.map((log) => log.message) ?? [];

    expect(messages).not.toContain('Panda fainted.');
    expect(result.playerWins).toBe(1);
  });
});
