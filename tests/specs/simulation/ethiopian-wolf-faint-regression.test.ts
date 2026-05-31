import { describe, expect, it } from 'vitest';
import {
  expandCompactCalculatorState,
  parseImportPayload,
} from 'app/ui/shell/state/app.component.share';
import { runSimulation } from '../../../simulation/simulate';
import { SimulationConfig } from '../../../src/app/domain/interfaces/simulation-config.interface';

function getMessages(config: SimulationConfig): string[] {
  const logs = runSimulation({
    ...config,
    simulationCount: 1,
    logsEnabled: true,
    maxLoggedBattles: 1,
    showTriggerNamesInLogs: true,
  }).battles?.[0]?.logs;

  return (logs ?? []).map((log: { message?: unknown }) =>
    String(log.message ?? ''),
  );
}

describe('Ethiopian Wolf faint regression', () => {
  it('triggers after fainting in the reported turn 6 state', () => {
    const payload =
      'SAPC1:eyJwUCI6IkRhbmdlciIsIm9QIjoiU3RhciIsInBUTCI6IjEiLCJvVEwiOiIxIiwidCI6NiwicEdTIjoxMiwicCI6W3sibiI6IkV0aGlvcGlhbiBXb2xmIiwiYSI6OSwiaCI6MTAsImUiOjN9LHsibiI6IkdpYW50IFRvcnRvaXNlIiwiYSI6NCwiaCI6OX0seyJuIjoiQW5nZWxzaGFyayIsImEiOjMsImgiOjR9LHsibiI6IlB5Z215IEhvZyIsImEiOjMsImgiOjYsImUiOjJ9LHsibiI6IlB5Z215IEhpcHBvIiwiYSI6MywiaCI6MTAsImUiOjF9XSwibyI6W3sibiI6Ik1hcm1vc2V0IiwiYSI6OCwiaCI6OSwiZSI6MywiZXEiOnsibiI6IlNlYXdlZWQifX0seyJuIjoiQmFzcyIsImEiOjMsImgiOjN9LHsibiI6Ikhhd2siLCJhIjo1LCJoIjo0fSx7Im4iOiJPa2FwaSIsImEiOjcsImgiOjgsImUiOjEsInRjIjo0fSx7Im4iOiJPa2FwaSIsImEiOjYsImgiOjcsInRjIjo0fV0sIm0iOnRydWUsInRjIjp0cnVlLCJwUkEiOjEsInBTQSI6MSwib1NBIjoxLCJzYSI6dHJ1ZX0';
    const config = expandCompactCalculatorState(
      parseImportPayload(payload),
    ) as SimulationConfig;

    const messages = getMessages(config);

    expect(messages).toContain('Ethiopian Wolf fainted.');
    expect(messages).toContain('Ethiopian Wolf removed 1 attack from Hawk.');
    expect(messages).toContain('Ethiopian Wolf removed 1 attack from Okapi.');
  });
});
