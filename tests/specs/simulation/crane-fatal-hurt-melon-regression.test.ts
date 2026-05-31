import { describe, expect, it } from 'vitest';
import {
  expandCompactCalculatorState,
  parseImportPayload,
} from 'app/ui/shell/state/app.component.share';
import { runSimulation } from '../../../simulation/simulate';
import { SimulationConfig } from '../../../src/app/domain/interfaces/simulation-config.interface';

describe('Crane fatal hurt regression', () => {
  it('gives Melon to the friend ahead that triggered hurt before faint removal', () => {
    const payload =
      'SAPC1:eyJwUCI6IkdvbGRlbiIsIm9QIjoiR29sZGVuIiwicFRMIjoiMSIsIm9UTCI6IjEiLCJwSFRMIjoiMSIsIm9IVEwiOiIxIiwidCI6OCwib0dTIjoxMSwicCI6W3sibiI6IlNxdWlkIiwiYSI6OSwiaCI6NiwiZSI6MX0seyJuIjoiQ2hpcG11bmsiLCJhIjo4LCJoIjo3LCJlIjo1fSx7Im4iOiJWYXF1aXRhIiwiYSI6OSwiaCI6MTAsImUiOjF9LHsibiI6IkZhbGNvbiIsImEiOjcsImgiOjEwLCJlcSI6eyJuIjoiRmlnIn19LHsibiI6IkJhYm9vbiIsImEiOjUsImgiOjYsImUiOjEsImVxIjp7Im4iOiJDaGVycnkifX1dLCJvIjpbeyJuIjoiU3F1aWQiLCJhIjoxMCwiaCI6NywiZSI6MiwiZXEiOnsibiI6IkNoZXJyeSJ9fSx7Im4iOiJGYWxjb24iLCJhIjo5LCJoIjo5LCJlcSI6eyJuIjoiRmlnIn19LHsibiI6IkNyYW5lIiwiYSI6MTAsImgiOjksImVxIjp7Im4iOiJQb3RhdG8ifX0seyJuIjoiUm95YWwgRmx5Y2F0Y2hlciIsImEiOjIsImgiOjR9LHsibiI6IlJveWFsIEZseWNhdGNoZXIiLCJhIjozLCJoIjo1LCJlIjoxLCJlcSI6eyJuIjoiQ2hlcnJ5In19XSwibSI6dHJ1ZSwib1JBIjoyLCJvU0EiOjEsInNhIjp0cnVlfQ';

    const expanded = expandCompactCalculatorState(
      parseImportPayload(payload),
    ) as SimulationConfig;

    const result = runSimulation({
      ...expanded,
      turn: 9,
      simulationCount: 1,
      logsEnabled: true,
      maxLoggedBattles: 1,
    });
    const messages =
      result.battles?.[0]?.logs.map((log) => String(log.message ?? '')) ?? [];

    const melonIndex = messages.indexOf('Crane gave Falcon Melon.');
    const attackIndex = messages.indexOf('Crane gave Falcon 5 attack.');

    expect(melonIndex).toBeGreaterThanOrEqual(0);
    expect(attackIndex).toBeGreaterThan(melonIndex);
  });
});
