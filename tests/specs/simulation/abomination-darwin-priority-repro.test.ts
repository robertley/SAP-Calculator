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
  return (logs ?? []).map((log: any) => String(log?.message ?? ''));
}

function findFirstIndexAfter(
  messages: string[],
  startIndex: number,
  predicate: (message: string) => boolean,
): number {
  for (let i = Math.max(0, startIndex + 1); i < messages.length; i++) {
    if (predicate(messages[i])) {
      return i;
    }
  }
  return -1;
}

describe('Abomination copied Darwin priority repro', () => {
  it('reproduces user SAPC1 state with copied Darwin jump before next Abomination faint', () => {
    const payload =
      "SAPC1:eyJwUCI6IlVuaWNvcm4iLCJvUCI6IlB1cHB5IiwicFQiOiJOdXRjcmFja2VyIiwicFRMIjozLCJvVCI6IlBhbmRvcmFzIEJveCIsIm9UTCI6IjEiLCJwSFRMIjoiMSIsIm9IVEwiOiIxIiwiYXAiOnRydWUsImxmIjoib3Bwb25lbnQiLCJwIjpbeyJuIjoiU2FyY2FzdGljIEZyaW5nZWhlYWQiLCJhIjozLCJoIjoxLCJlIjo1LCJlcSI6eyJuIjoiQ2h1cnJvcyJ9fSx7Im4iOiJTYXJjYXN0aWMgRnJpbmdlaGVhZCIsImEiOjIsImgiOjEsImUiOjUsImVxIjp7Im4iOiJDaHVycm9zIn0sImFTUDEiOiJEYXJ3aW4ncyBGb3giLCJhU1AzVCI6NTB9LHsibiI6IkFib21pbmF0aW9uIiwiYSI6MSwiaCI6MSwiZSI6NSwiZXEiOnsibiI6IkNodXJyb3MifSwiYVNQMSI6IkRhcndpbidzIEZveCIsImFTUDIiOiJGaXJlZmx5IiwiYVNQMyI6IkJhZGdlciIsImFTUDNUIjo1MH0seyJuIjoiQmVsdWdhIFdoYWxlIiwiYSI6MSwiaCI6MSwiZSI6NSwiZXEiOnsibiI6IkNodXJyb3MifSwiYlNQIjoiQ3Vja29vIiwiYVNQMSI6Ikh5ZHJhIiwiYVNQMiI6IlJvYyIsImFTUDNUIjo1MH0seyJuIjoiQWJvbWluYXRpb24iLCJhIjoyLCJoIjoxLCJlIjoyLCJlcSI6eyJuIjoiQ2h1cnJvcyJ9LCJtIjo1MCwiYVNQMSI6IkJlbHVnYSBXaGFsZSIsImFTUDIiOiJOYW1henUiLCJhU1AxQiI6IklndWFuYSIsImFTUDNUIjo1MCwidEgiOjI1fV0sIm8iOlt7Im4iOiJHaWFudCBQYW5nYXNpdXMiLCJhIjo0OSwiaCI6MSwiZSI6MSwicENQIjoiUGxhc3RpYyBTYXciLCJtIjo1MH0seyJuIjoiQWJvbWluYXRpb24iLCJhIjoxMDAsImgiOjEsImUiOjUsImVxIjp7Im4iOiJDaHVycm9zIn0sIm0iOjUwLCJhU1AxIjoiT3JjYSIsImFTUDIiOiJCZWhlbW90aCIsImFTUDMiOiJSYXQiLCJhU1AxTCI6MywiYVNQMkwiOjMsImFTUDNMIjozLCJhU1AzVCI6NTB9LHsibiI6IkFib21pbmF0aW9uIiwiYSI6NTAsImgiOjEsImUiOjUsImVxIjp7Im4iOiJTaWxseSJ9LCJtIjo1MCwiYVNQMSI6IlJhdCIsImFTUDIiOiJQaG9lbml4IiwiYVNQMyI6IkdpYW50IFBhbmdhc2l1cyIsImFTUDFMIjozLCJhU1AyTCI6MywiYVNQM1QiOjUwfSx7Im4iOiJBYm9taW5hdGlvbiIsImEiOjEwMCwiaCI6MSwiZSI6NSwiZXEiOnsibiI6IkNodXJyb3MifSwibSI6NTAsImFTUDEiOiJCZWhlbW90aCIsImFTUDIiOiJSYXQiLCJhU1AzIjoiQWxiYXRyb3NzIiwiYVNQMUwiOjMsImFTUDJMIjozLCJhU1AzTCI6MywiYVNQM1QiOjUwfSx7Im4iOiJBYm9taW5hdGlvbiIsImEiOjEwMCwiaCI6MTAwLCJlIjo1LCJlcSI6eyJuIjoiQ2FzaGV3IE51dCJ9LCJtIjo1MCwiYVNQMSI6IkJlaGVtb3RoIiwiYVNQMiI6IlBhbnRoZXIiLCJhU1AzIjoiR3VpbmVhZm93bCIsImFTUDNUIjo1MH1dLCJtIjp0cnVlLCJ0YyI6dHJ1ZSwicFJBIjozLCJvUkEiOjEsInBUQSI6MTAwLCJvVEEiOjEwMCwic2EiOnRydWV9";
    const expanded = expandCompactCalculatorState(
      parseImportPayload(payload),
    ) as SimulationConfig;

    const messages = getMessages(expanded);
    const jumpIdx = messages.findIndex((message) =>
      message.includes("Abomination's Darwin's Fox jump-attacks"),
    );
    const faintIdx = findFirstIndexAfter(
      messages,
      jumpIdx,
      (message) => message.includes('Abomination fainted.'),
    );

    expect(jumpIdx).toBeGreaterThan(-1);
    expect(faintIdx).toBeGreaterThan(-1);
    expect(jumpIdx).toBeLessThan(faintIdx);
  });
});
