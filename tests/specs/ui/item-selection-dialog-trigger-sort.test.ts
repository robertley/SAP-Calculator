import { describe, expect, it } from 'vitest';
import {
  extractTriggerCategory,
  getTriggerFilterEntries,
  getTriggerCategories,
  getGroupedTriggerCategories,
  IndexedSelectionItem,
  resolveTriggerGroupLabel,
  sortItemsByTrigger,
} from 'app/ui/components/item-selection-dialog/item-selection-catalog.service';

function makeIndexedItem(
  name: string,
  triggerCategory: string,
  options?: Partial<IndexedSelectionItem>,
): IndexedSelectionItem {
  return {
    name,
    displayName: name,
    tier: 1,
    type: 'pet',
    category: 'Tier 1',
    searchName: name.toLowerCase(),
    searchDisplayName: name.toLowerCase(),
    triggerCategory,
    ...options,
  };
}

describe('extractTriggerCategory', () => {
  it('uses the leading trigger phrase from leveled abilities', () => {
    expect(
      extractTriggerCategory(
        'Lv1: Start of battle: Give the nearest friend ahead +1 mana.',
      ),
    ).toBe('Start of battle');
  });

  it('falls back to Passive when an ability has no trigger prefix', () => {
    expect(extractTriggerCategory('Gain +1 attack and +2 health.')).toBe(
      'Passive',
    );
  });

  it('collapses numbered trigger names to their base label', () => {
    expect(extractTriggerCategory('EnemyAttacked7: Deal 7 damage.')).toBe(
      'Enemy Attacked',
    );
  });
});

describe('trigger sort helpers', () => {
  it('orders triggers by phase, attack, priority, passive, then shop', () => {
    expect(
      getTriggerCategories([
        makeIndexedItem('Alpha', 'This hurt'),
        makeIndexedItem('Gamma', 'End turn'),
        makeIndexedItem('Zulu', 'Before battle'),
        makeIndexedItem('Bravo', 'Start of battle'),
        makeIndexedItem('Delta', 'Passive'),
        makeIndexedItem('Eta', 'EnemyAttacked7'),
      ]),
    ).toEqual([
      'Before battle',
      'Start of battle',
      'EnemyAttacked7',
      'This hurt',
      'Passive',
      'End turn',
    ]);
  });

  it('maps ordered triggers into UX groups', () => {
    expect(
      getGroupedTriggerCategories([
        makeIndexedItem('Alpha', 'Before battle'),
        makeIndexedItem('Beta', 'EnemyAttacked7'),
        makeIndexedItem('Gamma', 'This hurt'),
        makeIndexedItem('Delta', 'End turn'),
        makeIndexedItem('Epsilon', 'This bought'),
        makeIndexedItem('Zeta', 'Passive'),
      ]),
    ).toEqual([
      { label: 'Battle Phases', categories: ['Before battle'] },
      { label: 'Attack Result Triggers', categories: ['EnemyAttacked7'] },
      { label: 'Hurt Events', categories: ['This hurt'] },
      { label: 'Passive', categories: ['Passive'] },
      { label: 'Shop Flow', categories: ['End turn'] },
      { label: 'Shop Buy/Sell', categories: ['This bought'] },
    ]);
  });

  it('keeps attack and shop subgroup order aligned with their source arrays', () => {
    expect(
      getGroupedTriggerCategories([
        makeIndexedItem('Alpha', 'EnemyAttacked7'),
        makeIndexedItem('Beta', 'Before attacks'),
        makeIndexedItem('Gamma', 'End turn'),
        makeIndexedItem('Delta', 'Food bought'),
      ]),
    ).toEqual([
      { label: 'Pre-Attack Triggers', categories: ['Before attacks'] },
      { label: 'Attack Result Triggers', categories: ['EnemyAttacked7'] },
      { label: 'Shop Flow', categories: ['End turn'] },
      { label: 'Shop Food', categories: ['Food bought'] },
    ]);
  });

  it('flattens single-trigger groups for the dropdown while keeping order', () => {
    expect(
      getTriggerFilterEntries([
        makeIndexedItem('Alpha', 'Before battle'),
        makeIndexedItem('Beta', 'EnemyAttacked7'),
        makeIndexedItem('Gamma', 'Enemy Attacked'),
        makeIndexedItem('Delta', 'End turn'),
      ]),
    ).toEqual([
      { type: 'single', category: 'Before battle' },
      {
        type: 'group',
        label: 'Attack Result Triggers',
        categories: ['Enemy Attacked', 'EnemyAttacked7'],
      },
      { type: 'single', category: 'End turn' },
    ]);
  });

  it('resolves trigger group labels using normalized trigger keys', () => {
    expect(resolveTriggerGroupLabel('EnemyAttacked2')).toBe('Attack Result Triggers');
    expect(resolveTriggerGroupLabel('End turn')).toBe('Shop Flow');
  });

  it('sorts items by trigger, then tier, then name', () => {
    const items = sortItemsByTrigger([
      makeIndexedItem('Zulu', 'End turn'),
      makeIndexedItem('Gamma', 'EnemyAttacked7', { tier: 2, pack: 'Puppy' }),
      makeIndexedItem('Alpha', 'EnemyAttacked2', { tier: 1, pack: 'Turtle' }),
      makeIndexedItem('Beta', 'Passive', { tier: 1 }),
    ]);

    expect(items.map((item) => item.name)).toEqual([
      'Alpha',
      'Gamma',
      'Beta',
      'Zulu',
    ]);
    expect(items.at(-1)?.name).toBe('Zulu');
  });
});
