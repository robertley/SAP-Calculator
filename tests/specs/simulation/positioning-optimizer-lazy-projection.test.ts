import { describe, expect, it } from 'vitest';
import {
  expandCompactCalculatorState,
  parseImportPayload,
} from 'app/ui/shell/state/app.component.share';
import { SimulationConfig } from 'app/domain/interfaces/simulation-config.interface';
import { runPositioningOptimization } from '../../../src/app/integrations/simulation/positioning-optimizer';

const OPTIMIZER_STOP = new Error('optimizer-stop-after-first-batch');

function buildConfig(state: SimulationConfig): SimulationConfig {
  return {
    ...state,
    simulationCount: 1,
    logsEnabled: false,
    maxLoggedBattles: 0,
  };
}

describe('positioning optimizer lazy projections', () => {
  it('does not project every permutation before the first simulation batch', () => {
    const payload =
      'SAPC1:eyJwUCI6IlVuaWNvcm4iLCJwVEwiOiIxIiwib1RMIjoiMSIsInBIVEwiOiIxIiwib0hUTCI6IjEiLCJ0IjoxNSwicEdTIjoyMSwicCI6W3sibiI6IlBpeGl1IiwiYSI6MjgsImgiOjI2LCJlIjo0LCJlcSI6eyJuIjoiR2luZ2VyYnJlYWQgTWFuIn19LHsibiI6IkN5Y2xvcHMiLCJhIjoyOCwiaCI6MjgsImUiOjEsImVxIjp7Im4iOiJHaW5nZXJicmVhZCBNYW4ifX0seyJuIjoiV29ybSBvZiBTYW5kIiwiYSI6MTAsImgiOjcsImUiOjUsIm0iOjF9LHsibiI6IkJhZCBEb2ciLCJhIjoyMywiaCI6MjcsImUiOjUsImVxIjp7Im4iOiJQb3Bjb3JuIn0sIm0iOjJ9LHsibiI6Ik1hbnRpY29yZSIsImEiOjcsImgiOjR9XSwibyI6W3sibiI6IlJvb3N0ZXIiLCJhIjo4LCJoIjo3LCJlIjoyLCJlcSI6eyJuIjoiSG9uZXkifX0seyJuIjoiU2hlZXAiLCJhIjo0LCJoIjo0LCJlIjoyLCJlcSI6eyJuIjoiTXVzaHJvb20ifX0seyJuIjoiRmx5IiwiYSI6NiwiaCI6NiwiZSI6Mn0seyJuIjoiVHVya2V5IiwiYSI6NSwiaCI6NiwiZSI6Mn0seyJuIjoiU2hhcmsiLCJhIjoyLCJoIjoyLCJlcSI6eyJuIjoiTWVsb24ifX1dLCJtIjp0cnVlfQ';
    const state = expandCompactCalculatorState(
      parseImportPayload(payload),
    ) as SimulationConfig;
    const config = buildConfig(state);
    let projectedLineupsBeforeFirstBatch = 0;

    expect(() =>
      runPositioningOptimization({
        baseConfig: config,
        options: {
          side: 'player',
          maxSimulationsPerPermutation: 1,
          batchSize: 1,
          minSamplesBeforeElimination: 1,
          confidenceZ: 1.96,
        },
        projectEndTurnLineup: ({ lineup }) => {
          projectedLineupsBeforeFirstBatch += 1;
          return lineup;
        },
        simulateBatch: () => {
          throw OPTIMIZER_STOP;
        },
      }),
    ).toThrow(OPTIMIZER_STOP);

    expect(projectedLineupsBeforeFirstBatch).toBeLessThanOrEqual(2);
  });
});
