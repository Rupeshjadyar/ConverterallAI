const TICK_MS = 1_000 / 60;
const MAX_CATCHUP_TICKS = 4;

export class FixedGameClock {
  private previous?: number;
  private pending = 0;

  reset(): void {
    this.previous = undefined;
    this.pending = 0;
  }

  ticks(now: number): number {
    const elapsed = this.previous === undefined ? 0 : now - this.previous;
    this.previous = now;
    this.pending += Math.min(MAX_CATCHUP_TICKS * TICK_MS, Math.max(0, elapsed));
    const count = Math.floor(this.pending / TICK_MS + 1e-9);
    this.pending = Math.max(0, this.pending - count * TICK_MS);
    return count;
  }
}
