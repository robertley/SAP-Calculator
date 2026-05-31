import { describe, expect, it } from 'vitest';
import { Pet } from '../../../src/app/domain/entities/pet.class';
import { Player } from '../../../src/app/domain/entities/player.class';
import { LogService } from '../../../src/app/integrations/log.service';

describe('LogService decoration regressions', () => {
  it('keeps source and target side labels when a fainted source is no longer in a slot', () => {
    const playerRecord: Record<string, unknown> = { isOpponent: false };
    const opponentRecord: Record<string, unknown> = { isOpponent: true };
    playerRecord['opponent'] = opponentRecord;
    opponentRecord['opponent'] = playerRecord;

    const player = playerRecord as unknown as Player;
    const opponent = opponentRecord as unknown as Player;
    const sourcePet = {
      name: 'Sea Serpent',
      parent: player,
      savedPosition: 0,
    } as unknown as Pet;
    const targetPet = {
      name: 'Sea Serpent',
      parent: opponent,
      savedPosition: 0,
    } as unknown as Pet;

    playerRecord['pet0'] = null;
    opponentRecord['pet0'] = targetPet;

    const logService = new LogService();
    logService.createLog({
      message: 'Sea Serpent sniped Sea Serpent for 9.',
      type: 'attack',
      player,
      sourcePet,
      targetPet,
    });

    const text = String(logService.getLogs()[0]?.message ?? '')
      .replace(/<[^>]+>/g, '')
      .replace(/\s+/g, ' ');
    expect(text).toContain('P1 Sea Serpent sniped O1 Sea Serpent for 9.');
  });
});
