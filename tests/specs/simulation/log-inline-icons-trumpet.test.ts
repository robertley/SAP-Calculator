import { describe, expect, it } from 'vitest';
import { decorateInlineIcons } from '../../../src/app/integrations/log/log-inline-icons';

describe('log inline trumpet icons', () => {
  it('adds trumpet icon markup for trumpet and trumpets words', () => {
    const message = 'Ant gained 3 trumpets and later spent 1 trumpet.';
    const decorated = decorateInlineIcons(
      message,
      /\b__never__\b/g,
      new Map(),
      new Set(),
    );

    expect(decorated).toContain(
      'assets/art/Public/Public/Icons/TextMap-resources.assets-31-split/trumpet.png',
    );
    expect(decorated).toContain('<img');
  });
});
