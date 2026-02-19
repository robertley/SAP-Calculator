import { describe, expect, it, vi } from 'vitest';
import {
  createBaseConfig,
  createPet,
  runBattleLogs,
} from '../../support/battle-test-runtime';

describe('Amami Rabbit and Dove null-safety regressions', () => {
  it('Amami Rabbit should not error when no enemy exists at StartBattle', () => {
    const config = createBaseConfig('Danger');
    config.playerPets[0] = createPet('Amami Rabbit', { attack: 2, health: 3 });

    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    let errorText = '';
    try {
      runBattleLogs(config);
      errorText = errorSpy.mock.calls.flat().map(String).join(' ');
    } finally {
      errorSpy.mockRestore();
    }

    expect(errorText).not.toContain('AmamiRabbitAbility');
  });

  it('Dove should handle Strawberry buffs when back-most friend has no equipment', () => {
    const config = createBaseConfig('Custom');
    config.playerPets[0] = createPet('Dove', { attack: 1, health: 1 });
    config.playerPets[1] = createPet('Ant', {
      attack: 3,
      health: 5,
      equipment: { name: 'Strawberry' },
    });
    config.playerPets[2] = createPet('Fish', {
      attack: 3,
      health: 5,
      equipment: null,
    });
    config.opponentPets[0] = createPet('Elephant', { attack: 50, health: 50 });

    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    let errorText = '';
    let logs: ReturnType<typeof runBattleLogs> = [];
    try {
      logs = runBattleLogs(config);
      errorText = errorSpy.mock.calls.flat().map(String).join(' ');
    } finally {
      errorSpy.mockRestore();
    }

    expect(errorText).not.toContain('DoveAbility');
    expect(
      logs.some(
        (log) =>
          log.type === 'ability' &&
          typeof log.message === 'string' &&
          log.message.includes("Dove activated Ant's Strawberry."),
      ),
    ).toBe(true);
  });

  it('Spider should not error when dependent callers do not provide tier pool maps', () => {
    const config = createBaseConfig('Custom');
    config.playerPack = 'MissingPack';
    config.opponentPack = 'MissingPack';
    config.playerPets[0] = createPet('Spider', { attack: 1, health: 1 });
    config.opponentPets[0] = createPet('Elephant', { attack: 50, health: 50 });

    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    let errorText = '';
    let logs: ReturnType<typeof runBattleLogs> = [];
    try {
      logs = runBattleLogs(config);
      errorText = errorSpy.mock.calls.flat().map(String).join(' ');
    } finally {
      errorSpy.mockRestore();
    }

    expect(errorText).not.toContain('SpiderAbility');
    expect(
      logs.some(
        (log) =>
          log.type === 'ability' &&
          typeof log.message === 'string' &&
          log.message.includes('Spider spawned'),
      ),
    ).toBe(true);
  });
});
