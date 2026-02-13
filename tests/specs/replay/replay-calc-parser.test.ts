import { describe, expect, it } from 'vitest';
import {
  ReplayBattleJson,
  ReplayCalcParser,
} from '../../../src/app/integrations/replay/replay-calc-parser';

describe('ReplayCalcParser', () => {
  it('infers missing copied-ability owner from nearby mapped abilities', () => {
    const parser = new ReplayCalcParser();
    const battleJson: ReplayBattleJson = {
      UserBoard: {
        Pack: 6,
        Mins: {
          Items: [
            {
              Enu: 373,
              Lvl: 2,
              Poi: { x: 0 },
              At: { Perm: 18 },
              Hp: { Perm: 17 },
              Abil: [
                { Enu: 379, Lvl: 1 },
                { Enu: 411, Lvl: 1, Grop: 1 },
              ],
            },
          ],
        },
      },
      OpponentBoard: {
        Pack: 0,
        Mins: {
          Items: [],
        },
      },
    };

    const state = parser.parseReplayForCalculator(
      battleJson,
      undefined,
      undefined,
      {
        abilityPetMap: {
          '379': '349',
          '410': '380',
        },
      },
    );
    const abomination = state.playerPets.find((pet) => pet?.name === 'Abomination');

    expect(abomination).toBeTruthy();
    expect(abomination?.abominationSwallowedPet1).toBe('Brain Cramp');
    expect(abomination?.abominationSwallowedPet2).toBe('Vampire Bat');
  });
});
