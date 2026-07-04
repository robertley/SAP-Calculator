import {
  createBaseConfig,
  createPet,
  runBattleLogs,
} from '../../support/battle-test-runtime';

describe('Parrot copied Ox Melon regression', () => {
  it('gains Melon when the Ox ahead faints', () => {
    const config = createBaseConfig('Turtle');
    config.turn = 7;
    config.playerPets = [
      createPet('Ox', { attack: 1, health: 1 }),
      createPet('Parrot', { attack: 4, health: 10 }),
      null,
      null,
      null,
    ];
    config.opponentPets = [
      createPet('Fish', { attack: 3, health: 20 }),
      null,
      null,
      null,
      null,
    ];

    const logs = runBattleLogs(config);
    const messages = logs.map((log) => String(log?.message ?? ''));

    expect(messages).toContain('Parrot copied Ox');
    expect(messages).toContain("Parrot's Ox gave Parrot Melon.");
    expect(messages).toContain('Fish attacks Parrot for 0. (Melon -20)');
  });
});
