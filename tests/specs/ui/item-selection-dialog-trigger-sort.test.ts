import { describe, expect, it } from 'vitest';
import {
  extractTriggerCategory,
  getTriggerCategories,
  IndexedSelectionItem,
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
});

describe('trigger sort helpers', () => {
  it('orders trigger groups and keeps Passive at the end', () => {
    expect(
      getTriggerCategories([
        makeIndexedItem('Gamma', 'Start of battle'),
        makeIndexedItem('Zulu', 'End turn'),
        makeIndexedItem('Delta', 'Passive'),
      ]),
    ).toEqual([
      'All',
      'End turn',
      'Start of battle',
      'Passive',
    ].slice(1));
  });

  it('sorts items by trigger, then tier, then name', () => {
    const items = sortItemsByTrigger([
      makeIndexedItem('Zulu', 'End turn'),
      makeIndexedItem('Gamma', 'Start of battle', { tier: 2, pack: 'Puppy' }),
      makeIndexedItem('Alpha', 'Start of battle', { tier: 1, pack: 'Turtle' }),
      makeIndexedItem('Beta', 'Passive', { tier: 1 }),
    ]);

    expect(items.map((item) => item.name)).toEqual([
      'Zulu',
      'Alpha',
      'Gamma',
      'Beta',
    ]);
    expect(items.at(-1)?.name).toBe('Beta');
  });
});
