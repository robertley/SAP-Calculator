import { describe, expect, it } from 'vitest';
import {
  parseReplayForCalculatorFromActions,
  parseTeamwoodReplayForCalculator,
  ReplayBattleJson,
  ReplayCalcParser,
  selectReplayBattleFromActions,
} from '../../../src/app/integrations/replay/replay-calc-parser';

describe('ReplayCalcParser', () => {
  it('parses calculator state directly from actions for replaybot usage', () => {
    const actions = [
      {
        Type: 0,
        Turn: 5,
        Battle: JSON.stringify({
          UserBoard: {
            Pack: 6,
            Tur: 5,
            Mins: {
              Items: [
                {
                  Enu: 349,
                  Lvl: 2,
                  Poi: { x: 1 },
                  At: { Perm: 8 },
                  Hp: { Perm: 8 },
                  Abil: [{ Enu: 9101, Lvl: 2 }],
                },
                {
                  Enu: 373,
                  Lvl: 2,
                  Poi: { x: 0 },
                  At: { Perm: 12 },
                  Hp: { Perm: 12 },
                  Abil: [{ Enu: 9101, Lvl: 2, Grop: 1 }],
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
        }),
      },
    ];

    const state = parseReplayForCalculatorFromActions(actions, 5);
    const abomination = state?.playerPets.find(
      (pet) => pet?.name === 'Abomination',
    );

    expect(state).toBeTruthy();
    expect(abomination).toBeTruthy();
    expect(abomination?.abominationSwallowedPet1).toBe('Brain Cramp');
    expect(abomination?.abominationSwallowedPet1Level).toBe(2);
  });

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

  it('uses first resolvable ability in each abomination group', () => {
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
              At: { Perm: 12 },
              Hp: { Perm: 12 },
              Abil: [
                { Enu: 9901, Lvl: 3, Grop: 1 },
                { Enu: 9001, Lvl: 2, Grop: 1 },
                { Enu: 9902, Lvl: 1, Grop: 2 },
                { Enu: 9002, Lvl: 3, Grop: 2 },
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
          '9001': 'Brain Cramp',
          '9002': 'Vampire Bat',
        },
      },
    );

    const abomination = state.playerPets.find((pet) => pet?.name === 'Abomination');

    expect(abomination).toBeTruthy();
    expect(abomination?.abominationSwallowedPet1).toBe('Brain Cramp');
    expect(abomination?.abominationSwallowedPet1Level).toBe(2);
    expect(abomination?.abominationSwallowedPet2).toBe('Vampire Bat');
    expect(abomination?.abominationSwallowedPet2Level).toBe(3);
  });

  it('falls back to ability order when abomination group metadata is missing', () => {
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
              At: { Perm: 12 },
              Hp: { Perm: 12 },
              Abil: [
                { Enu: 9101, Lvl: 1 },
                { Enu: 9102, Lvl: 2 },
                { Enu: 9103, Lvl: 3 },
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
          '9101': 'Brain Cramp',
          '9102': 'Vampire Bat',
          '9103': 'Leopard',
        },
      },
    );

    const abomination = state.playerPets.find((pet) => pet?.name === 'Abomination');

    expect(abomination).toBeTruthy();
    expect(abomination?.abominationSwallowedPet1).toBe('Brain Cramp');
    expect(abomination?.abominationSwallowedPet2).toBe('Vampire Bat');
    expect(abomination?.abominationSwallowedPet3).toBe('Leopard');
    expect(abomination?.abominationSwallowedPet1Level).toBe(1);
    expect(abomination?.abominationSwallowedPet2Level).toBe(2);
    expect(abomination?.abominationSwallowedPet3Level).toBe(3);
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

  it('accepts action payloads where Battle is already parsed JSON', () => {
    const actions = [
      {
        Type: 0,
        Turn: 1,
        Battle: {
          UserBoard: {
            Tur: 1,
            GoSp: 10,
            Mins: {
              Items: [
                {
                  Enu: 628,
                  Poi: { x: 0 },
                  At: { Perm: 1, Temp: 0 },
                  Hp: { Perm: 4, Temp: 0 },
                  Lvl: 1,
                  Abil: [{ Enu: 649, Lvl: 1 }],
                },
              ],
            },
          },
          OpponentBoard: {
            Tur: 1,
            GoSp: 9,
            Mins: { Items: [] },
          },
        },
      },
    ];

    const state = parseReplayForCalculatorFromActions(actions, 1);
    const playerPet = state?.playerPets.find((pet) => pet !== null) ?? null;

    expect(state).toBeTruthy();
    expect(state?.turn).toBe(1);
    expect(state?.playerGoldSpent).toBe(10);
    expect(state?.opponentGoldSpent).toBe(9);
    expect(playerPet?.attack).toBe(1);
    expect(playerPet?.health).toBe(4);
  });

  it('parses replaybot turns payload format via teamwood helper', () => {
    const replay = {
      turns: [
        {
          turn: 1,
          user: {
            stats: {
              turn: 1,
              goldSpent: 10,
              rolls: 1,
              summons: 3,
              level3Sold: null,
              transformed: null,
            },
            pets: [
              {
                slot: 0,
                id: '628',
                level: 1,
                experience: null,
                perkId: null,
                attack: {
                  permanent: 1,
                  temporary: null,
                },
                health: {
                  permanent: 4,
                  temporary: null,
                },
                mana: null,
                abilities: [
                  {
                    id: '649',
                    level: 1,
                    group: null,
                    triggersConsumed: null,
                  },
                ],
              },
            ],
          },
          opponent: {
            stats: {
              turn: 1,
              goldSpent: 9,
              rolls: 2,
              summons: 2,
              level3Sold: null,
              transformed: null,
            },
            pets: [],
          },
        },
      ],
      abilityPetMap: {
        '649': '628',
      },
      replayMeta: {
        pack: 'Unicorn',
        opponent_pack: 'Puppy',
      },
    };

    const state = parseTeamwoodReplayForCalculator(replay, 1);
    const playerPet = state?.playerPets.find((pet) => pet !== null) ?? null;

    expect(state).toBeTruthy();
    expect(state?.turn).toBe(1);
    expect(state?.playerGoldSpent).toBe(10);
    expect(state?.opponentRollAmount).toBe(2);
    expect(playerPet?.attack).toBe(1);
    expect(playerPet?.health).toBe(4);
  });
});
