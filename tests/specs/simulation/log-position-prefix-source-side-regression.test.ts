import { describe, expect, it } from 'vitest';
import { formatRandomEvents } from '../../../src/app/ui/shell/simulation/app.component.simulation';
import type { Battle } from '../../../src/app/domain/interfaces/battle.interface';

describe('log positional prefix source-side resolution', () => {
  it('uses source pet side for prefixes even when log player is on the other side', () => {
    const player = { isOpponent: false } as const;
    const opponent = { isOpponent: true } as const;
    const sourcePet = { name: 'Abomination', parent: opponent } as const;
    const battle = {
      logs: [
        {
          message: 'Pandoras Box gave Abomination Carrot',
          rawMessage: 'Pandoras Box gave Abomination Carrot',
          type: 'ability',
          player,
          sourcePet,
          sourceIndex: 1,
          randomEvent: true,
        },
      ],
    } as const;

    const parts = formatRandomEvents(battle as unknown as Battle, null, true);
    const text = parts
      .map((part) => {
        if (part.type === 'text') {
          return part.text;
        }
        return part.type === 'br' ? '\n' : '';
      })
      .join('');

    expect(text).toContain('[O1] Pandoras Box gave Abomination Carrot');
    expect(text).not.toContain('[P1] Pandoras Box gave Abomination Carrot');
  });
});
