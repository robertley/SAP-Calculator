import { describe, expect, it } from 'vitest';
import { shouldShowNoneSelection } from 'app/ui/components/item-selection-dialog/item-selection-dialog.types';

describe('item selection dialog None option', () => {
  it('is available when selecting an ability', () => {
    expect(shouldShowNoneSelection('ability', '')).toBe(true);
  });

  it('is hidden while searching', () => {
    expect(shouldShowNoneSelection('ability', 'ant')).toBe(false);
  });

  it.each(['swallowed-pet', 'pack', 'team'] as const)(
    'remains unavailable for %s selection',
    (type) => {
      expect(shouldShowNoneSelection(type, '')).toBe(false);
    },
  );
});
