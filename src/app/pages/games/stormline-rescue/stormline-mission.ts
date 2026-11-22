export const FIELD_WIDTH = 800;
export const FIELD_HEIGHT = 490;
export const MISSION_SECONDS = 75;
export const RESCUE_TARGET = 9;
export const PULSE_REACH = 142;
const PULSE_COOLDOWN = 4;
const SHIP_RADIUS = 17;

export interface Point {
  x: number;
  y: number;
}

export interface Drifter extends Point {
  kind: 'capsule' | 'debris';
  radius: number;
  speed: number;
  spin: number;
}

export class StormlineMission {
  readonly ship: Point = { x: FIELD_WIDTH / 2, y: FIELD_HEIGHT * .8 };
  objects: Drifter[] = [];
  elapsed = 0;
  hull = 3;
  rescued = 0;
  pulseCooldown = 0;
  pulseAge = 1;
  shieldTime = 0;
  private capsuleDelay = 0;
  private debrisDelay = .75;
  private nextLane = 0;

  constructor(private readonly random: () => number = Math.random) {}

  get timeLeft(): number { return Math.max(0, MISSION_SECONDS - this.elapsed); }
  get sector(): number { return Math.min(3, 1 + Math.floor(this.rescued / 3)); }
  get cleared(): boolean { return this.rescued >= RESCUE_TARGET; }
  get over(): boolean { return this.cleared || this.hull === 0 || this.timeLeft === 0; }
  get score(): number { return this.rescued * 100 + (this.cleared ? Math.ceil(this.timeLeft) * 5 : 0); }

  step(dt: number, direction: Point): void {
    if (this.over) return;
    this.elapsed += dt;
    this.shieldTime = Math.max(0, this.shieldTime - dt);
    this.pulseCooldown = Math.max(0, this.pulseCooldown - dt);
    this.pulseAge += dt;
    const length = Math.max(1, Math.hypot(direction.x, direction.y));
    this.ship.x = clamp(this.ship.x + direction.x / length * 305 * dt, 26, FIELD_WIDTH - 26);
    this.ship.y = clamp(this.ship.y + direction.y / length * 305 * dt, 30, FIELD_HEIGHT - 30);

    this.capsuleDelay -= dt;
    if (this.capsuleDelay <= 0) {
      const lanes = [4, 1, 6, 2, 5, 3, 7, 0];
      const x = 63 + lanes[this.nextLane++ % lanes.length] * 96;
      this.objects.push({ kind: 'capsule', x, y: 7, radius: 13, speed: 85 + this.sector * 9, spin: 0 });
      this.capsuleDelay += 2.25;
    }

    this.debrisDelay -= dt;
    if (this.debrisDelay <= 0) {
      const radius = 14 + this.random() * 17;
      const x = radius + this.random() * (FIELD_WIDTH - radius * 2);
      this.objects.push({ kind: 'debris', x, y: -radius, radius, speed: 125 + this.sector * 32, spin: this.random() * 6 });
      this.debrisDelay += .99 - this.sector * .16;
    }

    this.objects = this.objects.filter((object) => {
      object.y += object.speed * dt;
      if (object.y - object.radius > FIELD_HEIGHT) return false;
      if (Math.hypot(object.x - this.ship.x, object.y - this.ship.y) > SHIP_RADIUS + object.radius) return true;
      if (object.kind === 'capsule' && !this.over) {
        this.rescued++;
        return false;
      }
      if (object.kind === 'debris' && this.shieldTime === 0 && !this.over) {
        this.hull--;
        this.shieldTime = 1.1;
        return false;
      }
      return true;
    });
  }

  pulse(): boolean {
    if (this.over || this.pulseCooldown > 0) return false;
    this.pulseCooldown = PULSE_COOLDOWN;
    this.pulseAge = 0;
    this.objects = this.objects.filter(({ kind, x, y }) =>
      kind === 'capsule' || Math.hypot(x - this.ship.x, y - this.ship.y) > PULSE_REACH);
    return true;
  }
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}
