import { describe, expect, it, vi } from 'vitest';
import {
  ReplayCalcParser,
  ReplayCalculatorState,
} from '../../../src/app/integrations/replay/replay-calc-parser';
import { UrlStateService } from '../../../src/app/runtime/state/url-state.service';

describe('replay toy calculator links', () => {
  it('round-trips Unicode state through the generated URL', () => {
    vi.stubGlobal('window', {
      location: {
        origin: 'https://sap-calculator.com',
        pathname: '/',
        search: '',
        hash: '',
      },
    });

    const state = {
      playerToy: 'Café Toy 🐾',
      playerToyLevel: '2',
      customPacks: [],
      playerPets: [],
      opponentPets: [],
    } as ReplayCalculatorState;
    const link = new ReplayCalcParser().generateCalculatorLink(state);
    const url = new URL(link);

    expect(url.hash.slice(1).split('=')[1]).toMatch(/^[A-Za-z0-9_-]+$/);

    vi.stubGlobal('window', {
      location: {
        search: url.search,
        hash: url.hash,
      },
    });

    expect(new UrlStateService().parseCalculatorStateFromUrl()).toEqual({
      state: {
        playerToy: 'Café Toy 🐾',
        playerToyLevel: '2',
      },
    });

    vi.unstubAllGlobals();
  });
});
