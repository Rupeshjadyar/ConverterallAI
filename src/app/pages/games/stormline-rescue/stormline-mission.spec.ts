import { FixedGameClock } from '../fixed-game-clock';
import { FIELD_WIDTH, MISSION_SECONDS, RESCUE_TARGET, StormlineMission } from './stormline-mission';

describe('Stormline rescue mission', () => {
  it('advances sectors and awards a time bonus for recovering all capsules', () => {
    const mission = new StormlineMission(() => .5);
    for (let i = 0; i < RESCUE_TARGET; i++) {
      mission.objects.push({ ...mission.ship, kind: 'capsule', radius: 12, speed: 0, spin: 0 });
      mission.step(.016, { x: 0, y: 0 });
    }
    expect(mission.sector).toBe(3);
    expect(mission.rescued).toBe(9);
    expect(mission.cleared).toBe(true);
    expect(mission.over).toBe(true);
    expect(mission.score).toBeGreaterThan(900);
  });

  it('limits hull loss and pulses away nearby debris without losing capsules', () => {
    const mission = new StormlineMission(() => .5);
    const near = { ...mission.ship, kind: 'debris' as const, radius: 12, speed: 0, spin: 0 };
    mission.objects.push(near, { ...near });
    mission.step(.016, { x: 0, y: 0 });
    expect(mission.hull).toBe(2);
    mission.objects.push({ ...near, kind: 'capsule', x: near.x + 45 });
    expect(mission.pulse()).toBe(true);
    expect(mission.objects.every(({ kind }) => kind === 'capsule')).toBe(true);
    expect(mission.pulse()).toBe(false);
  });

  it('clamps the ship to the play field and ends when time runs out', () => {
    const mission = new StormlineMission(() => .5);
    mission.step(3, { x: 1, y: 0 });
    expect(mission.ship.x).toBeLessThan(FIELD_WIDTH);
    mission.step(MISSION_SECONDS, { x: 0, y: 0 });
    expect(mission.over).toBe(true);
    expect(mission.cleared).toBe(false);
  });
});

describe('arcade fixed-step clock', () => {
  it('advances the same number of ticks at 60 Hz and 120 Hz and bounds catch-up', () => {
    const counts = [60, 120].map((rate) => {
      const clock = new FixedGameClock();
      let ticks = 0;
      for (let frame = 0; frame <= rate; frame++) ticks += clock.ticks(frame * 1000 / rate);
      expect(clock.ticks(10_000)).toBe(4);
      return ticks;
    });
    expect(counts).toEqual([60, 60]);
  });
});
