import { FormGroup } from '@angular/forms';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Player } from 'app/domain/entities/player.class';
import { CalculatorBattleEngine } from 'app/integrations/simulation/battle-engine';
import { LogService } from 'app/integrations/log.service';
import { SimulationService } from 'app/integrations/simulation/simulation.service';

describe('simulation battle logging', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('retains every simulated battle so outcome filters can run before the UI limit', () => {
    const run = vi
      .spyOn(CalculatorBattleEngine.prototype, 'run')
      .mockReturnValue({
        playerWins: 0,
        opponentWins: 0,
        draws: 0,
        battles: [],
      });
    const formGroup = {
      get: () => ({ value: undefined }),
    } as unknown as FormGroup;
    const service = new SimulationService(new LogService());

    service.runSimulation(
      formGroup,
      250,
      new Player(),
      new Player(),
    );

    expect(run).toHaveBeenCalledOnce();
    expect(run.mock.calls[0]?.[0].maxLoggedBattles).toBe(250);
    expect(run.mock.calls[0]?.[2]).toBe(100);
  });
});
