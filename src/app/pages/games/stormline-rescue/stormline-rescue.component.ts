import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, PLATFORM_ID, ViewChild, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FIELD_HEIGHT, FIELD_WIDTH, MISSION_SECONDS, PULSE_REACH, RESCUE_TARGET, StormlineMission, type Point } from './stormline-mission';

type Phase = 'briefing' | 'flying' | 'paused' | 'finished';
const CONTROL_KEYS = new Set(['arrowleft', 'arrowright', 'arrowup', 'arrowdown', 'a', 'd', 'w', 's']);
const BEST_KEY = 'converterallai-stormline-best';

@Component({
  selector: 'app-stormline-rescue',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './stormline-rescue.component.html',
  styleUrl: './stormline-rescue.component.css',
})
export class StormlineRescueComponent implements AfterViewInit, OnDestroy {
  @ViewChild('field', { static: true }) private field!: ElementRef<HTMLCanvasElement>;
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));
  private mission = new StormlineMission();
  private frame: number | undefined;
  private lastTimestamp: number | undefined;
  private context: CanvasRenderingContext2D | null = null;
  private background: CanvasGradient | null = null;
  private observer?: ResizeObserver;
  private keys = new Set<string>();
  private pointer?: { id: number; target: Point };

  readonly phase = signal<Phase>('briefing');
  readonly timeLeft = signal(MISSION_SECONDS);
  readonly rescued = signal(0);
  readonly target = RESCUE_TARGET;
  readonly hull = signal(3);
  readonly sector = signal(1);
  readonly pulseSeconds = signal(0);
  readonly score = signal(0);
  readonly best = signal(0);
  readonly cleared = signal(false);
  readonly unsupported = signal(false);

  ngAfterViewInit(): void {
    if (!this.browser) return;
    const canvas = this.field.nativeElement;
    this.context = canvas.getContext('2d');
    if (!this.context) {
      this.unsupported.set(true);
      return;
    }
    try { this.best.set(Math.max(0, Number(localStorage.getItem(BEST_KEY)) || 0)); } catch { /* Storage is optional. */ }
    this.observer = new ResizeObserver(() => this.resize());
    this.observer.observe(canvas);
    this.resize();
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.stopFrame();
  }

  launch(): void {
    if (!this.context) return;
    this.mission = new StormlineMission();
    this.updateHud();
    this.field.nativeElement.scrollIntoView({ block: 'nearest' });
    this.resume();
  }

  resume(): void {
    if (!this.context || this.mission.over) return;
    this.stopFrame();
    this.phase.set('flying');
    this.field.nativeElement.focus({ preventScroll: true });
    this.frame = requestAnimationFrame(this.tick);
  }

  pause(): void {
    if (this.phase() !== 'flying') return;
    this.stopFrame();
    this.phase.set('paused');
  }

  @HostListener('document:visibilitychange')
  pauseWhenHidden(): void {
    if (document.hidden) this.pause();
  }

  @HostListener('window:blur')
  pauseWhenUnfocused(): void { this.pause(); }

  keyDown(event: KeyboardEvent): void {
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    const key = event.key.toLowerCase();
    if (key === 'escape' || key === 'p') {
      event.preventDefault();
      if (!event.repeat && this.phase() === 'flying') this.pause();
      else if (!event.repeat && this.phase() === 'paused') this.resume();
    } else if (this.phase() === 'flying' && (CONTROL_KEYS.has(key) || key === ' ')) {
      event.preventDefault();
      if (key === ' ' && !event.repeat) this.pulse();
      else if (CONTROL_KEYS.has(key)) this.keys.add(key);
    }
  }

  keyUp(event: KeyboardEvent): void { this.keys.delete(event.key.toLowerCase()); }

  clearKeys(): void { this.keys.clear(); }

  pointDown(event: PointerEvent): void {
    if (this.phase() !== 'flying' || this.pointer || event.button !== 0) return;
    const canvas = this.field.nativeElement;
    canvas.focus({ preventScroll: true });
    canvas.setPointerCapture(event.pointerId);
    this.pointer = { id: event.pointerId, target: this.pointerPosition(event) };
  }

  pointMove(event: PointerEvent): void {
    if (this.pointer?.id === event.pointerId) this.pointer.target = this.pointerPosition(event);
  }

  pointUp(event: PointerEvent): void {
    if (this.pointer?.id === event.pointerId) this.pointer = undefined;
  }

  pulse(returnFocus = false): void {
    if (this.phase() !== 'flying') return;
    this.mission.pulse();
    this.updateHud();
    if (returnFocus) this.field.nativeElement.focus({ preventScroll: true });
  }

  private pointerPosition(event: PointerEvent): Point {
    const bounds = this.field.nativeElement.getBoundingClientRect();
    return { x: (event.clientX - bounds.left) * FIELD_WIDTH / bounds.width,
      y: (event.clientY - bounds.top) * FIELD_HEIGHT / bounds.height };
  }

  private direction(): Point {
    if (this.pointer) return { x: (this.pointer.target.x - this.mission.ship.x) / 40,
      y: (this.pointer.target.y - this.mission.ship.y) / 40 };
    return {
      x: Number(this.keys.has('d') || this.keys.has('arrowright')) - Number(this.keys.has('a') || this.keys.has('arrowleft')),
      y: Number(this.keys.has('s') || this.keys.has('arrowdown')) - Number(this.keys.has('w') || this.keys.has('arrowup')),
    };
  }

  private readonly tick = (now: number): void => {
    const elapsed = this.lastTimestamp === undefined ? 0 : (now - this.lastTimestamp) / 1_000;
    this.lastTimestamp = now;
    const dt = Math.min(.12, elapsed);
    const steps = Math.max(1, Math.ceil(dt / .025));
    const direction = this.direction();
    for (let step = 0; step < steps; step++) this.mission.step(dt / steps, direction);
    this.updateHud();
    this.draw();
    if (this.mission.over) {
      this.finish();
    } else {
      this.frame = requestAnimationFrame(this.tick);
    }
  };

  private finish(): void {
    this.stopFrame();
    this.cleared.set(this.mission.cleared);
    if (this.mission.score > this.best()) {
      this.best.set(this.mission.score);
      try { localStorage.setItem(BEST_KEY, String(this.mission.score)); } catch { /* Keep the score until navigation. */ }
    }
    this.phase.set('finished');
  }

  private stopFrame(): void {
    if (this.frame !== undefined) cancelAnimationFrame(this.frame);
    this.frame = undefined;
    this.lastTimestamp = undefined;
    this.keys.clear();
    this.pointer = undefined;
  }

  private updateHud(): void {
    const mission = this.mission;
    this.timeLeft.set(Math.ceil(mission.timeLeft));
    this.rescued.set(mission.rescued);
    this.hull.set(mission.hull);
    this.sector.set(mission.sector);
    this.pulseSeconds.set(Math.ceil(mission.pulseCooldown));
    this.score.set(mission.score);
    this.cleared.set(mission.cleared);
  }

  private resize(): void {
    const canvas = this.field.nativeElement;
    const ctx = this.context;
    if (!ctx || !canvas.clientWidth) return;
    const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
    const width = Math.min(1250, Math.round(canvas.clientWidth * ratio));
    const height = Math.round(width * FIELD_HEIGHT / FIELD_WIDTH);
    if (this.background && canvas.width === width && canvas.height === height) return;
    canvas.width = width;
    canvas.height = height;
    ctx.setTransform(width / FIELD_WIDTH, 0, 0, height / FIELD_HEIGHT, 0, 0);
    this.background = ctx.createLinearGradient(0, 0, 0, FIELD_HEIGHT);
    this.background.addColorStop(0, '#071825');
    this.background.addColorStop(.57, '#0a2330');
    this.background.addColorStop(1, '#081219');
    this.draw();
  }

  private draw(): void {
    const ctx = this.context;
    if (!ctx) return;
    const mission = this.mission;
    ctx.fillStyle = this.background ?? '#0b2029';
    ctx.fillRect(0, 0, FIELD_WIDTH, FIELD_HEIGHT);

    ctx.strokeStyle = '#173947';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = 28; x < FIELD_WIDTH; x += 48) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, FIELD_HEIGHT);
    }
    const drift = (mission.elapsed * 65) % 48;
    for (let y = drift; y < FIELD_HEIGHT; y += 48) {
      ctx.moveTo(0, y);
      ctx.lineTo(FIELD_WIDTH, y);
    }
    ctx.stroke();

    ctx.fillStyle = '#6192a1';
    for (let i = 0; i < 44; i++) ctx.fillRect((i * 137 + 31) % FIELD_WIDTH,
      (i * 71 + mission.elapsed * (25 + i % 5)) % FIELD_HEIGHT, i % 7 ? 1 : 2, 3 + i % 4);

    for (const object of mission.objects) {
      ctx.save();
      ctx.translate(object.x, object.y);
      if (object.kind === 'capsule') {
        ctx.strokeStyle = '#f9c77c';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, 17, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = '#ffaf62';
        ctx.fillRect(-5, -9, 10, 18);
        ctx.fillStyle = '#fff4da';
        ctx.fillRect(-3, -6, 6, 6);
      } else {
        ctx.rotate(object.spin + mission.elapsed * .8);
        ctx.fillStyle = '#542e43';
        ctx.strokeStyle = '#e8848e';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        for (let point = 0; point < 7; point++) {
          const angle = point * Math.PI * 2 / 7;
          const radius = object.radius * (point % 2 ? .73 : 1);
          ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
      ctx.restore();
    }

    const { x, y } = mission.ship;
    if (mission.pulseAge < .35) {
      const progress = mission.pulseAge / .35;
      ctx.strokeStyle = `rgba(122,244,224,${1 - progress})`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(x, y, 12 + progress * PULSE_REACH, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.save();
    ctx.translate(x, y);
    ctx.globalAlpha = mission.shieldTime && Math.floor(mission.shieldTime * 14) % 2 ? .4 : 1;
    ctx.fillStyle = '#8ff5e3';
    ctx.beginPath();
    ctx.moveTo(-7, 10);
    ctx.lineTo(0, 33 + Math.sin(mission.elapsed * 26) * 5);
    ctx.lineTo(7, 10);
    ctx.fill();
    ctx.fillStyle = '#e9f1ed';
    ctx.strokeStyle = '#375f65';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, -23);
    ctx.lineTo(8, -5);
    ctx.lineTo(24, 14);
    ctx.lineTo(9, 12);
    ctx.lineTo(0, 19);
    ctx.lineTo(-9, 12);
    ctx.lineTo(-24, 14);
    ctx.lineTo(-8, -5);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#ffb163';
    ctx.fillRect(-3, -10, 6, 12);
    ctx.restore();
  }
}
