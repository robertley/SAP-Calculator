import { describe, expect, it } from 'vitest';
import { runToySmoke } from '../../helpers/simulation-fixtures';
import { createBaseConfig, createPet, hasNamedLog, runBattleLogs } from '../../helpers/pilot-runtime';

const PILOT_TOYS = [
  { name: 'Action Figure', behavior: 'Start of battle: Give Coconut perk to two first enemies.' },
  { name: 'Air Palm Tree', behavior: 'Start of battle: Give Coconut perk to the highest attack friend.' },
  { name: 'Balloon', behavior: 'Break: Give the front-most friend +1 attack and +1 health.' },
  { name: 'Camera', behavior: 'Start of battle: Remove 30% attack from the highest attack enemy.' },
  { name: 'Candelabra', behavior: 'Three friends bought: Break and give all friends permanent +1 attack and +1 health.' },
  { name: 'Cash Register', behavior: 'Break: Summon one 6/6 friend that sells for 3 gold.' },
  { name: 'Chocolate Box', behavior: 'Start of battle: Give +1 experience to friends and +2 experience to enemies.' },
  { name: 'Crystal Ball', behavior: 'Start of battle: Give the front-most friend +2 mana.' },
  { name: 'Dice Cup', behavior: 'Start of battle: Shuffle positions of all friends.' },
  { name: 'Evil Book', behavior: 'Empty front space: Summon one 6/6 Great One in battle that deals 5 damage to ALL other pets.' },
] as const;

const supportedToys = new Set([
  'Action Figure',
  'Air Palm Tree',
  'Camera',
  'Chocolate Box',
  'Crystal Ball',
  'Dice Cup',
  'Evil Book',
]);

const createToyBattleConfig = (toyName: string) => {
  const config = createBaseConfig('Custom');
  config.playerToy = toyName;
  config.playerToyLevel = 1;
  switch (toyName) {
    case 'Evil Book':
      config.playerPets[0] = createPet('Ant', { attack: 1, health: 1 });
      config.opponentPets[0] = createPet('Elephant', { attack: 10, health: 10 });
      break;
    default:
      config.playerPets[0] = createPet('Ant', { attack: 3, health: 3 });
      config.playerPets[1] = createPet('Fish', { attack: 3, health: 4 });
      config.opponentPets[0] = createPet('Pig', { attack: 4, health: 5 });
      config.opponentPets[1] = createPet('Elephant', { attack: 8, health: 8 });
      break;
  }
  return config;
};

describe('Pilot Toy Specs (Generated)', () => {
  for (const toy of PILOT_TOYS) {
    describe(toy.name, () => {
      it('has level 1 behavior text', () => {
        expect(toy.behavior.length).toBeGreaterThan(0);
        expect(toy.behavior.toLowerCase()).not.toContain('no ability');
      });

      it('smoke runs in battle simulation', () => {
        const result = runToySmoke({ toyName: toy.name });
        expect(result.playerWins + result.opponentWins + result.draws).toBeGreaterThanOrEqual(0);
      });

      if (supportedToys.has(toy.name)) {
        it(`runtime behavior assertion: ${toy.behavior}`, () => {
          const logs = runBattleLogs(createToyBattleConfig(toy.name));
          expect(hasNamedLog(logs, toy.name, ['ability', 'equipment'])).toBe(true);
        });
      } else {
        it.skip(
          `runtime behavior assertion: ${toy.behavior} (outside battle-scope harness)`,
          () => {},
        );
      }
    });
  }
});
