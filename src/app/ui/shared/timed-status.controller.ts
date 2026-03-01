export class TimedStatusController<TTone extends string> {
  private timer: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private readonly setMessage: (message: string) => void,
    private readonly setTone: (tone: TTone) => void,
    private readonly durationMs = 3000,
    private readonly onStateChange?: () => void,
  ) {}

  set(message: string, tone: TTone): void {
    this.clearTimer();
    this.setMessage(message);
    this.setTone(tone);
    this.onStateChange?.();

    this.timer = setTimeout(() => {
      this.setMessage('');
      this.timer = null;
      this.onStateChange?.();
    }, this.durationMs);
  }

  clear(): void {
    this.clearTimer();
    this.setMessage('');
    this.onStateChange?.();
  }

  dispose(): void {
    this.clearTimer();
  }

  private clearTimer(): void {
    if (!this.timer) {
      return;
    }
    clearTimeout(this.timer);
    this.timer = null;
  }
}
