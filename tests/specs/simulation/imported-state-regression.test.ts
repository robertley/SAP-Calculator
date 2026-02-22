import { describe, expect, it } from 'vitest';
import {
  expandCompactCalculatorState,
  parseImportPayload,
} from 'app/ui/shell/state/app.component.share';
import { runSimulation } from '../../../simulation/simulate';
import { SimulationConfig } from '../../../src/app/domain/interfaces/simulation-config.interface';

describe('imported state regression', () => {
  it('does not throw for user-provided SAPC1 state', () => {
    const payload =
      'SAPC1:eyJwVCI6Ik51dGNyYWNrZXIiLCJwVEwiOjMsIm9UIjoiVGluZGVyIEJveCIsIm9UTCI6MywicEhUTCI6IjEiLCJvSFRMIjoiMSIsImFwIjp0cnVlLCJwIjpbeyJuIjoiU2VhIFNlcnBlbnQiLCJhIjo1MCwiaCI6NTAsImUiOjUsImVxIjp7Im4iOiJDb2NvbnV0In0sIm0iOjUwfSx7Im4iOiJTZWEgU2VycGVudCIsImEiOjUwLCJoIjo1MCwiZSI6NSwiZXEiOnsibiI6IkNvY29udXQifSwibSI6NTB9LHsibiI6IlNlYSBTZXJwZW50IiwiYSI6NTAsImgiOjUwLCJlIjo1LCJlcSI6eyJuIjoiQ29jb251dCJ9LCJtIjo1MH0seyJuIjoiU2VhIFNlcnBlbnQiLCJhIjo1MCwiaCI6NTAsImUiOjUsImVxIjp7Im4iOiJDb2NvbnV0In0sIm0iOjUwfSx7Im4iOiJTZWEgU2VycGVudCIsImEiOjUwLCJoIjo1MCwiZSI6NSwiZXEiOnsibiI6IkNvY29udXQifSwibSI6NTB9XSwibyI6W3sibiI6IlN1bmZpc2giLCJhIjo0LCJoIjoxMCwiZXEiOnsibiI6IlBlYW51dCBCdXR0ZXIifX0seyJuIjoiR2VvbWV0cmljIFRvcnRvaXNlIiwiYSI6OCwiaCI6MTUsImUiOjV9LHsibiI6Ikdlb21ldHJpYyBUb3J0b2lzZSIsImEiOjgsImgiOjE1LCJlIjo1fSx7Im4iOiJHZW9tZXRyaWMgVG9ydG9pc2UiLCJhIjo4LCJoIjoxNSwiZSI6NX0seyJuIjoiR2VvbWV0cmljIFRvcnRvaXNlIiwiYSI6OCwiaCI6MTUsImUiOjUsImVxIjp7Im4iOiJIb25leSJ9fV0sIm0iOnRydWUsInRjIjp0cnVlLCJzd2wiOnRydWUsInBSQSI6Mywib1JBIjoxLCJwVEEiOjEwMCwib1RBIjoxMDAsInNhIjp0cnVlLCJhZSI6dHJ1ZX0';

    const expanded = expandCompactCalculatorState(parseImportPayload(payload)) as SimulationConfig;

    expect(() =>
      runSimulation({
        ...expanded,
        simulationCount: 1,
        logsEnabled: true,
        maxLoggedBattles: 1,
      }),
    ).not.toThrow();
  });

  it('expands compact JSON keys for abomination swallowed pets', () => {
    const payload = JSON.stringify({
      pP: 'Unicorn',
      oP: 'Turtle',
      p: [
        {
          n: 'Abomination',
          a: 11,
          h: 12,
          aSP1: 'Behemoth',
          aSP1L: 3,
          aSP2: 'Vampire Bat',
          aSP2L: 2,
          aSP3: 'Worm of Sand',
          aSP3L: 1,
        },
      ],
      o: [],
      m: true,
      tc: true,
      sa: true,
    });

    const expanded = expandCompactCalculatorState(
      parseImportPayload(payload),
    ) as SimulationConfig;
    const abomination = expanded.playerPets?.[0];

    expect(abomination?.name).toBe('Abomination');
    expect(abomination?.abominationSwallowedPet1).toBe('Behemoth');
    expect(abomination?.abominationSwallowedPet1Level).toBe(3);
    expect(abomination?.abominationSwallowedPet2).toBe('Vampire Bat');
    expect(abomination?.abominationSwallowedPet2Level).toBe(2);
    expect(abomination?.abominationSwallowedPet3).toBe('Worm of Sand');
    expect(abomination?.abominationSwallowedPet3Level).toBe(1);
  });
});
