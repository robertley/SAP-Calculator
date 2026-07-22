import { describe, expect, it } from 'vitest';
import {
  expandCompactCalculatorState,
  parseImportPayload,
} from 'app/ui/shell/state/app.component.share';
import { runSimulation } from '../../../simulation/simulate';
import { SimulationConfig } from '../../../src/app/domain/interfaces/simulation-config.interface';

describe('Barnacle before-battle regression', () => {
  it('does not trigger Barnacle when its team rolled this turn', () => {
    const payload =
      'SAPC1:eyJwUCI6IkN1c3RvbSIsIm9QIjoiQ3VzdG9tIiwicFRMIjoiMSIsIm9UTCI6IjEiLCJwSFRMIjoiMSIsIm9IVEwiOiIxIiwib0dTIjoxOSwiYXAiOnRydWUsInAiOlt7Im4iOiJGbGVhIiwiYSI6MTMsImgiOjEyLCJlIjo1LCJlcSI6eyJuIjoiQW1icm9zaWEifX0seyJuIjoiSGVkZ2Vob2ciLCJhIjo0LCJoIjoyfSx7Im4iOiJIZWRnZWhvZyIsImEiOjcsImgiOjV9LHsibiI6IkNhbWVsIiwiYSI6MTMsImgiOjE1LCJlIjoyfSx7Im4iOiJMZWVjaCIsImEiOjMxLCJoIjozNn1dLCJvIjpbeyJuIjoiQm9pdGF0YSIsImEiOjEzLCJoIjoxNywiZSI6MiwiZXEiOnsibiI6IlN0ZWFrIn19LHsibiI6IkJhcm5hY2xlIiwiYSI6MjUsImgiOjI1LCJlIjo1LCJ0YyI6MX0seyJuIjoiQmFybmFjbGUiLCJhIjozMiwiaCI6MzMsImUiOjUsImVxIjp7Im4iOiJDb2NvYSBCZWFuIn0sInRjIjoxfSx7Im4iOiJGYXJtZXIgRG9nIiwiYSI6OCwiaCI6OSwiZSI6MSwiZXEiOnsibiI6IkFtYnJvc2lhIn19LHsibiI6IkZhcm1lciBEb2ciLCJhIjo5LCJoIjo5LCJlIjoyfV0sImNwIjpbeyJuIjoiVW5pY29ybiBQYWNrIiwidGllcjFQZXRzIjpbIj8_PyIsIkFsY2hlbWVkZXMiLCJCYWt1IiwiQmFyZ2hlc3QiLCJCdW55aXAiLCJDdWRkbGUgVG9hZCIsIk11cm1lbCIsIlBlbmdvYmJsZSIsIlNuZWFreSBFZ2ciLCJUc3VjaGlub2tvIl0sInRpZXIyUGV0cyI6WyJCaWdmb290IiwiRHJvcCBCZWFyIiwiRnJvc3QgV29sZiIsIkdhcmdveWxlIiwiR2hvc3QgS2l0dGVuIiwiSmFja2Fsb3BlIiwiTW90aG1hbiIsIk9nb3BvZ28iLCJUaHVuZGVyYmlyZCIsIld5dmVybiJdLCJ0aWVyM1BldHMiOlsiQnJhaW4gQ3JhbXAiLCJDYWx5Z3JleWhvdW5kIiwiRnVyLUJlYXJpbmcgVHJvdXQiLCJHcmlmZmluIiwiTHVja3kgQ2F0IiwiTWFuYSBIb3VuZCIsIk1hbmRyYWtlIiwiT3Vyb2Jvcm9zIiwiU2tlbGV0b24gRG9nIiwiVGF0emVsd3VybSJdLCJ0aWVyNFBldHMiOlsiQWJvbWluYXRpb24iLCJDaGltZXJhIiwiQ3ljbG9wcyIsIktyYWtlbiIsIk1pbm90YXVyIiwiUm9jIiwiVGlnZXIgQnVnIiwiVW5pY29ybiIsIlZpc2l0b3IiLCJXb3JtIG9mIFNhbmQiXSwidGllcjVQZXRzIjpbIkFtYWxnYW1hdGlvbiIsIkJhZCBEb2ciLCJLaXRzdW5lIiwiTG92ZWxhbmQgRnJvZ21hbiIsIlBpeGl1IiwiTmVzc2llIiwiUmVkIERyYWdvbiIsIlNhbG1vbiBvZiBLbm93bGVkZ2UiLCJWYW1waXJlIEJhdCIsIldlcmV3b2xmIl0sInRpZXI2UGV0cyI6WyJCZWhlbW90aCIsIkNlcmJlcnVzIiwiSHlkcmEiLCJNYW50aWNvcmUiLCJQaG9lbml4IiwiUXVldHphbGNvYXRsIiwiU2VhIFNlcnBlbnQiLCJTbGVpcG5pciIsIlRlYW0gU3Bpcml0IiwiWWV0aSJdLCJmb29kcyI6W10sInBlcmtzIjpbXSwic3BlbHMiOlsxNTcsMTE5LDE1MCwxNDAsMTQ0LDE1OSwxNDcsMTUzLDE2MSwxMzgsMTQxLDE0MywyMywxNTYsMjAyLDE2NiwxNTQsMTUyXX0seyJuIjoiRVhQIiwidGllcjFQZXRzIjpbIkZpc2giLCJDb2Nrcm9hY2giLCJNdXJtZWwiLCJUc3VjaGlub2tvIiwiQW50IiwiRHVjayIsIlBpZ2VvbiIsIkNoaW5jaGlsbGEiLCJNYXJtb3NldCIsIkxlbW1pbmciXSwidGllcjJQZXRzIjpbIkd1aW5lYSBQaWciLCJKZWxseWZpc2giLCJPZ29wb2dvIiwiV3l2ZXJuIiwiVGFkcG9sZSIsIlNwaWRlciIsIlN3YW4iLCJHb2xkIEZpc2giLCJBbXBoaXNiYWVuYSIsIkJpZ2Zvb3QiXSwidGllcjNQZXRzIjpbIkhhdGNoaW5nIENoaWNrIiwiUH VnIiwiQmFybmFjbGUiLCJMZWFmeSBTZWEgRHJhZ29uIiwiRG9scGhpbiIsIkZvbyBEb2ciLCJMdWNreSBDYXQiLCJTbGltZSIsIkZhcm1lciBQaWciLCJTdWdhciBHbGlkZXIiXSwidGllcjRQZXRzIjpbIkNsb3duZmlzaCIsIkNyb3ciLCJDeWNsb3BzIiwiTHlueCIsIkxvYnN0ZXIiLCJQbGF0eXB1cyIsIkJpc29uIiwiRWxrIiwiUGFycm90IixudWxsXSwidGllcjVQZXRzIjpbIkJsb2JmaXNoIiwiU3RhcmZpc2giLCJTYWxtb24gb2YgS25vd2xlZGdlIiwiRmxvdW5kZXIiLCJWZW51cyBGbHl0cmFwIiwiQ293IiwiQmx1ZSBSaW5nZWQgT2N0b3B1cyIsIkJhZCBEb2ciLCJOdXJpa2FiZSIsIlBpeGl1Il0sInRpZXI2UGV0cyI6WyJBbHBhY2EiLCJIYW1tZXJoZWFkIFNoYXJrIiwiTGV2aWF0aGFuIiwiUXVldHphbGNvYXRsIiwiVGVhbSBTcGlyaXQiLCJUaWdlciIsIk95c3RlciIsIkJlaGVtb3RoIiwiQmFrdW5hd2EiLCJXYWxydXMiXSwiZm9vZHMiOltdLCJwZXJrcyI6W10sInNwZWxscyI6W119XSwibSI6dHJ1ZSwidGMiOnRydWUsIm9SQSI6OCwic2ltIjoxMDAwfQ';

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
    const messages =
      result.battles?.[0]?.logs.map((log) => String(log.message ?? '')) ?? [];
    const startOfBattleIndex = messages.indexOf('Phase 2: Start of battle');
    const beforeBattleMessages = messages.slice(0, startOfBattleIndex);

    expect(config.opponentRollAmount).toBe(8);
    expect(startOfBattleIndex).toBeGreaterThan(0);
    expect(beforeBattleMessages).not.toContain('Barnacle fainted.');
    expect(
      beforeBattleMessages.some((message) =>
        message.includes('Barnacle gained'),
      ),
    ).toBe(false);
    expect(beforeBattleMessages[1]).toContain('(25/25/5xp)');
    expect(beforeBattleMessages[1]).toContain('(32/33/5xp)');
  });
});
