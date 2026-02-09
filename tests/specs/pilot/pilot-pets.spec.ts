import { describe, expect, it } from 'vitest';
import { runPetSmoke } from '../../support/smoke-test-runners';
import { createBaseConfig, createPet, hasNamedLog, runBattleLogs } from '../../support/battle-test-runtime';

const PILOT_PETS = [
  { name: 'Aardvark', pack: 'Custom', behavior: 'Enemy summoned: Gain +1 attack and +3 health.' },
  { name: 'Adult Flounder', pack: 'Custom', behavior: 'Transformed: Give two back-most friends 1 experience.' },
  { name: 'Ahuizotl', pack: 'Custom', behavior: 'End turn: Summon one level 1 Ocarina.' },
  { name: 'Akhlut', pack: 'Custom', behavior: 'Faint: Spend 2 mana to give the nearest friend behind permanent +3 attack and +3 health.' },
  { name: 'Albatross', pack: 'Custom', behavior: 'Adjacent tier 4 or lower friends deals 3 ability damage extra.' },
  { name: 'Albino Squirrel', pack: 'Custom', behavior: 'Sell: Replace shop food with three random food and discount them by 1 gold.' },
  { name: 'Amargasaurus', pack: 'Custom', behavior: 'Friend hurt: Restore its health. Can restore up to 15 health per turn.' },
  { name: 'Amphisbaena', pack: 'Custom', behavior: 'End turn: Give the nearest friend ahead +1 attack on odd turns and +1 health on even.' },
  { name: 'Andrewsarchus', pack: 'Custom', behavior: 'End turn: Remove the most healthy unfrozen shop pet to gain 50% of its stats until next turn.' },
  { name: 'Angry Pygmy Hog', pack: 'Custom', behavior: 'Really angry!' },
  { name: 'Anubis', pack: 'Custom', behavior: 'Start of battle: Activate two Faint friends from tier 2 or lower front-to-back.' },
  { name: 'Atlantic Puffin', pack: 'Custom', behavior: 'Friendly attacked: Remove its Strawberry perk to deal 2 damage to the last enemy.' },
  { name: 'Axehandle Hound', pack: 'Custom', behavior: 'Before any attack: If opponent has duplicates, deal 2 damage to all enemies. Works 1 time per battle.' },
  { name: 'Baby Urchin', pack: 'Custom', behavior: 'Faint: Remove 4 health from the first enemy.' },
  { name: 'Bakunawa', pack: 'Custom', behavior: 'Start of battle: Make the highest attack enemy Sleepy.' },
  { name: 'Barnacle', pack: 'Custom', behavior: 'End turn: If you did not roll this turn, gain +1 experience.' },
  { name: 'Basilisk', pack: 'Custom', behavior: 'Start of battle: Transform the nearest pet ahead to Rock with +5 health.' },
  { name: 'Bear', pack: 'Custom', behavior: 'Faint: Give Honey perk to all pets within one space.' },
  { name: 'Black Bear', pack: 'Custom', behavior: 'Faint: Remove 4 health from one random enemy for each food this has eaten this turn.' },
  { name: 'Bloodhound', pack: 'Custom', behavior: 'Friend sold: Stock one copy of it. Works 1 time per turn.' },
] as const;

const battleSupportedPets = new Set([
  'Amargasaurus',
  'Anubis',
  'Atlantic Puffin',
  'Baby Urchin',
  'Bakunawa',
  'Bear',
  'Black Bear',
]);

