import { describe, expect, it } from 'vitest';
import { buildFightAnimationFrames } from '../../../src/app/ui/shell/simulation/app.component.fight-animation';

function buildOpponentAbominationBoard(): string {
  const playerSide =
    '___ (-/-) ___ (-/-) ___ (-/-) ___ (-/-) ___ (-/-)';
  const opponentTokens = Array.from({ length: 5 }, (_, index) => {
    const slot = index + 1;
    return `O${slot} <img src="assets/pets/Abomination.png" class="log-pet-icon" alt="Abomination">(50/50)`;
  }).join(' ');
  return `${playerSide} | ${opponentTokens}`;
}

describe('Fight animation Pandora positional targeting', () => {
  it('applies repeated "gave" equipment logs to each indexed opponent slot', () => {
    const board = buildOpponentAbominationBoard();
    const player = { isOpponent: false } as const;
    const opponent = { isOpponent: true } as const;
    const logs: Array<Record<string, unknown>> = [{ type: 'board', message: board }];

    for (let index = 1; index <= 5; index += 1) {
      logs.push({
        type: 'ability',
        message: 'Pandoras Box gave Abomination Carrot.',
        player,
        sourcePet: { name: 'Abomination', parent: opponent },
        sourceIndex: index,
      });
    }

    const frames = buildFightAnimationFrames(logs as never);

    expect(frames).toHaveLength(6);
    for (let index = 1; index <= 5; index += 1) {
      const frame = frames[index];
      const change = frame.equipmentChanges.find(
        (entry) => entry.action === 'added',
      );
      expect(change).toMatchObject({
        side: 'opponent',
        slot: index - 1,
        equipmentName: 'Carrot',
      });
    }

    const finalOpponentSlots = frames[5].opponentSlots;
    for (let slot = 0; slot < 5; slot += 1) {
      expect(finalOpponentSlots[slot].equipmentName).toBe('Carrot');
    }
  });
});
