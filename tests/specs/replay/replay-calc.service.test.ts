import { describe, expect, it, vi } from 'vitest';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';

vi.mock('../../../src/app/integrations/replay/replay-api-endpoints', () => ({
  getReplayApiUrl: (path: string) => path,
  getReplayCalculatorApiUrl: (replayId: string, turn: number) =>
    `/replays/${replayId}/calculator?turn=${turn}`,
  getReplayPerspectivesApiUrl: (replayId: string) =>
    `/replays/${replayId}/perspectives`,
  getReplayTurnsApiUrl: (replayId: string) => `/replays/${replayId}/turns`,
  getSapLibraryReplayUrl: (replayId: string) =>
    `https://sap-library.vercel.app/?replay=${encodeURIComponent(replayId)}`,
}));

import {
  ReplayBattleResponse,
  ReplayCalcService,
  ReplayTurnsResponse,
} from '../../../src/app/integrations/replay/replay-calc.service';

describe('ReplayCalcService', () => {
  it('imports calculator state from SAP Library when battle fallback data omits toys', async () => {
    const encodedState = Buffer.from(
      JSON.stringify({
        oT: 'Microwave Oven',
        oTL: '2',
        p: [{ n: 'Fish', a: 9 }],
      }),
    ).toString('base64url');
    const http = {
      post: vi.fn((path: string) => {
        if (path === '/replay-battle') {
          return throwError({ status: 404 });
        }
        if (path === '/replays') {
          return of({ replayId: 'db-replay-1' });
        }
        return throwError(new Error(`unexpected post ${path}`));
      }),
      get: vi.fn((path: string) => {
        if (path === '/replays/pid-1/calculator?turn=9') {
          return throwError({ status: 404 });
        }
        if (path === '/replays/db-replay-1/calculator?turn=9') {
          return of({
            url: `https://sap-calculator.com/?c=${encodedState}`,
          });
        }
        return throwError(new Error(`unexpected get ${path}`));
      }),
    } as unknown as HttpClient;
    const service = new ReplayCalcService(http);

    const response = await new Promise<ReplayBattleResponse>((resolve, reject) => {
      service.fetchReplayBattle({ Pid: 'pid-1', T: 9 }, 1000).subscribe({
        next: resolve,
        error: reject,
      });
    });

    expect(response.calculatorState).toEqual({
      opponentToy: 'Microwave Oven',
      opponentToyLevel: '2',
      playerPets: [{ name: 'Fish', attack: 9 }],
    });
    expect(response.sapLibraryReplayId).toBe('db-replay-1');
  });

  it('adds raw replay spells to custom packs from the calculator import path', async () => {
    const encodedState = Buffer.from(
      JSON.stringify({
        pP: 'Replay Pack',
        cp: [{ n: 'Replay Pack' }],
      }),
    ).toString('base64url');
    const http = {
      post: vi.fn((path: string) => {
        if (path === '/replay-battle') {
          return throwError({ status: 404 });
        }
        if (path === '/replays') {
          return of({ replayId: 'db-replay-spells' });
        }
        return throwError(new Error(`unexpected post ${path}`));
      }),
      get: vi.fn((path: string) => {
        if (path === '/replays/pid-spells/calculator?turn=1') {
          return throwError({ status: 404 });
        }
        if (path === '/replays/db-replay-spells/calculator?turn=1') {
          return of({
            url: `https://sap-calculator.com/?c=${encodedState}`,
          });
        }
        if (path === '/replays/db-replay-spells/turns') {
          return of({
            turns: [
              {
                turn: 1,
                user: { pets: [] },
                opponent: { pets: [] },
              },
            ],
            genesisBuildModel: {
              Bor: {
                Deck: {
                  Id: 'replay-pack-deck',
                  Title: 'Replay Pack',
                  Minions: ['624'],
                  Spells: [0, 117],
                },
              },
            },
          });
        }
        if (path === '/replays/db-replay-spells/perspectives') {
          return of({ perspectives: [] });
        }
        return throwError(new Error(`unexpected get ${path}`));
      }),
    } as unknown as HttpClient;
    const service = new ReplayCalcService(http);

    const response = await new Promise<ReplayBattleResponse>((resolve, reject) => {
      service.fetchReplayBattle({ Pid: 'pid-spells', T: 1 }, 1000).subscribe({
        next: resolve,
        error: reject,
      });
    });

    expect(response.calculatorState?.['customPacks']).toEqual([
      {
        name: 'Replay Pack',
        spells: [0, 117],
      },
    ]);
  });

  it('selects the imported custom deck for each replay side', () => {
    const service = new ReplayCalcService(null as unknown as HttpClient);
    const calculatorResponse: ReplayBattleResponse = {
      calculatorState: {
        playerPack: 'Custom',
        opponentPack: 'Custom',
        customPacks: [
          { name: 'ff', tier3Pets: ['Flying Fish'] },
          { name: 'ff (2)', tier3Pets: ['Hirola'] },
        ],
      },
    };
    const replayResponse: ReplayBattleResponse = {
      battle: {
        UserBoard: {
          Pack: 'Custom',
          Deck: {
            Id: 'player-deck',
            Title: 'ff',
            Minions: ['226'],
          },
          Mins: { Items: [] },
        },
        OpponentBoard: {
          Pack: 'Custom',
          Deck: {
            Id: 'opponent-deck',
            Title: 'ff',
            Minions: ['74'],
          },
          Mins: { Items: [] },
        },
      },
    };
    const replayServiceWithDeckMerger = service as unknown as {
      mergeReplayDecksIntoCalculatorState: (
        calculator: ReplayBattleResponse,
        replay: ReplayBattleResponse,
      ) => ReplayBattleResponse;
    };

    const response = replayServiceWithDeckMerger.mergeReplayDecksIntoCalculatorState(
      calculatorResponse,
      replayResponse,
    );

    expect(response.calculatorState?.['playerPack']).toBe('ff');
    expect(response.calculatorState?.['opponentPack']).toBe('ff (2)');
  });

  it('prefers direct replay battle payloads before falling back to turns', async () => {
    const http = {
      post: vi.fn((path: string) => {
        if (path === '/replay-battle') {
          return of({
            battle: {
              UserBoard: { Pack: 6, Mins: { Items: [] } },
              OpponentBoard: { Pack: 7, Mins: { Items: [] } },
            },
          });
        }
        return throwError(new Error(`unexpected post ${path}`));
      }),
      get: vi.fn(() => throwError(new Error('unexpected get'))),
    } as unknown as HttpClient;
    const service = new ReplayCalcService(http);

    const response = await new Promise<ReplayBattleResponse>((resolve, reject) => {
      service.fetchReplayBattle(
        { Pid: 'pid-1', T: 16 },
        1000,
      ).subscribe({
        next: resolve,
        error: reject,
      });
    });

    expect(response.battle?.UserBoard?.Pack).toBe(6);
    expect(http.post).toHaveBeenCalledTimes(1);
    expect(http.post).toHaveBeenCalledWith('/replay-battle', {
      Pid: 'pid-1',
      T: 16,
    });
    expect(http.get).not.toHaveBeenCalled();
  });

  it('adds both perspective decks before importing a direct replay battle', async () => {
    const playerDeck = { Id: 'player-deck', Minions: ['1'] };
    const opponentDeck = { Id: 'opponent-deck', Minions: ['2'] };
    const http = {
      post: vi.fn(() =>
        of({
          battle: {
            UserBoard: { Pack: 3, Mins: { Items: [] } },
            OpponentBoard: { Pack: 3, Mins: { Items: [] } },
          },
          genesisBuildModel: { Bor: { Deck: playerDeck } },
          opponentGenesisBuildModel: { Bor: { Deck: opponentDeck } },
        }),
      ),
      get: vi.fn(() => throwError(new Error('unexpected get'))),
    } as unknown as HttpClient;
    const service = new ReplayCalcService(http);

    const response = await new Promise<ReplayBattleResponse>((resolve, reject) => {
      service.fetchReplayBattle({ Pid: 'pid-1', T: 1 }, 1000).subscribe({
        next: resolve,
        error: reject,
      });
    });

    expect(response.battle?.UserBoard?.Deck).toEqual(playerDeck);
    expect(response.battle?.OpponentBoard?.Deck).toEqual(opponentDeck);
  });

  it('loads perspectives when building a SAP Library replay battle response', async () => {
    const opponentDeck = { Id: 'opponent-deck', Minions: ['2'] };
    const http = {
      get: vi.fn((path: string) => {
        if (path === '/replays/db-replay-1/turns') {
          return of({
            replay: { id: 'db-replay-1' },
            turns: [
              {
                turn: 1,
                user: { pets: [] },
                opponent: { pets: [] },
              },
            ],
          });
        }
        if (path === '/replays/db-replay-1/perspectives') {
          return of({
            perspectives: [
              {
                role: 'opponent',
                raw: {
                  Actions: [
                    {
                      Type: 1,
                      Build: JSON.stringify({
                        Mins: { Items: [{ Enu: '2', Abil: [{ Enu: '9002' }] }] },
                      }),
                    },
                  ],
                  GenesisBuildModel: { Bor: { Deck: opponentDeck } },
                },
              },
            ],
          });
        }
        return throwError(new Error(`unexpected get ${path}`));
      }),
    } as unknown as HttpClient;
    const service = new ReplayCalcService(http);
    const replayServiceWithTurnsFetcher = service as unknown as {
      fetchReplayBattleByReplayId: (
        replayId: string,
        requestedTurn: number,
        timeoutMs: number,
      ) => Observable<ReplayBattleResponse>;
    };

    const response = await new Promise<ReplayBattleResponse>((resolve, reject) => {
      replayServiceWithTurnsFetcher
        .fetchReplayBattleByReplayId('db-replay-1', 1, 1000)
        .subscribe({
        next: resolve,
        error: reject,
      });
    });

    expect(response.battle?.OpponentBoard?.Deck).toEqual(opponentDeck);
    expect(response.abilityPetMap?.['9002']).toBe('2');
    expect(http.get).toHaveBeenCalledWith('/replays/db-replay-1/perspectives');
  });

  it('preserves replay meta pack data when building a battle from turns', () => {
    const service = new ReplayCalcService(null as unknown as HttpClient);
    const turnsResponse: ReplayTurnsResponse = {
      turns: [
        {
          turn: 1,
          user: {
            stats: {
              turn: 1,
              goldSpent: 10,
            },
            pets: [],
          },
          opponent: {
            stats: {
              turn: 1,
              goldSpent: 9,
            },
            pets: [],
          },
        },
      ],
      replayMeta: {
        pack: 'Unicorn',
        opponent_pack: 'Danger',
      },
    };

    const replayServiceWithTurnsBuilder = service as unknown as {
      buildReplayBattleResponseFromTurns: (
        response: ReplayTurnsResponse,
        requestedTurn: number,
        replayId: string,
      ) => ReplayBattleResponse;
    };

    const response = replayServiceWithTurnsBuilder.buildReplayBattleResponseFromTurns(
      turnsResponse,
      1,
      'replay-1',
    );

    expect(response.battle?.UserBoard?.Pack).toBe(6);
    expect(response.battle?.OpponentBoard?.Pack).toBe(7);
  });

  it('includes a SAP Library replay URL when the indexed turns payload exposes a replay id', () => {
    const service = new ReplayCalcService(null as unknown as HttpClient);
    const turnsResponse: ReplayTurnsResponse = {
      replay: {
        id: 'db-replay-42',
      },
      turns: [
        {
          turn: 1,
          user: {
            stats: {
              turn: 1,
              goldSpent: 10,
            },
            pets: [],
          },
          opponent: {
            stats: {
              turn: 1,
              goldSpent: 9,
            },
            pets: [],
          },
        },
      ],
    };

    const replayServiceWithTurnsBuilder = service as unknown as {
      buildReplayBattleResponseFromTurns: (
        response: ReplayTurnsResponse,
        requestedTurn: number,
        replayId: string,
      ) => ReplayBattleResponse;
    };

    const response = replayServiceWithTurnsBuilder.buildReplayBattleResponseFromTurns(
      turnsResponse,
      1,
      'pid-1',
    );

    expect(response.sapLibraryReplayId).toBe('db-replay-42');
    expect(response.sapLibraryReplayUrl).toBe(
      'https://sap-library.vercel.app/?replay=db-replay-42',
    );
  });

  it('merges both SAP Library perspectives into the calculator battle response', () => {
    const service = new ReplayCalcService(null as unknown as HttpClient);
    const opponentDeck = {
      Id: 'opponent-deck',
      Title: 'Opponent Custom Pack',
      Minions: ['2'],
    };
    const turnsResponse: ReplayTurnsResponse = {
      turns: [
        {
          turn: 1,
          user: { pets: [] },
          opponent: { pets: [] },
        },
      ],
      perspectives: [
        {
          role: 'player',
          raw: {
            Actions: [
              {
                Type: 1,
                Build: JSON.stringify({
                  Mins: { Items: [{ Enu: '1', Abil: [{ Enu: '9001' }] }] },
                }),
              },
            ],
            GenesisBuildModel: {
              Bor: { Deck: { Id: 'player-deck', Minions: ['1'] } },
            },
          },
        },
        {
          role: 'opponent',
          raw: {
            Actions: [
              {
                Type: 1,
                Build: JSON.stringify({
                  Mins: { Items: [{ Enu: '2', Abil: [{ Enu: '9002' }] }] },
                }),
              },
            ],
            GenesisBuildModel: { Bor: { Deck: opponentDeck } },
          },
        },
      ],
    };

    const replayServiceWithTurnsBuilder = service as unknown as {
      buildReplayBattleResponseFromTurns: (
        response: ReplayTurnsResponse,
        requestedTurn: number,
        replayId: string,
      ) => ReplayBattleResponse;
    };

    const response = replayServiceWithTurnsBuilder.buildReplayBattleResponseFromTurns(
      turnsResponse,
      1,
      'replay-1',
    );

    expect(response.opponentGenesisBuildModel?.Bor?.Deck).toEqual(opponentDeck);
    expect(response.battle?.OpponentBoard?.Deck).toEqual(opponentDeck);
    expect(response.abilityPetMap?.['9001']).toBe('1');
    expect(response.abilityPetMap?.['9002']).toBe('2');
  });
});
