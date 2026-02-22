import { describe, expect, it } from 'vitest';
import { decorateInlineIcons } from '../../../src/app/integrations/log/log-inline-icons';
import { parseLogMessage } from '../../../src/app/ui/shell/simulation/app.component.simulation-log';

const NEVER_MATCH_INLINE_NAMES = /x^/g;
const INLINE_NAME_TYPE_MAP = new Map<string, 'pet' | 'toy' | 'equipment'>();
const AILMENT_NAMES = new Set<string>();

describe('log inline icons', () => {
  it('decorates gold mentions with the gold icon', () => {
    const decorated = decorateInlineIcons(
      'Pig gained 2 gold and spent 1 Gold.',
      NEVER_MATCH_INLINE_NAMES,
      INLINE_NAME_TYPE_MAP,
      AILMENT_NAMES,
    );

    const goldMatches =
      decorated.match(/TextMap-resources\.assets-31-split\/gold\.png/g) ?? [];
    expect(goldMatches).toHaveLength(2);
    expect(decorated).toContain('gold');
  });

  it('does not decorate "gold" inside larger words', () => {
    const decorated = decorateInlineIcons(
      'Golden Retriever gained 2 gold.',
      NEVER_MATCH_INLINE_NAMES,
      INLINE_NAME_TYPE_MAP,
      AILMENT_NAMES,
    );

    const goldMatches =
      decorated.match(/TextMap-resources\.assets-31-split\/gold\.png/g) ?? [];
    expect(goldMatches).toHaveLength(1);
    expect(decorated).toContain('Golden Retriever');
  });

  it('surfaces gold icons through parsed log message parts for animation text', () => {
    const decorated = decorateInlineIcons(
      'Weasel gained 1 gold.',
      NEVER_MATCH_INLINE_NAMES,
      INLINE_NAME_TYPE_MAP,
      AILMENT_NAMES,
    );
    const parts = parseLogMessage(decorated);

    const goldPart = parts.find(
      (part) =>
        part.type === 'img' &&
        part.src.includes('TextMap-resources.assets-31-split/gold.png'),
    );
    expect(goldPart).toBeDefined();
  });
});
