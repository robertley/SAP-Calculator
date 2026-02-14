import { describe, expect, it } from 'vitest';
import {
  ReplayBattleJson,
  ReplayCalcParser,
  selectReplayBattleFromActions,
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

  it('selects battle action by explicit turn before index fallback', () => {
    const actions = [
      {
        Type: 0,
        Turn: 1,
        Battle: JSON.stringify({
          UserBoard: { Tur: 1, Rold: 1 },
          OpponentBoard: { Tur: 1, Rold: 2 },
        }),
      },
      {
        Type: 0,
        Turn: 3,
        Battle: JSON.stringify({
          UserBoard: { Tur: 3, Rold: 7 },
          OpponentBoard: { Tur: 3, Rold: 4 },
        }),
      },
    ];

    const selected = selectReplayBattleFromActions(actions, 3);

    expect(selected?.UserBoard?.Tur).toBe(3);
    expect(selected?.UserBoard?.Rold).toBe(7);
  });

  it('falls back to positional battle when turn metadata is missing', () => {
    const actions = [
      {
        Type: 0,
        Battle: JSON.stringify({
          UserBoard: { Tur: 1, Rold: 2 },
          OpponentBoard: { Tur: 1, Rold: 2 },
        }),
      },
      {
        Type: 0,
        Battle: JSON.stringify({
          UserBoard: { Tur: 2, Rold: 5 },
          OpponentBoard: { Tur: 2, Rold: 1 },
        }),
      },
    ];

    const selected = selectReplayBattleFromActions(actions, 2);

    expect(selected?.UserBoard?.Tur).toBe(2);
    expect(selected?.UserBoard?.Rold).toBe(5);
  });
});
