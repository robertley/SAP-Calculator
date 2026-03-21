import { describe, expect, it, vi } from 'vitest';
import { HttpClient } from '@angular/common/http';

vi.mock('../../../src/app/integrations/replay/replay-api-endpoints', () => ({
  getReplayApiUrl: (path: string) => path,
  getReplayTurnsApiUrl: (path: string) => path,
}));

import {
  ReplayBattleResponse,
  ReplayCalcService,
  ReplayTurnsResponse,
} from '../../../src/app/integrations/replay/replay-calc.service';

describe('ReplayCalcService', () => {
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
});
