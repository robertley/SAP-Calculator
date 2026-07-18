interface WorkerMessageRecord {
  type?: string;
  message?: string;
  [key: string]: unknown;
}

export interface ReplayWorkerTaskOptions<TProgress> {
  progressType: string;
  resultType: string;
  abortedType: string;
  resultKey?: string;
  progressKey?: string;
  errorMessage: string;
  abortSignal?: AbortSignal;
  onProgress?: (progress: TProgress) => void;
}

interface QueuedWorkerTask<TResult, TProgress> {
  message: unknown;
  options: ReplayWorkerTaskOptions<TProgress>;
  resolve: (result: TResult) => void;
  reject: (error: Error) => void;
}

interface WorkerSlot {
  worker: Worker;
  busy: boolean;
}

export class ReplaySimulationWorkerPool {
  private readonly slots: WorkerSlot[] = [];
  private readonly queue: Array<QueuedWorkerTask<unknown, unknown>> = [];
  private closed = false;

  constructor(
    size = 2,
    private readonly createWorker: () => Worker = () =>
      new Worker(
        new URL('../simulation/simulation.worker', import.meta.url),
        { type: 'module' },
      ),
  ) {
    const normalizedSize = Math.max(1, Math.trunc(size));
    for (let index = 0; index < normalizedSize; index += 1) {
      this.slots.push({ worker: this.createWorker(), busy: false });
    }
  }

  run<TResult, TProgress = unknown>(
    message: unknown,
    options: ReplayWorkerTaskOptions<TProgress>,
  ): Promise<TResult> {
    if (this.closed) {
      return Promise.reject(new Error('Replay worker pool is closed.'));
    }
    return new Promise<TResult>((resolve, reject) => {
      this.queue.push({
        message,
        options,
        resolve,
        reject,
      } as QueuedWorkerTask<unknown, unknown>);
      this.dispatch();
    });
  }

  close(): void {
    if (this.closed) {
      return;
    }
    this.closed = true;
    for (const task of this.queue.splice(0)) {
      task.reject(new Error('Replay worker pool was closed.'));
    }
    for (const slot of this.slots) {
      slot.worker.terminate();
      slot.busy = false;
    }
  }

  private dispatch(): void {
    if (this.closed) {
      return;
    }
    for (const slot of this.slots) {
      if (slot.busy) {
        continue;
      }
      const task = this.queue.shift();
      if (!task) {
        break;
      }
      this.startTask(slot, task);
    }
  }

  private startTask(
    slot: WorkerSlot,
    task: QueuedWorkerTask<unknown, unknown>,
  ): void {
    const { options } = task;
    if (options.abortSignal?.aborted) {
      task.reject(new Error(options.errorMessage));
      this.dispatch();
      return;
    }

    slot.busy = true;
    let settled = false;
    const finish = (error: Error | null, result?: unknown) => {
      if (settled) {
        return;
      }
      settled = true;
      options.abortSignal?.removeEventListener('abort', abortListener);
      slot.worker.onmessage = null;
      slot.worker.onerror = null;
      slot.busy = false;
      if (error) {
        task.reject(error);
      } else {
        task.resolve(result);
      }
      this.dispatch();
    };
    const replaceWorker = () => {
      slot.worker.terminate();
      if (!this.closed) {
        slot.worker = this.createWorker();
      }
    };
    const abortListener = () => {
      replaceWorker();
      finish(new Error(options.errorMessage));
    };
    options.abortSignal?.addEventListener('abort', abortListener, { once: true });

    slot.worker.onmessage = ({ data }: MessageEvent<WorkerMessageRecord>) => {
      if (!data?.type) {
        return;
      }
      if (data.type === options.progressType) {
        const progressKey = options.progressKey ?? 'progress';
        options.onProgress?.(data[progressKey]);
        return;
      }
      if (data.type === options.resultType) {
        const resultKey = options.resultKey ?? 'result';
        finish(null, data[resultKey]);
        return;
      }
      if (data.type === options.abortedType) {
        finish(new Error(options.errorMessage));
        return;
      }
      if (data.type === 'error') {
        finish(new Error(data.message || options.errorMessage));
      }
    };
    slot.worker.onerror = (event) => {
      replaceWorker();
      finish(new Error(event.message || options.errorMessage));
    };
    slot.worker.postMessage(task.message);
  }
}
