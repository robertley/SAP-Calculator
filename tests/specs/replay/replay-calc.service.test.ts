import { describe, expect, it, vi } from 'vitest';
import { HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';

vi.mock('../../../src/app/integrations/replay/replay-api-endpoints', () => ({
  getReplayApiUrl: (path: string) => path,
  getReplayTurnsApiUrl: (path: string) => path,
  getSapLibraryReplayUrl: (replayId: string) =>
    `https://sap-library.vercel.app/?replay=${encodeURIComponent(replayId)}`,
}));

import {
  ReplayBattleResponse,
  ReplayCalcService,
  ReplayTurnsResponse,
} from '../../../src/app/integrations/replay/replay-calc.service';

describe('ReplayCalcService', () => {
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
        return throwError(() => new Error(`unexpected post ${path}`));
      }),
      get: vi.fn(() => throwError(() => new Error('unexpected get'))),
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
});
