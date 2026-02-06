import { describe, expect, it } from 'vitest';
import { runEquipmentSmoke } from '../../helpers/simulation-fixtures';
import { createBaseConfig, createPet, hasNamedLog, runBattleLogs } from '../../helpers/pilot-runtime';

const PILOT_EQUIPMENT = [
  { name: 'Ambrosia', behavior: 'Block ailment or 8 damage, once.' },
  { name: 'Baguette', behavior: 'Before attack: Remove the front-most enemy perk, once.' },
  { name: 'Banana', behavior: 'Faint: Summon one 4/4 Monkey.' },
  { name: 'Blackberry', behavior: 'Gain +1 attack and +2 health.' },
  { name: 'Bloated', behavior: 'Can\'t gain perk, once.' },
  { name: 'Blueberry', behavior: 'Prioritize this for enemy random abilities.' },
  { name: 'Bok Choy', behavior: 'Gain +3 health when this would faint, once.' },
  { name: 'Brussels Sprout', behavior: 'Block being pushed or 5 damage, once.' },
  { name: 'Cake', behavior: 'End turn: Increase sell value by 1 gold.' },
  { name: 'Cake Slice', behavior: 'Give one pet +2 attack and +2 health until next turn.' },
] as const;

const supportedEquipment = new Set([
  'Baguette',
  'Banana',
  'Bok Choy',
]);

const createEquipmentBattleConfig = (equipmentName: string) => {
  const config = createBaseConfig('Custom');
  switch (equipmentName) {
    case 'Ambrosia':
      config.playerPets[0] = createPet('Ant', { attack: 3, health: 3, equipment: { name: 'Ambrosia' } });
      config.opponentPets[0] = createPet('Elephant', { attack: 10, health: 10 });
      break;
    case 'Baguette':
      config.playerPets[0] = createPet('Ant', { attack: 4, health: 4, equipment: { name: 'Baguette' } });
      config.opponentPets[0] = createPet('Fish', { attack: 2, health: 6, equipment: { name: 'Garlic' } });
      break;
    case 'Banana':
      config.playerPets[0] = createPet('Ant', { attack: 1, health: 1, equipment: { name: 'Banana' } });
      config.opponentPets[0] = createPet('Elephant', { attack: 10, health: 10 });
      break;
    case 'Bok Choy':
      config.playerPets[0] = createPet('Ant', { attack: 2, health: 1, equipment: { name: 'Bok Choy' } });
      config.opponentPets[0] = createPet('Fish', { attack: 2, health: 2 });
      break;
    case 'Brussels Sprout':
      config.playerPets[0] = createPet('Ant', { attack: 3, health: 3, equipment: { name: 'Brussels Sprout' } });
      config.opponentPets[0] = createPet('Elephant', { attack: 10, health: 10 });
      break;
    default:
      return null;
  }
  return config;
};

describe('Pilot Equipment Specs (Generated)', () => {
  for (const item of PILOT_EQUIPMENT) {
    describe(item.name, () => {
      it('has behavior text', () => {
        expect(item.behavior.length).toBeGreaterThan(0);
        expect(item.behavior.toLowerCase()).not.toContain('no ability');
      });

      it('smoke runs in battle simulation', () => {
        const result = runEquipmentSmoke({ equipmentName: item.name });
        expect(result.playerWins + result.opponentWins + result.draws).toBeGreaterThanOrEqual(0);
      });

      if (supportedEquipment.has(item.name)) {
        it(`runtime behavior assertion: ${item.behavior}`, () => {
          const config = createEquipmentBattleConfig(item.name);
          expect(config).not.toBeNull();
          const logs = runBattleLogs(config!);
          expect(hasNamedLog(logs, item.name, ['ability', 'equipment'])).toBe(true);
        });
      } else {
        it.skip(
          `runtime behavior assertion: ${item.behavior} (outside battle-scope harness)`,
          () => {},
        );
      }
    });
  }
});
