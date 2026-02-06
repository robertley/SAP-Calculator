import { describe, expect, it } from 'vitest';
import {
  refreshBattleDiff,
  refreshViewBattleTimeline,
} from '../src/app/root/app.component.simulation';

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
});

