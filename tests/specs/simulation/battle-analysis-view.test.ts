import { describe, expect, it } from 'vitest';
import {
  refreshBattleDiff,
  refreshFilteredBattles,
  refreshViewBattleTimeline,
} from '../../../src/app/ui/shell/simulation/app.component.simulation';
import type { AppSimulationContext } from '../../../src/app/ui/shell/simulation/app.component.simulation';
import type { Battle } from '../../../src/app/domain/interfaces/battle.interface';

describe('Battle analysis views', () => {
  it('builds trigger timeline rows with source/target/reason', () => {
    const player = { isOpponent: false } as any;
    const opponent = { isOpponent: true } as any;
    const ant = { name: 'Ant', parent: player } as any;
    const fish = { name: 'Fish', parent: opponent } as any;
    const battle = {
      winner: 'player',
      logs: [
        {
          type: 'ability',
          message: 'Ant buffed Fish.',
          sourcePet: ant,
          targetPet: fish,
          sourceIndex: 1,
          targetIndex: 1,
          randomEvent: false,
        },
      ],
    } as any;

    const ctx: any = {
      viewBattle: battle,
      viewBattleTimelineRows: [],
    };

    refreshViewBattleTimeline(ctx);

    expect(ctx.viewBattleTimelineRows).toHaveLength(1);
    expect(ctx.viewBattleTimelineRows[0]).toMatchObject({
      source: 'P1 Ant',
      target: 'O1 Fish',
      reason: 'deterministic',
      text: 'Ant buffed Fish.',
    });
  });

  it('builds battle diff summary across two battles', () => {
    const battleA = {
      winner: 'player',
      logs: [
        { type: 'ability', message: 'A' },
        { type: 'ability', message: 'B' },
      ],
    } as any;
    const battleB = {
      winner: 'opponent',
      logs: [
        { type: 'ability', message: 'A' },
        { type: 'ability', message: 'C' },
        { type: 'ability', message: 'D' },
      ],
    } as any;

    const ctx: any = {
      battles: [battleA, battleB],
      diffBattleLeftIndex: 0,
      diffBattleRightIndex: 1,
      battleDiffRows: [],
      battleDiffSummary: null,
    };

    refreshBattleDiff(ctx);

    expect(ctx.battleDiffRows).toHaveLength(3);
    expect(ctx.battleDiffSummary).toMatchObject({
      equalSteps: 1,
      changedSteps: 1,
      leftOnly: 0,
      rightOnly: 1,
    });
  });

  it.each([
    ['player', 0],
    ['opponent', 100],
    ['draw', 220],
  ] as const)(
    'filters %s battles before applying the display limit',
    (winner, expectedFirstIndex) => {
      const battles = [
        ...createBattles('player', 100, 0),
        ...createBattles('opponent', 120, 100),
        ...createBattles('draw', 110, 220),
      ];
      const ctx = {
        battles,
        filteredBattlesCache: [],
        formGroup: {
          get: () => ({ value: winner }),
        },
      } as unknown as AppSimulationContext;

      refreshFilteredBattles(ctx);

      expect(ctx.filteredBattlesCache).toHaveLength(100);
      expect(
        ctx.filteredBattlesCache.every((battle) => battle.winner === winner),
      ).toBe(true);
      expect(ctx.filteredBattlesCache[0]).toBe(battles[expectedFirstIndex]);
    },
  );
});

function createBattles(
  winner: Battle['winner'],
  count: number,
  offset: number,
): Battle[] {
  return Array.from({ length: count }, (_, index) => ({
    winner,
    logs: [],
    seed: offset + index,
  })) as Battle[];
}
