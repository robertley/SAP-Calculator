import { describe, expect, it } from 'vitest';
import {
  createBaseConfig,
  createPet,
  runBattleLogs,
} from '../../support/battle-test-runtime';

const SELF_REMOVING_PETS = [
  'Pygmy Seahorse',
  'Leafy Sea Dragon',
  'Moby Dick',
] as const;

describe('self-removing pets', () => {
  for (const petName of SELF_REMOVING_PETS) {
    it(`${petName} is removed without fainting`, () => {
      const config = createBaseConfig('Custom');
      config.playerPets[0] = createPet(petName, { attack: 4, health: 4 });
      config.playerPets[1] = createPet('Ant', { attack: 4, health: 4 });
      config.opponentPets[1] = createPet('Cuckoo', { attack: 4, health: 4 });

      const messages = runBattleLogs(config).map((log) => log.message ?? '');

      expect(messages).not.toContain(`${petName} fainted.`);
      expect(messages).not.toContain(
        'Cuckoo summoned Cuckoo Chick for the enemy Early.',
      );
    });
  }
});
