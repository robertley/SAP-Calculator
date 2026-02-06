import { describe, expect, it, vi } from 'vitest';
import { cancelSimulation } from '../src/app/root/app.component.simulation';

describe('cancelSimulation', () => {
  it('terminates active worker and resets simulation state immediately', () => {
    const terminate = vi.fn();
    const requestWorkerCancel = vi.fn();
    const setStatus = vi.fn();
    const markForCheck = vi.fn();

    const ctx: any = {
      simulationWorker: { terminate },
      simulationInProgress: true,
      simulationCancelRequested: false,
      simulationService: { requestWorkerCancel },
      setStatus,
      markForCheck,
    };

    cancelSimulation(ctx);

    expect(requestWorkerCancel).toHaveBeenCalledTimes(1);
    expect(terminate).toHaveBeenCalledTimes(1);
    expect(ctx.simulationWorker).toBeNull();
    expect(ctx.simulationInProgress).toBe(false);
    expect(ctx.simulationCancelRequested).toBe(false);
    expect(setStatus).toHaveBeenCalledWith('Simulation cancelled.', 'error');
    expect(markForCheck).toHaveBeenCalledTimes(1);
  });

  it('does nothing when no simulation is active', () => {
    const requestWorkerCancel = vi.fn();
    const ctx: any = {
      simulationWorker: null,
      simulationInProgress: false,
      simulationCancelRequested: false,
      simulationService: { requestWorkerCancel },
    };

    cancelSimulation(ctx);
    expect(requestWorkerCancel).not.toHaveBeenCalled();
  });
});