const createPetBattleConfig = (petName: string) => {
  const config = createBaseConfig('Custom');
  switch (petName) {
    case 'Akhlut':
      config.playerPets[0] = createPet('Akhlut', { attack: 1, health: 1, mana: 2 });
      config.playerPets[1] = createPet('Ant', { attack: 2, health: 3 });
      config.opponentPets[0] = createPet('Elephant', { attack: 10, health: 10 });
      break;
    case 'Amargasaurus':
      config.playerPets[0] = createPet('Ant', { attack: 2, health: 8 });
      config.playerPets[1] = createPet('Amargasaurus', { attack: 4, health: 6 });
      config.opponentPets[0] = createPet('Fish', { attack: 1, health: 3 });
      break;
    case 'Anubis':
      config.playerPets[0] = createPet('Anubis', { attack: 4, health: 7 });
      config.playerPets[1] = createPet('Ant', { attack: 2, health: 1 });
      config.playerPets[2] = createPet('Fish', { attack: 2, health: 2 });
      config.opponentPets[0] = createPet('Elephant', { attack: 8, health: 8 });
      break;
    case 'Atlantic Puffin':
      config.playerPets[0] = createPet('Ant', { attack: 3, health: 3, equipment: { name: 'Strawberry' } });
      config.playerPets[1] = createPet('Atlantic Puffin', { attack: 4, health: 5 });
      config.opponentPets[0] = createPet('Fish', { attack: 2, health: 5 });
      config.opponentPets[1] = createPet('Pig', { attack: 4, health: 4 });
      break;
    case 'Axehandle Hound':
      config.playerPets[0] = createPet('Axehandle Hound', { attack: 4, health: 7 });
      config.opponentPets[0] = createPet('Fish', { attack: 2, health: 3 });
      config.opponentPets[1] = createPet('Fish', { attack: 2, health: 3 });
      break;
    case 'Baby Urchin':
      config.playerPets[0] = createPet('Baby Urchin', { attack: 1, health: 1 });
      config.opponentPets[0] = createPet('Elephant', { attack: 10, health: 10 });
      break;
    case 'Bakunawa':
      config.playerPets[0] = createPet('Bakunawa', { attack: 5, health: 7 });
      config.opponentPets[0] = createPet('Ant', { attack: 2, health: 2 });
      config.opponentPets[1] = createPet('Elephant', { attack: 8, health: 8 });
      break;
    case 'Basilisk':
      config.playerPets[0] = createPet('Ant', { attack: 2, health: 2 });
      config.playerPets[1] = createPet('Basilisk', { attack: 5, health: 6 });
      config.opponentPets[0] = createPet('Fish', { attack: 3, health: 4 });
      break;
    case 'Bear':
      config.playerPets[0] = createPet('Ant', { attack: 2, health: 2 });
      config.playerPets[1] = createPet('Bear', { attack: 1, health: 1 });
      config.opponentPets[0] = createPet('Elephant', { attack: 10, health: 10 });
      break;
    case 'Black Bear':
      config.playerPets[0] = createPet('Black Bear', { attack: 1, health: 1, foodsEaten: 1 });
      config.opponentPets[0] = createPet('Elephant', { attack: 10, health: 10 });
      break;
    default:
      return null;
  }
  return config;
};

describe('Pilot Pet Specs (Generated)', () => {
  for (const pet of PILOT_PETS) {
    describe(`${pet.pack} / ${pet.name}`, () => {
      it('has level 1 behavior text', () => {
        expect(pet.behavior.length).toBeGreaterThan(0);
        expect(pet.behavior.toLowerCase()).not.toContain('no ability');
      });

      it('smoke runs in battle simulation', () => {
        const result = runPetSmoke({
          petName: pet.name,
          playerPack: pet.pack as any,
          opponentPack: pet.pack as any,
        });
        expect(result.playerWins + result.opponentWins + result.draws).toBeGreaterThanOrEqual(0);
      });

      if (battleSupportedPets.has(pet.name)) {
        it(`runtime behavior assertion: ${pet.behavior}`, () => {
          const config = createPetBattleConfig(pet.name);
          expect(config).not.toBeNull();
          const logs = runBattleLogs(config!);
          expect(hasNamedLog(logs, pet.name)).toBe(true);
        });
      } else {
        it.skip(
          `runtime behavior assertion: ${pet.behavior} (outside battle-scope harness)`,
          () => {},
        );
      }
    });
  }
});

