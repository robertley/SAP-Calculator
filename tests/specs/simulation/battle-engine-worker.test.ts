import { afterEach, describe, expect, it, vi } from 'vitest';
import type { FightOptimizerResult, SimulationConfig } from 'sap-battle-engine';

afterEach(() => { vi.unstubAllGlobals(); });

describe('battle engine worker', () => {
  it('posts cloneable progress and detailed results without an Angular injector', async () => {
    let receive: ((event: MessageEvent) => void) | undefined;
    const messages: Array<{ type: string; result?: unknown; progress?: unknown }> = [];
    vi.stubGlobal('addEventListener', (name: string, listener: (event: MessageEvent) => void) => {
      if (name === 'message') receive = listener;
    });
    vi.stubGlobal('postMessage', (message: (typeof messages)[number]) => { messages.push(structuredClone(message)); });
    await import('app/integrations/simulation/simulation.worker');
    const config: SimulationConfig = {
      playerPack: 'Turtle', opponentPack: 'Turtle', turn: 1,
      playerPets: [{ name: 'Fish', attack: 5, health: 6 }],
      opponentPets: [{ name: 'Ant', attack: 2, health: 1 }],
      simulationCount: 2, logsEnabled: true, optimizeDeterministicSimulations: false,
    };
    receive?.({ data: { type: 'start', config, progressInterval: 1 } } as MessageEvent);
    expect(messages.some((message) => message.type === 'progress')).toBe(true);
    const result = messages.find((message) => message.type === 'result')
      ?.result as
      | {
          playerWins: number;
          battles?: Array<{
            finalBoard?: unknown;
            logs: Array<{ board?: unknown }>;
          }>;
        }
      | undefined;
    expect(result?.playerWins).toBe(2);
    expect(result?.battles?.[0].finalBoard).toBeDefined();
    expect(result?.battles?.[0].logs[0].board).toBeDefined();

    const repeatedLineup = Array.from(
      { length: 5 },
      () => ({ name: 'Fish', attack: 5, health: 6 }),
    );
    receive?.({
      data: {
        type: 'optimize-fight-start',
        config: {
          ...config,
          playerPets: repeatedLineup,
          opponentPets: repeatedLineup,
        },
        options: { maxSimulations: 100 },
      },
    } as MessageEvent);
    expect(
      messages.some((message) => message.type === 'fight-optimizer-progress'),
    ).toBe(true);
    const optimization = messages.find(
      (message) => message.type === 'fight-optimizer-result',
    )?.result as FightOptimizerResult | undefined;
    expect(optimization?.evidence).toBe('sampled');
    expect(optimization?.finalPosition.playerOrder).toHaveLength(5);
    expect(optimization?.positionings.player.length).toBeGreaterThan(0);
    expect(optimization?.stats.simulations).toBeGreaterThan(0);
  });
});
