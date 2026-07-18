import { describe, expect, it } from 'vitest';
import { ReplaySimulationWorkerPool } from '../../../src/app/integrations/replay/replay-simulation-worker-pool';

class FakeWorker {
  static instances = 0;
  static active = 0;
  static maxActive = 0;

  onmessage: ((event: MessageEvent) => void) | null = null;
  onerror: ((event: ErrorEvent) => void) | null = null;
  terminated = false;

  constructor() {
    FakeWorker.instances += 1;
  }

  postMessage(message: { id: number }): void {
    FakeWorker.active += 1;
    FakeWorker.maxActive = Math.max(FakeWorker.maxActive, FakeWorker.active);
    queueMicrotask(() => {
      FakeWorker.active -= 1;
      this.onmessage?.(
        { data: { type: 'result', result: message.id } } as MessageEvent,
      );
    });
  }

  terminate(): void {
    this.terminated = true;
  }
}

describe('ReplaySimulationWorkerPool', () => {
  it('reuses two workers while bounding concurrent jobs', async () => {
    FakeWorker.instances = 0;
    FakeWorker.active = 0;
    FakeWorker.maxActive = 0;
    const workers: FakeWorker[] = [];
    const pool = new ReplaySimulationWorkerPool(2, () => {
      const worker = new FakeWorker();
      workers.push(worker);
      return worker as unknown as Worker;
    });

    const results = await Promise.all(
      [1, 2, 3, 4].map((id) =>
        pool.run<number>({ id }, {
          progressType: 'progress',
          resultType: 'result',
          abortedType: 'aborted',
          errorMessage: 'failed',
        }),
      ),
    );
    pool.close();

    expect(results).toEqual([1, 2, 3, 4]);
    expect(FakeWorker.instances).toBe(2);
    expect(FakeWorker.maxActive).toBe(2);
    expect(workers.every((worker) => worker.terminated)).toBe(true);
  });
});
