import { describe, expect, it } from 'vitest';
import {
  expandCompactCalculatorState,
  parseImportPayload,
} from 'app/ui/shell/state/app.component.share';
import { runSimulation } from '../../../simulation/simulate';
import { SimulationConfig } from '../../../src/app/domain/interfaces/simulation-config.interface';

describe('Spider and Tinder Box post-removal ordering', () => {
  it('resolves Spider faint before checking for an empty front space', () => {
    const payload =
      'SAPC1:eyJwVCI6IlRpbmRlciBCb3giLCJwVEwiOiIxIiwib1RMIjoiMSIsInBIVEwiOiIxIiwib0hUTCI6IjEiLCJ0Ijo4LCJwR1MiOjExLCJwIjpbeyJuIjoiU3BpZGVyIiwiYSI6MywiaCI6MywiZSI6MSwiZXEiOnsibiI6IkNha2UifX0seyJuIjoiUmhpbm8iLCJhIjo2LCJoIjo3fSx7Im4iOiJQYXJyb3QiLCJhIjoxMiwiaCI6MTcsImVxIjp7Im4iOiI0MSJ9LCJwQ1AiOiJSaGlubyJ9LHsibiI6IkRvZG8iLCJhIjo5LCJoIjo3LCJlIjoyLCJlcSI6eyJuIjoiSG9uZXkifX0seyJuIjoiV29ybSIsImEiOjQsImgiOjcsImUiOjIsImVxIjp7Im4iOiJDYWtlIn19XSwibyI6W3sibiI6IkJhZGdlciIsImEiOjcsImgiOjcsImUiOjJ9LHsibiI6IlR1cnRsZSIsImEiOjMsImgiOjYsInBDUCI6IlNrdW5rIn0seyJuIjoiRWxlcGhhbnQiLCJhIjo4LCJoIjoxNCwiZSI6MX0seyJuIjoiQmxvd2Zpc2giLCJhIjo1LCJoIjoxMCwiZSI6MX0seyJuIjoiUmFiYml0IiwiYSI6MywiaCI6NiwiZSI6MSwidGMiOjJ9XSwibSI6dHJ1ZSwidGMiOnRydWUsInBSQSI6Mywib1JBIjoxLCJzaW0iOjEwMDB9';
    const config = expandCompactCalculatorState(
      parseImportPayload(payload),
    ) as SimulationConfig;

    const result = runSimulation({
      ...config,
      simulationCount: 1,
      logsEnabled: true,
      maxLoggedBattles: 1,
      showTriggerNamesInLogs: true,
    });
    const messages = (result.battles?.[0]?.logs ?? []).map(
      (log) => log.message,
    );
    const spiderFaintIndex = messages.findIndex((message) =>
      message.includes('Spider fainted.'),
    );
    const spiderSpawnIndex = messages.findIndex((message) =>
      message.includes('Spider spawned'),
    );

    expect(spiderFaintIndex).toBeGreaterThan(-1);
    expect(spiderSpawnIndex).toBeGreaterThan(spiderFaintIndex);
    expect(
      messages
        .slice(spiderFaintIndex + 1, spiderSpawnIndex)
        .some((message) =>
          message.includes('Tinder Box triggered after empty front space'),
        ),
    ).toBe(false);
  });
});
