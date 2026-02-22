import { describe, expect, it } from 'vitest';
import { parseLogMessage } from '../../../src/app/ui/shell/simulation/app.component.simulation-log';

describe('log message positional prefix rendering', () => {
  it('marks positional prefix text as a dedicated styled part', () => {
    const parts = parseLogMessage(
      '[O3->O1] Abomination sniped Giant Pangasius for 1.',
    );

    expect(parts[0]).toMatchObject({
      type: 'text',
      text: '[O3->O1] ',
      className: 'log-position-prefix',
    });
    expect(parts[1]).toMatchObject({
      type: 'text',
      text: 'Abomination sniped Giant Pangasius for 1.',
    });
  });
});
