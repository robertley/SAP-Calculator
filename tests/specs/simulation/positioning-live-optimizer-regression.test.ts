import { CalculatorBattleEngine } from 'app/integrations/simulation/battle-engine';
import { describe, expect, it } from 'vitest';
import {
  expandCompactCalculatorState,
  parseImportPayload,
} from 'app/ui/shell/state/app.component.share';
import { LogService } from 'app/integrations/log.service';
import { getOptimizedPositioningLineup } from 'app/integrations/replay/replay-positioning-image.service';
import {
  PetConfig,
  SimulationConfig,
} from '../../../src/app/domain/interfaces/simulation-config.interface';
import { runPositioningOptimization } from '../../../src/app/integrations/simulation/positioning-optimizer';

function createSimulationRunner(logService: LogService): CalculatorBattleEngine {
  return new CalculatorBattleEngine(logService);
}

function clonePet(pet: PetConfig | null): PetConfig | null {
  if (!pet) {
    return null;
  }
  return {
    ...pet,
    equipment: pet.equipment ? { ...pet.equipment } : null,
  };
}

function cloneLineup(lineup: (PetConfig | null)[]): (PetConfig | null)[] {
  return lineup.map((pet) => clonePet(pet));
}

function buildConfig(
  state: SimulationConfig,
  playerPets: (PetConfig | null)[],
  simulationCount: number,
): SimulationConfig {
  return {
    ...state,
    playerPets: cloneLineup(playerPets),
    opponentPets: cloneLineup(state.opponentPets ?? []),
    simulationCount,
    logsEnabled: false,
    maxLoggedBattles: 0,
  };
}

describe('positioning optimizer live-board regression', () => {
  it(
    'returns projected state that must be applied with the optimized order',
    () => {
      const payload =
        'SAPC1:eyJwUCI6IlVuaWNvcm4iLCJwVEwiOiIxIiwib1RMIjoiMSIsInBIVEwiOiIxIiwib0hUTCI6IjEiLCJ0IjoxNSwicEdTIjoyMSwicCI6W3sibiI6IlBpeGl1IiwiYSI6MjgsImgiOjI2LCJlIjo0LCJlcSI6eyJuIjoiR2luZ2VyYnJlYWQgTWFuIn19LHsibiI6IkN5Y2xvcHMiLCJhIjoyOCwiaCI6MjgsImUiOjEsImVxIjp7Im4iOiJHaW5nZXJicmVhZCBNYW4ifX0seyJuIjoiV29ybSBvZiBTYW5kIiwiYSI6MTAsImgiOjcsImUiOjUsIm0iOjF9LHsibiI6IkJhZCBEb2ciLCJhIjoyMywiaCI6MjcsImUiOjUsImVxIjp7Im4iOiJQb3Bjb3JuIn0sIm0iOjJ9LHsibiI6Ik1hbnRpY29yZSIsImEiOjcsImgiOjR9XSwibyI6W3sibiI6IlJvb3N0ZXIiLCJhIjo4LCJoIjo3LCJlIjoyLCJlcSI6eyJuIjoiSG9uZXkifX0seyJuIjoiU2hlZXAiLCJhIjo0LCJoIjo0LCJlIjoyLCJlcSI6eyJuIjoiTXVzaHJvb20ifX0seyJuIjoiRmx5IiwiYSI6NiwiaCI6NiwiZSI6Mn0seyJuIjoiVHVya2V5IiwiYSI6NSwiaCI6NiwiZSI6Mn0seyJuIjoiU2hhcmsiLCJhIjoyLCJoIjoyLCJlcSI6eyJuIjoiTWVsb24ifX1dLCJtIjp0cnVlLCJwUkEiOjksIm9SQSI6MSwib0wzIjoxLCJwU0EiOjEsInNhIjp0cnVlfQ';
      const state = expandCompactCalculatorState(
        parseImportPayload(payload),
      ) as SimulationConfig;
      const optimizerRunner = createSimulationRunner(new LogService());
      const verifierRunner = createSimulationRunner(new LogService());
      const simulationCount = 50;
      const config = buildConfig(state, state.playerPets ?? [], simulationCount);

      const projected = runPositioningOptimization({
        baseConfig: config,
        options: {
          side: 'player',
          maxSimulationsPerPermutation: simulationCount,
          batchSize: Math.min(25, simulationCount),
          minSamplesBeforeElimination: Math.min(50, simulationCount),
          confidenceZ: 1.96,
        },
        projectEndTurnLineup: ({ baseConfig, side, lineup }) =>
          optimizerRunner.projectLineupAfterEndTurn(baseConfig, side, lineup),
        simulateBatch: (batchConfig) => optimizerRunner.run(batchConfig),
      });

      const rawAppliedResult = verifierRunner.run(
        buildConfig(state, projected.bestPermutation.lineup, simulationCount),
      );
      const projectedAppliedResult = verifierRunner.run(
        buildConfig(
          state,
          projected.bestPermutation.simulationLineup,
          simulationCount,
        ),
      );
      const replayImageAppliedResult = verifierRunner.run(
        buildConfig(
          state,
          getOptimizedPositioningLineup(projected),
          simulationCount,
        ),
      );

      expect(rawAppliedResult.playerWins).toBeLessThan(simulationCount);
      expect(projectedAppliedResult.playerWins).toBe(simulationCount);
      expect(replayImageAppliedResult).toEqual(projectedAppliedResult);
    },
    120000,
  );
});
